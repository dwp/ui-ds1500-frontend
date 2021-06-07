const expressjs = require('express');
const npath = require('path');

module.exports = function (casaApp) {
  const { router } = casaApp
  const { compiledAssetsDir: staticDir } = casaApp.config
  // Deliver project-specific CSS resources
  router.use('/css',
    expressjs.static(
      npath.resolve(staticDir, 'css'), {
        etag: false
      }
    )
  );

  // Deliver project-specific JS resources
  router.use('/js',
    expressjs.static(
      npath.resolve(staticDir, 'js'), {
        etag: false
      }
    )
  );

  // Deliver project-specific img resources
  router.use('/img',
    expressjs.static(
      npath.resolve(staticDir, 'img'), {
        etag: false
      }
    )
  );

  // Deliver project-specific data resources
  router.use('/data',
    expressjs.static(
      npath.resolve(staticDir, 'data'), {
        etag: false
      }
    )
  );
};
