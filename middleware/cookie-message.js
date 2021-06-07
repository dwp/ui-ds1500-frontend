const cookieParser = require('cookie-parser');
const { setCookie, clearAllCookies } = require('../utils/cookies');
const logger = require('@dwp/govuk-casa/lib/Logger')('ds1500');
const { COOKIE_UPDATE_QUERY_PARAM } = require('../lib/constants')
// Load app config from `.env`

// eslint-disable-next-line max-len
module.exports = (app, proxyUrl, proxyMountUrl, consentCookieName, cookiePolicy, cookieConsent, useTLS) => {
  // URL to cookie policy page
  const cookieDetailsUrl = `${proxyUrl}cookie-details`;

  // ignore in test mode
  if (process.env.NODE_ENV !== 'test') {
    app.use(cookieParser());
  }

  // Set template options for cookie consent banner
  app.use((req, res, next) => {
    const staticPatt = /^\/(assets|css|images|js)/gi;
    const cookiePolicyUrl = `${proxyUrl}${cookiePolicy}`;
    if (staticPatt.test(req.path)) {
      logger.info('Skipping static path');
      next();
      return;
    }
    const defaults = {
      COOKIE_CONSENT_CHOICE: null
    };
    const cookies = Object.assign({}, defaults, req.cookies);
    const cookieValue = cookies[consentCookieName]
    const isChoiceMade = () => {
      const validChoices = ['accept', 'reject']
      return cookieValue && validChoices.indexOf(cookieValue) > -1
    };
    // Get cookie banner flash messages (did you accept / reject)
    if (req.session) {
      res.locals.cookieChoiceMade = isChoiceMade()
      req.session.cookieChoiceMade = isChoiceMade();
    }

    // Add current consent cookie value to templates
    if (req.cookies[consentCookieName]) {
      res.locals.cookieMessage = cookieValue;
    } else {
      res.locals.cookieMessage = 'unset';
    }

    // Url to submit consent to (used in banner)
    res.locals.cookieConsentSubmit = cookieConsent;
    res.locals.showCookieConstentMessage = !isChoiceMade();
    res.locals.showCookieChoiceConfirmationBanner = parseInt(req.query[COOKIE_UPDATE_QUERY_PARAM], 10) === 1;
    res.locals.cookiesConsented = cookieValue
    res.locals.currentPage = req.path;
    res.locals.previousPage = req.query.previousPage;
    res.locals.cookiePolicyUrl = cookiePolicyUrl;

    // Set backto query
    res.locals.cookieDetailsUrl = cookieDetailsUrl
    res.locals.currentPage = encodeURIComponent(req.path)
    res.locals.previousPage = req.query.previousPage
    // Set referrer policy
    res.set('Referrer-Policy', 'same-origin');
    next();
  });

  // Handle setting consent cookie from banner submisson
  app.post(`${proxyMountUrl}${cookieConsent}/:cookieMethod`, (req, res) => {
    const url = require('url');
    const cookiePolicyUrl = `${proxyUrl}${cookiePolicy}`;
    const { cookieMethod } = req.params;
    let redirectPath
    const referrer = req.get('Referrer');

    if (referrer) {
      const { pathname } = new url.URL(referrer)
      redirectPath = pathname
    } else {
      redirectPath = cookiePolicyUrl
    }

    if (cookieMethod === 'reject' || cookieMethod === 'accept') {
      setCookie(req, res, consentCookieName, cookieMethod, useTLS);
      if (cookieConsent === 'reject') {
        clearAllCookies(req, res)
      }
    }

    const qs = {};
    qs[COOKIE_UPDATE_QUERY_PARAM] = 1;
    const redirectUrl = url.format({
      pathname: redirectPath,
      query: Object.assign({}, qs)
    });

    res.redirect(redirectUrl);
  });
};
