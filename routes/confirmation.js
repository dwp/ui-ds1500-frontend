const logger = require('@dwp/govuk-casa/lib/Logger')('ds1500');
const appVersion = require('../package.json').version;

module.exports = function (casaApp) {
  const { router } = casaApp
  router.get('/confirmation', function (req, res) {
    //  Clear the journey data once submitted
    casaApp.endSession(req).then(() => {
      res.render('confirmation', {
        sessionId: encodeURIComponent(req.session.id),
        appVersion: appVersion
      });
    }).catch((err) => {
      logger.error('Session ending error - ' + err);
      res.status(500).render('casa/errors/500');
    });
  });
};
