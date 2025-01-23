const pages = require('../../definitions/pages');
const pageNames = pages({ mountUrl: '/' });

const startPageUrl = '/sr1-start';
const cookiePolicyUrl = '/cookie-policy';

const allowedUrls = pageNames
  .filter((item) => item.waypoint && typeof item.waypoint === 'string' && item.waypoint.trim() !== '')
  .map((item) => `/${item.waypoint}`);

allowedUrls.push(cookiePolicyUrl);
allowedUrls.push('/cookies');
allowedUrls.push('/cookies-table');
allowedUrls.push('/accessibility-statement');
allowedUrls.push('feedback-sent');
allowedUrls.push('/additional-guidance');

function getOneYearInMilliseconds () {
  const currYear = new Date().getFullYear();
  const isLeap = year => new Date(year, 1, 29).getDate() === 29;
  const days = isLeap(currYear) ? 366 : 365;
  return 1000 * 60 * 60 * 24 * days
}

module.exports = (consentCookieName, mountUrl, gtmDomain, useTLS = false) => (req, res) => {
  const { cookieConsent } = req.body;
  const oneYearInMilliseconds = getOneYearInMilliseconds();

  // Validation error, set messeage in session and redirect back to this page
  if (!cookieConsent || (cookieConsent !== 'reject' && cookieConsent !== 'accept')) {
    req.session.cookieConsentError = 'cookie-policy:field.cookieConsent.required';

    if (allowedUrls.includes(req.url) || allowedUrls.some((url) => req.url.startsWith(url))) {
      return req.session.save(() => res.redirect(req.url));
    }

    return res.redirect(cookiePolicyUrl);
  }

  // Validation successful, set cookie and redirect back where they came from
  // via backto query string, if it exists
  res.cookie(consentCookieName, cookieConsent, {
    path: mountUrl,
    maxAge: oneYearInMilliseconds,
    httpOnly: true,
    sameSite: 'Strict',
    secure: useTLS
  });

  // Show cookie accepted / rejected banner
  req.session.cookieChoiceMade = true;

  // If rejected, remove any GA cookies
  if (cookieConsent === 'reject' && req.headers.cookie) {
    const { DS1500_SERVICE_DOMAIN } = process.env;
    const gatCookieName = req.headers.cookie.match(/_gat[^=;]*/);
    const options = { path: '/' };

    if (`${DS1500_SERVICE_DOMAIN}`.includes(gtmDomain)) {
      options.domain = gtmDomain;
    } else {
      options.domain = `${DS1500_SERVICE_DOMAIN}`;
    }

    if (gatCookieName) {
      res.clearCookie(gatCookieName[0], options);
    }

    res.clearCookie('_ga', options);
    res.clearCookie('_gid', options);
  }

  // backto querystring contains the URL to redirect to
  if (req.query.backto) {
    const { pathname, search } = new URL(String(req.query.backto), 'https://dummy.test/');
    const redirectBackTo = (pathname + search).replace(/\/+/g, '/').replace(/[.:]+/g, '');

    if (allowedUrls.includes(redirectBackTo)) {
      return req.session.save(() => res.redirect(redirectBackTo));
    }
  }

  if (allowedUrls.includes(req.url)) {
    return req.session.save(() => res.redirect(req.url));
  }

  return res.redirect(startPageUrl);
};
