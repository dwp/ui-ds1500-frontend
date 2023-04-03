// definitions/plan.js
const { Plan } = require('@dwp/govuk-casa');

module.exports = () => {
  // Create the single "road" on our journey, adding the sequence of waypoints
  // (pages) that will be visited along the way.
  const plan = new Plan();

  plan.addSequence(
    'sr1-start',
    'sr1',
    'review',
    'sr1-download'
  );

  return plan;
};
