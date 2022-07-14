const ExpressJS = require('express');
const { static: expressStatic } = ExpressJS;
const { resolve } = require('path');

module.exports = (staticRouter, aggresivelyCache) => {
  const staticDir = resolve(__dirname, '../static/')
  const oneDay = 86400000;
  const setHeaders = (req, res, next) => {
    res.set('cache-control', 'public');
    res.set('pragma', 'cache');
    res.set('expires', new Date(Date.now() + oneDay).toUTCString());
    const { pathname } = new URL(req?.originalUrl ?? '', 'https://placeholder.test/');
    if (pathname.substr(-4) === '.css') {
      // Just needed for our in-memory CSS assets
      res.set('content-type', 'text/css');
    }
    next();
  };

  const cacheOptions = aggresivelyCache
    ? {
        etag: false,
        lastModified: false,
        immutable: true,
        maxAge: 31536000000,
        setHeaders: (res) => {
          setHeaders(null, res, () => {});
        }
      }
    : {
        etag: true,
        lastModified: true,
        setHeaders: (res) => {
          setHeaders(null, res, () => {});
        }
      };

  // Deliver project-specific CSS resources
  staticRouter.use('/css',
    expressStatic(
      resolve(staticDir, 'css'), cacheOptions
    )
  );

  // Deliver project-specific JS resources
  staticRouter.use('/js',
    expressStatic(
      resolve(staticDir, 'js'), cacheOptions
    )
  );

  // Deliver project-specific img resources
  staticRouter.use('/img',
    expressStatic(
      resolve(staticDir, 'img'), cacheOptions
    )
  );

  // Deliver project-specific data resources
  staticRouter.use('/data',
    expressStatic(
      resolve(staticDir, 'data'), cacheOptions
    )
  );

  staticRouter.use('/public', expressStatic(resolve('./static/', 'public'), cacheOptions));
  staticRouter.use('/assets', expressStatic('./node_modules/govuk-frontend/govuk/assets', cacheOptions));
};
