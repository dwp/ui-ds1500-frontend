const { endSession } = require('@dwp/govuk-casa');
const dwpNodeLogger = require('@dwp/node-logger');
const logger = dwpNodeLogger('api');
const appVersion = require('../package.json').version;

module.exports = function (ancillaryRouter) {
  ancillaryRouter.get('/confirmation', function (req, res) {
    //  Clear the journey data once submitted
    endSession(req, () => {
      try {
        res.render('confirmation', {
          sessionId: encodeURIComponent(req.session.id),
          appVersion: appVersion
        });
      } catch (err) {
        logger.error('Session ending error - ' + err);
        res.status(500).render('casa/errors/500');
      }
    })
  });
};
