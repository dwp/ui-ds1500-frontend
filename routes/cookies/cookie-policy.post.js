const url = require('url');
const { setCookie, clearAllCookies } = require('../../utils/cookies');
const { COOKIE_UPDATE_QUERY_PARAM } = require('../../lib/constants')

module.exports = (consentCookieName, useTLS) => (req, res) => {
  const { cookieConsent } = req.body;
  let redirectPath
  // Validation error, set messeage in session and redirect back to this page
  if (!cookieConsent || (cookieConsent !== 'reject' && cookieConsent !== 'accept')) {
    req.session.cookieConsentError = 'cookie-policy:field.cookieConsent.required';
    redirectPath = req.originalUrl
  } else {
    // Validation successful, set cookie and redirect back where they came from
    // via backto query string, if it exists
    setCookie(req, res, consentCookieName, cookieConsent, useTLS);
    if (cookieConsent === 'reject') {
      clearAllCookies(req, res)
    }

    redirectPath = req.body.previousPage ? req.body.previousPage : '/cookie-policy';
  }

  const qs = {};
  qs[COOKIE_UPDATE_QUERY_PARAM] = 1;
  const redirectUrl = url.format({
    pathname: redirectPath,
    query: Object.assign({}, req.query, qs)
  });

  req.session.save(() => res.redirect(redirectUrl));
};
