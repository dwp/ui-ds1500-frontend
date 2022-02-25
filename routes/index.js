const whiteListValidateRedirect = require('../lib/whiteListValidateRedirect')
const logger = require('@dwp/govuk-casa/lib/Logger')('ds1500');

module.exports = function (casaApp) {
  const { router } = casaApp
  const { mountUrl } = casaApp.config

  router.get('/', function (req, res) {
    const redirectPath = whiteListValidateRedirect('ds1500-start')
    const hasRefProperty = Object.prototype.hasOwnProperty.call(req.query, 'ref');
    if (hasRefProperty) {
      // Remember to clear the journey data if users sign's out
      casaApp.endSession(req).then(() => {
        res.status(302).redirect(encodeURI(mountUrl + redirectPath));
      }).catch((err) => {
        logger.error('Session ending error - ' + err);
        res.status(302).redirect(encodeURI(mountUrl + redirectPath));
      });
    } else {
      if (redirectPath) {
        res.status(302).redirect(encodeURI(mountUrl + redirectPath));
      } else {
        res.status(500).render('casa/errors/500');
      }
    }
  });
};
