module.exports = (cookieDetails) => (req, res) => {
  const { cookieConsentError } = req.session;
  const { t } = res.locals;
  req.session.cookieConsentError = undefined;
  res.render('pages/cookies/cookie-policy.njk', {
    cookieDetailsUrl: cookieDetails,
    formErrorsGovukArray: cookieConsentError && [{
      text: t(cookieConsentError),
      href: '#f-cookieConsent'
    }],
    formErrors: cookieConsentError && {
      cookieConsent: [{
        summary: cookieConsentError,
        inline: cookieConsentError
      }]
    }
  });
};
