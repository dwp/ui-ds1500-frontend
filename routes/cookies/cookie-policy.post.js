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
    return req.session.save(() => res.redirect(req.url));
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
    return req.session.save(() => res.redirect(redirectBackTo));
  }

  return req.session.save(() => res.redirect(req.url));
};
