const appVersion = require('../package.json').version;
const { addStaticRoute } = require('../utils/routes');
// list of static routes
const staticRoutes = ['cookies', 'cookies-table', 'accessibility-statement', 'feedback-sent', 'additional-guidance']

module.exports = function (ancillaryRouter, csrfMiddleware) {
  // Submission handlers
  const submissionCommonMw = [csrfMiddleware];
  staticRoutes.forEach((endpoint) => {
    addStaticRoute(ancillaryRouter, endpoint, submissionCommonMw, appVersion)
  })
};
