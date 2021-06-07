/**
 *
 * @param {*} r Express router
 * @param {*} endpoint Route endpoint path
 * @param {*} appVersion Version of app
 */
const addStaticRoute = (r, endpoint, appVersion) => {
  const route = function (req, res) {
    req.session.previousPage = 'ds1500-start';
    res.render(endpoint, {
      sessionid: encodeURIComponent(req.session.id),
      appVersion
    });
  }
  r.get(`/${endpoint}`, route);
  return route
}

module.exports = {
  addStaticRoute
}
