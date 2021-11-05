const appVersion = require('../package.json').version;
const { addStaticRoute } = require('../utils/routes');
// list of static routes
const staticRoutes = ['cookies', 'cookies-table', 'accessibility-statement', 'thankyou', 'additional-guidance']

module.exports = function (casaApp) {
  const { router } = casaApp
  router.get('/ds1500-start', function (req, res) {
    const newSession = 'newSession' in req.query
    req.session.previousPage = 'ds1500-start';
    if (typeof req.session.validSession === 'undefined' || req.session.validSession) {
      req.session.validSession = true;
      res.render('ds1500-start', {
        sessionid: encodeURIComponent(req.session.id),
        appVersion,
        newSession
      });
    } else {
      res.redirect('/session-timeout')
    }
  });
  router.post('/ds1500-start', function (req, res) {
    req.session.validSession = true;
    res.render('ds1500-start', {
      sessionid: encodeURIComponent(req.session.id),
      appVersion: appVersion,
      newSession: true
    });
  });
  staticRoutes.forEach((endpoint) => {
    addStaticRoute(router, endpoint, appVersion)
  })
};
