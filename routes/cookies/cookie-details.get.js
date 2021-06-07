module.exports = (consentCookieName, sessionCookieName, sessionTtl) => (req, res) => {
  res.render('pages/cookies/cookie-details.njk', {
    cookiePolicyUrl: decodeURIComponent(res.locals.cookiePolicyUrl).replace('=/cookie-details?backto', ''),
    sessionMinutes: sessionTtl / 60,
    consentCookieName,
    sessionCookieName
  });
};
