const ExpressJS = require('express');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const { configure } = require('@dwp/govuk-casa');
const { resolve } = require('path');
const packageMeta = require('./package.json');

const actuator = require('./routes/actuator/index');
const cookiePolicyGet = require('./routes/cookies/cookie-policy.get');
const cookiePolicyPost = require('./routes/cookies/cookie-policy.post');
const cookieDetailsGet = require('./routes/cookies/cookie-details.get');

const cookieMiddleware = require('./middleware/cookie-message');
const timeoutMiddleware = require('./middleware/session-timeout.js');

const pages = require('./definitions/pages.js');
const plan = require('./definitions/plan.js')();

const { CONSENT_COOKIE_NAME, GTM_DOMAIN, COOKIE_POLICY, COOKIE_DETAILS, SESSIONID, waypoints } = require('./lib/constants.js');

// Load app config from `.env`
const appConfig = Object.assign({}, process.env);

try {
  require('./lib/EnvValidator')(appConfig);
} catch (e) {
  console.log('Environment is misconfigured - ' + e);
  process.exit(1);
}
if (appConfig.NOTIFY_PROXY_HOST === 'null') {
  appConfig.NOTIFY_PROXY_HOST = null;
}

if (appConfig.NOTIFY_PROXY_PORT === 'null') {
  appConfig.NOTIFY_PROXY_PORT = null;
}

// Prepare a session store
let sessionStore;
let redisClient;
if (appConfig.REDIS_PORT && appConfig.REDIS_HOST) {
  const RedisStore = require('connect-redis').default;
  const Redis = require('ioredis');
  let clusterOptions = {
    redisOptions: { db: 0 }
  };

  // Check whether redis is using transit encryption and amend clusterOptions if so
  if (appConfig.REDIS_ENCRYPTION_TRANSIT) {
    clusterOptions = {
      dnsLookup: (address, callback) => callback(null, address),
      redisOptions: { db: 0, tls: {} }
    };
  }

  redisClient = (appConfig.REDIS_CLUSTER)
    ? new Redis.Cluster([{
      host: appConfig.REDIS_HOST,
      port: appConfig.REDIS_PORT
    }], clusterOptions)
    : new Redis({
      host: appConfig.REDIS_HOST,
      port: appConfig.REDIS_PORT,
      db: 0
    });

  let retryCount = 0;
  const REDIS_MAX_RETRY = 20;
  redisClient.on('error', (e) => {
    retryCount++;
    if (retryCount > REDIS_MAX_RETRY) {
      process.exit(1);
    }
  });

  // Create session store
  sessionStore = new RedisStore({
    client: redisClient,
    secret: appConfig.SESSIONS_SECRET,
    prefix: 'ds1500:',
    ttl: parseInt(appConfig.SESSIONS_TTL),
    logErrors: (err) => {
      console.log(err);
    }
  });
} else {
  console.log('Using default session store');
  const MemoryStore = require('memorystore')(expressSession);
  sessionStore = new MemoryStore({
    checkPeriod: 86400000
  });
}

