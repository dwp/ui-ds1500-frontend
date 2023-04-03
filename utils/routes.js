/**
 *
 * @param {*} r Express router
 * @param {*} endpoint Route endpoint path
 * @param {*} appVersion Version of app
 */
const addStaticRoute = (r, endpoint, submissionCommonMw, appVersion) => {
  const route = function (req, res) {
    req.session.previousPage = 'sr1-start';
    res.render(endpoint, {
      sessionid: encodeURIComponent(req.session.id),
      appVersion
    });
  }
  r.get(`/${endpoint}`, submissionCommonMw, route);
  return route
}

module.exports = {
  addStaticRoute
}
