const { CONSENT_COOKIE_NAME, GTM_DOMAIN } = require('../lib/constants')

const requiredCookies = ['sessionID', CONSENT_COOKIE_NAME]
const { COOKIE_OPTIONS_DEFAULT } = require('../lib/constants')
const { DS1500_SERVICE_DOMAIN } = process.env

// Set the consent cookie and flash message to consent banner
const setCookie = (req, res, cookieName, cookieValue, useTLS = false) => {
  res.cookie(cookieName, cookieValue, {
    ...COOKIE_OPTIONS_DEFAULT,
    secure: useTLS
  });
  if (cookieName === CONSENT_COOKIE_NAME) {
    req.session.cookieChoiceMade = true;
  }
};

const clearCookie = (req, res, cookieName, options = false) => {
  if (cookieName in req.cookies) {
    res.clearCookie(cookieName, options);
  }
}

/**
 * clears all cookies (apart from the cookie_consent and sessionID)
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 */
const clearAllCookies = (req, res) => {
  Object.getOwnPropertyNames(req.cookies).forEach((cookieName) => {
    console.log('found cookie ', cookieName)
    if (requiredCookies.indexOf(cookieName) < 0) {
      const options = {}
      if (cookieName.startsWith('_ga') || cookieName.startsWith('_gid')) {
        options.domain = GTM_DOMAIN
      }
      clearCookie(req, res, cookieName, options)
      clearCookie(req, res, cookieName)
      clearCookie(req, res, cookieName, { domain: '.dwp.gov.uk' })
      clearCookie(req, res, cookieName, { domain: `.${DS1500_SERVICE_DOMAIN}` })
    } else {
      console.log(`skipped cookie: ${cookieName}`)
    }
  })
}
module.exports = {
  requiredCookies,
  setCookie,
  clearCookie,
  clearAllCookies
};