const application = ({
  MOUNT_URL = '/'
}) => {
  // Configure some CASA routes and other middleware for use in our CASA app
  const { nunjucksEnv, staticRouter, ancillaryRouter, csrfMiddleware, mount } = configure({
    mountUrl: MOUNT_URL,
    views: [
      resolve(__dirname, './views'),
      resolve(__dirname, './alpha/views'),
      resolve(__dirname, './node_modules/hmrc-frontend')
    ],
    session: {
      name: SESSIONID,
      store: sessionStore,
      secret: appConfig.SESSIONS_SECRET,
      ttl: appConfig.SESSIONS_TTL, // seconds
      // Only set to true if you're running a secure server
      secure: appConfig.SECURE_COOKIES
    },
    i18n: {
      dirs: [resolve(__dirname, './locales')],
      locales: ['en']
    },
    pages: pages({ mountUrl: MOUNT_URL }),
    plan,
    helmetConfigurator: (config) => {
      // This will add the `data:` schema to the list of valid sources in the
      // `img-src` directive
      config.contentSecurityPolicy.directives['img-src'].push('data:');

      // Only upgrade http requests in prod
      if (appConfig.NODE_ENV !== 'production') {
        config.contentSecurityPolicy.directives.upgradeInsecureRequests = null;
      }

      return config;
    }
  });

  // Add some custom media assets (CSS, JS) to be served from the CASA router.
  // Serve this up before CASA middleware
  require('./middleware/media')(staticRouter, appConfig.AGGRESSIVE_ASSET_CACHING);

  // add filters
  nunjucksEnv.addGlobal('getContext', function () {
    const ctx = { ...this.ctx }
    // circular dependancy fix
    delete ctx.settings
    return JSON.parse(JSON.stringify(ctx))
  });

  // Add release version number to views
  nunjucksEnv.addGlobal('version', packageMeta.version);

  // Add Google Tag Manger ID to view
  nunjucksEnv.addGlobal('googleTagManagerId', appConfig.GOOGLE_TAG_MANAGER_ID);
  nunjucksEnv.addFilter('isIn', function (val, arr) {
    return arr.indexOf(val) > -1
  });

  // Example of how to mount a handler for the `/` index route. Need to use a
  ancillaryRouter.all('/', (req, res, next) => {
    res.status(302).redirect(encodeURI(MOUNT_URL + waypoints.START));
  });

  // Example: Adding custom routes before page handlers
  // You can do this by adding a route/middleware to the `ancillaryRouter`.
  require('./routes/static')(ancillaryRouter, csrfMiddleware);
  require('./routes/confirmation')(ancillaryRouter);
  require('./routes/feedback')(ancillaryRouter, csrfMiddleware, MOUNT_URL, appConfig.NOTIFY_EMAILTO, appConfig.NOTIFY_APIKEY, appConfig.NOTIFY_PROXY_HOST, appConfig.NOTIFY_PROXY_PORT);

  // Cookie policy pages
  ancillaryRouter.get(`/${COOKIE_POLICY}`, csrfMiddleware, cookiePolicyGet(COOKIE_DETAILS));
  ancillaryRouter.post(`/${COOKIE_POLICY}`, csrfMiddleware, cookiePolicyPost(CONSENT_COOKIE_NAME, MOUNT_URL, GTM_DOMAIN, appConfig.SECURE_COOKIES));
  ancillaryRouter.get(`/${COOKIE_DETAILS}`, csrfMiddleware, cookieDetailsGet(
    CONSENT_COOKIE_NAME,
    SESSIONID,
    appConfig.SESSIONS_TTL
  ));

  timeoutMiddleware(
    ancillaryRouter,
    '/',
    '/',
    waypoints,
    appConfig.SESSIONS_TTL,
    appConfig.TIMEOUT_DIALOG_COUNTDOWN
  );

  // Session keep alive, timeout dialog hits this end point to extend session
  ancillaryRouter.get(`/${waypoints.SESSION_KEEP_ALIVE}`, (req, res) => {
    res.status(200).end();
  });

  // User ended session
  ancillaryRouter.get(`/${waypoints.SESSION_ENDED}`, (req, res, next) => {
    req.session.regenerate((error) => {
      if (error) {
        return next(error);
      } else {
        return req.session.save(() => res.status(200).redirect('/'));
      }
    });
  });

  // middleware
  cookieMiddleware(
    ancillaryRouter,
    CONSENT_COOKIE_NAME,
    waypoints,
    '/',
    '/'
  );

  // Now mount all CASA's routers and middleware
  // You cannot mount anything after this point because CASA will add its own
  // fall-through and error handling middleware
  const casaApp = ExpressJS();
  if (appConfig.SECURE_COOKIES === true) {
    casaApp.set('trust proxy', 1);
  }
  mount(casaApp);

  // Finally, mount our CASA app on the desired mountUrl. Here, you could also
  // specify a proxy prefix if you were using nginx rewriting, for example.
  const app = ExpressJS();

  // Load the router index controller for the health endpoints
  // /actuator/health
  app.use('/', actuator());
  app.use(ExpressJS.json({ limit: '5mb' }));
  app.use(ExpressJS.urlencoded({ limit: '5mb', extended: true }));

  // cookie middleware
  app.use(cookieParser('secret'))

  app.use(MOUNT_URL, casaApp);

  // Return the base web app
  return app;
};

// Setup SSL
let httpsServer
if (appConfig.SERVER_SSL_ENABLED) {
  const fs = require('fs');
  httpsServer = require('https').createServer({
    key: fs.readFileSync(appConfig.SERVER_SSL_KEYFILE),
    cert: fs.readFileSync(appConfig.SERVER_SSL_CERTFILE),
    ca: fs.readFileSync(appConfig.SERVER_SSL_CACERTFILE)
  }, application({ MOUNT_URL: '/' }))
}

// Start server
const server = (appConfig.SERVER_SSL_ENABLED ? httpsServer : application({ MOUNT_URL: '/' }))
  .listen(appConfig.SERVER_PORT || 3000, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
  });
