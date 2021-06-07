const logger = require('@dwp/govuk-casa/lib/Logger')('ds1500');
const appVersion = require('../package.json').version;
const notifyService = require('../lib/NotifyService');
const whiteListValidateRedirect = require('../lib/whiteListValidateRedirect')

const makeError = (text) => {
  return {
    summary: text,
    message: text,
    inline: text
  }
}

const formIsValid = (formData) => {
  return formData && !!formData.rating
}

const getErrors = (formData = {}) => {
  const errors = {}
  errors.rating = formData.rating && !!formData.rating ? [] : [makeError('Select a satisfaction rating')]
  errors.improvements = formData.improvements && formData.improvements.length <= 1200 ? [] : [makeError('Enter improvement suggestions using 1200 characters or less')]
  return errors
}

module.exports = function (casaApp, notifyEmailTo, notifyApiKey, notifyProxyHost, notifyProxyPort) {
  const { router, csrfMiddleware } = casaApp
  const { mountUrl } = casaApp.config

  let notifyProxyConfig = null

  if (notifyProxyHost != null && notifyProxyPort != null) {
    notifyProxyConfig = {
      host: notifyProxyHost,
      port: notifyProxyPort
    }
  }

  router.get('/feedback', csrfMiddleware, function (req, res) {
    res.render('feedback');
  });
  router.post('/feedback', csrfMiddleware, async function (req, res) {
    const formData = req.body || {};
    const formErrors = getErrors(formData)

    if (formIsValid(formData)) {
      try {
        await notifyService(formData, notifyEmailTo, notifyApiKey, notifyProxyConfig)
        logger.info('Feedback sent successfully');
        res.clearCookie('feedback');
        const redirectPath = whiteListValidateRedirect('thankyou')
        if (redirectPath) {
          res.redirect(encodeURI(mountUrl + redirectPath));
        } else {
          res.status(500).render('casa/errors/500');
        }
      } catch (err) {
        logger.error('Error sending feedback via notify: ' + err);
        res.status(500).render('casa/errors/500');
      }
    } else {
      res.render('feedback', {
        sessionid: encodeURIComponent(req.session.id),
        appVersion: appVersion,
        formData: formData,
        formErrors: formErrors
      });
    }
  });
};
