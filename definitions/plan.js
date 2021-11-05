// definitions/plan.js
const { Plan } = require('@dwp/govuk-casa');

module.exports = (() => {
  // Create the single "road" on our journey, adding the sequence of waypoints
  // (pages) that will be visited along the way.
  const plan = new Plan();

  plan.addSequence(
    'ds1500-start',
    'ds1500',
    'review',
    'ds1500-download'
  );

  // Define an origin starting point
  plan.addOrigin('ds1500-start', 'ds1500');
  return plan;
})();
