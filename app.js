/* eslint-disable */
/**
 * Application entry point.
 */
const path = require('path');
const { configure } = require('@dwp/govuk-casa');
const express = require('express');
const cookieMiddleware = require('./middleware/cookie-message');
const cookiePolicyGet = require('./routes/cookies/cookie-policy.get');
const cookiePolicyPost = require('./routes/cookies/cookie-policy.post');
const cookieDetailsGet = require('./routes/cookies/cookie-details.get');
const timeoutMiddleware = require('./middleware/session-timeout.js');

const { CONSENT_COOKIE_NAME, COOKIE_CONSENT, COOKIE_POLICY, COOKIE_DETAILS, SESSIONID, COOKIE_OPTIONS_DEFAULT, waypoints } = require('./lib/constants.js');
const { SESSIONS_TTL } = process.env

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
const expressSession = require('express-session');
let sessionStore;
let redisClient;
if (appConfig.REDIS_PORT && appConfig.REDIS_HOST) {
  const RedisStore = require('connect-redis')(expressSession);
  const Redis = require('ioredis');
  redisClient = (appConfig.REDIS_CLUSTER)
    ? new Redis.Cluster([{
      host: appConfig.REDIS_HOST, // eslint-disable-line
      port: appConfig.REDIS_PORT // eslint-disable-line
    }], { // eslint-disable-line
      redisOptions: { // eslint-disable-line
        db: 0 // eslint-disable-line
      } // eslint-disable-line
    }) // eslint-disable-line
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

// Create a new CASA app instance
const app = express();

if (appConfig.SECURE_COOKIES === true) {
  app.enable('trust proxy');
}

const casaApp = configure(app, {
  mountUrl: '/',
  views: {
    dirs: ['./views', './alpha/views', 'node_modules/hmrc-frontend',]
  },
  // Any css/js compiled on-the-fly will be written to and served from here
  compiledAssetsDir: path.resolve(__dirname, './static/'),
  phase: 'beta',
  // This will be passed through the i18n translator
  serviceName: 'app:serviceName',
  sessions: {
    name: SESSIONID,
    store: sessionStore,
    secret: appConfig.SESSIONS_SECRET,
    ttl: appConfig.SESSIONS_TTL, // seconds
    // Only set to true if you're running a secure server
    secure: appConfig.SECURE_COOKIES
  },
  i18n: {
    // Loaded in this order, with later content taking precedence
    dirs: ['./locales'],
    // Default language is first in this list
    locales: ['en']
  },
  headers: {
    // These headers are set by nginx, so to avoid duplicates we disable them
    disabled: []
  },
  csp: { // @TODO conditional set domain for dev and production envs
    'style-src': [
      '\'self\'',
      'https://tagmanager.google.com https://fonts.googleapis.com'
    ],
    'img-src': [
      '\'self\'',
      'https://www.gov.uk',
      'https://ssl.gstatic.com', 'https://www.gstatic.com',
      'https://www.google-analytics.com', 'data:'
    ],
    'font-src': [
      '\'self\'',
      'https://fonts.gstatic.com', 'data:'
    ],
    'connect-src': [
      '\'self\'',
      'https://www.google-analytics.com'
    ]
  },
  sessionExpiryController: (req, res, next) => {
      next();
  },
  mountController: function casaMountController(mountCommonMiddleware) {
    mountCommonMiddleware();
    cookieMiddleware(
      this.expressApp,
      '/',
      '/',
      CONSENT_COOKIE_NAME,
      COOKIE_POLICY,
      COOKIE_CONSENT,
      appConfig.SECURE_COOKIES
    );
    timeoutMiddleware(
      this.expressApp,
      "/",
      waypoints,
      appConfig.SESSIONS_TTL,
      appConfig.TIMEOUT_DIALOG_COUNTDOWN,
    );

  }
});

// add filters
const nunjucksEnv = app.get('nunjucksEnv')

nunjucksEnv.addGlobal('getContext', function () {
  const ctx = { ...this.ctx }
  // circular dependancy fix
  delete ctx.settings
  return JSON.parse(JSON.stringify(ctx))
});

nunjucksEnv.addFilter('isIn', function (val, arr) {
  return arr.indexOf(val) > -1
})

app.use('/public', express.static(path.join(__dirname, '/static/public')))
app.use('/assets', express.static(path.join(__dirname, '/node_modules/govuk-frontend/govuk/assets')))

// Custom middleware
require('./middleware/media')(casaApp);
require('./middleware/nonce')(casaApp, true);
// Custom routes
// These routes will execute any matched URL before any CASA journey routes.
require('./routes/index')(casaApp);
require('./routes/static')(casaApp);
require('./routes/feedback')(casaApp, appConfig.NOTIFY_EMAILTO, appConfig.NOTIFY_APIKEY, appConfig.NOTIFY_PROXY_HOST, appConfig.NOTIFY_PROXY_PORT);

casaApp.loadDefinitions(
  require('./definitions/pages.js'),
  require('./definitions/plan.js')
);

// Submission handlers
const submissionCommonMw = [casaApp.csrfMiddleware];

// Cookie policy pages
casaApp.router.get(`/${COOKIE_POLICY}`, submissionCommonMw, cookiePolicyGet(COOKIE_DETAILS));
casaApp.router.post(`/${COOKIE_POLICY}`, submissionCommonMw, cookiePolicyPost(CONSENT_COOKIE_NAME, appConfig.SECURE_COOKIES));
casaApp.router.get(`/${COOKIE_DETAILS}`, submissionCommonMw, cookieDetailsGet(
  CONSENT_COOKIE_NAME,
  SESSIONID,
  appConfig.SESSIONS_TTL
));

// Session keep alive, timeout dialog hits this end point to extend session
casaApp.router.get(`/${waypoints.SESSION_KEEP_ALIVE}`, (req, res) => {
  try {
    const cookieValue = req.cookies[SESSIONID]
    const cookieOptions = {
      ...COOKIE_OPTIONS_DEFAULT,
      expires: SESSIONS_TTL,
      secure: appConfig.SECURE_COOKIES
    }

    res.cookie(SESSIONID, cookieValue, cookieOptions);

    res.status(200).json({ status: 200, message: 'OK' });
  } catch (err) {
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
});

// Setup SSL
let httpsServer
if (appConfig.SERVER_SSL_ENABLED) {
  const fs = require('fs');
  httpsServer = require('https').createServer({
    key: fs.readFileSync(appConfig.SERVER_SSL_KEYFILE),
    cert: fs.readFileSync(appConfig.SERVER_SSL_CERTFILE),
    ca: fs.readFileSync(appConfig.SERVER_SSL_CACERTFILE)
  }, app);
}
// Start server
const server = (appConfig.SERVER_SSL_ENABLED ? httpsServer : app)
  .listen(appConfig.SERVER_PORT || 3000, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
  });
