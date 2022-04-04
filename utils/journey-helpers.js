// Return data for waypoint if provided, defaulting to route source waypoint
const data = (route, context, waypoint = route.source) => context.getDataForPage(waypoint) ||
  Object.create(null);

// Field in waypoint (route source if waypoint is undefined) is equal to value
const isEqualTo = (field, value, waypoint) => (r, c) => data(r, c, waypoint)[field] === value;

module.exports = {
  data,
  isEqualTo
};
