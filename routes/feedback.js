const dwpNodeLogger = require('@dwp/node-logger');
const logger = dwpNodeLogger('api');
const appVersion = require('../package.json').version;
const notifyService = require('../lib/NotifyService');
const whiteListValidateRedirect = require('../lib/whiteListValidateRedirect')

module.exports = function (ancillaryRouter, csrfMiddleware, ...args) {
  const [mountUrl, notifyEmailTo, notifyApiKey, notifyProxyHost, notifyProxyPort] = args
  let notifyProxyConfig = null

  if (notifyProxyHost != null && notifyProxyPort != null) {
    notifyProxyConfig = {
      host: notifyProxyHost,
      port: notifyProxyPort
    }
  }

  ancillaryRouter.get('/feedback', csrfMiddleware, function (req, res) {
    res.render('feedback');
  });
  ancillaryRouter.post('/feedback', csrfMiddleware, async function (req, res) {
    const formData = req.body || {};
    const { t } = res.locals;
    const errors = {}
    const errorList = []

    if (!formData.rating) {
      errors.rating = [{
        summary: t('feedback:errors.required'),
        message: t('feedback:errors.required'),
        inline: t('feedback:errors.required')
      }]
      errorList.push({
        text: t('feedback:errors.required'),
        href: '#f-rating-error'
      })
    }

    if (formData.improvements.length >= 1200) {
      errors.improvements = [{
        summary: t('feedback:errors.maxLength'),
        message: t('feedback:errors.maxLength'),
        inline: t('feedback:errors.maxLength')
      }]
      errorList.push({
        text: t('feedback:errors.maxLength'),
        href: '#improvements-error'
      })
    }

    if (errorList.length === 0) {
      try {
        await notifyService(formData, notifyEmailTo, notifyApiKey, notifyProxyConfig)
        logger.info('Feedback sent successfully');
        res.clearCookie('feedback');
        const redirectPath = whiteListValidateRedirect('feedback-sent')
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
        appVersion,
        formData,
        formErrors: errors,
        formErrorsGovukArray: errorList
      });
    }
  });
};
