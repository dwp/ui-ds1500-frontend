const qs = require('querystring');

module.exports = (app, consentCookieName, waypoints, mountUrl = '/', proxyMountUrl = mountUrl) => {
  const reProxyMountUrl = new RegExp(`^${proxyMountUrl}`);
  const sanitiseUrl = (url) => url.replace(reProxyMountUrl, mountUrl).replace(/\/+/g, '/');

  // URL to cookie policy page
  const cookiePolicyUrl = `${mountUrl}${waypoints.COOKIE_POLICY}`;

  // Set template options for cookie consent banner
  app.use((req, res, next) => {
    // Get cookie banner flash messages (did you accept / reject)
    if (req.session) {
      res.locals.cookieChoiceMade = req.session.cookieChoiceMade;
      req.session.cookieChoiceMade = undefined;
    }

    // Add current consent cookie value to templates
    if (req.cookies[consentCookieName]) {
      res.locals.consentCookieValue = req.cookies[consentCookieName];
    }

    // Url to submit consent to (used in banner)
    res.locals.cookieConsentSubmit = waypoints.COOKIE_CONSENT;
    res.locals.consentCookieName = consentCookieName;

    // Set backto query
    const { pathname, search } = new URL(String(req.url), 'https://dummy.test/');
    const sanitisedPath = sanitiseUrl(pathname);
    const currentUrl = sanitisedPath + search;
    res.locals.currentUrl = currentUrl;

    // If already on cookie policy page, don't need set backto again
    if (sanitisedPath === cookiePolicyUrl) {
      res.locals.cookiePolicyUrl = currentUrl;
    } else {
      res.locals.cookiePolicyUrl = `${cookiePolicyUrl}?${qs.stringify({ backto: currentUrl })}`;
    }

    next();
  });
};
