const whiteListValidateRedirect = require('../lib/whiteListValidateRedirect')

module.exports = function (casaApp) {
  const { router } = casaApp
  const { mountUrl } = casaApp.config

  router.get('/', function (req, res) {
    const redirectPath = whiteListValidateRedirect('ds1500-start')
    if (redirectPath) {
      res.status(302).redirect(encodeURI(mountUrl + redirectPath));
    } else {
      res.status(500).render('casa/errors/500');
    }
  });
};
