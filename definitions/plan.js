// definitions/plan.js
const { Plan } = require('@dwp/govuk-casa');
const { isEqualTo } = require('../utils/journey-helpers')

module.exports = () => {
  // Create the single "road" on our journey, adding the sequence of waypoints
  // (pages) that will be visited along the way.
  const plan = new Plan();

  // Start service
  plan.addSequence('ds1500-start', 'select-form');

  plan.setRoute('select-form', 'ds1500', isEqualTo('selectForm', 'ds1500'));
  plan.setRoute('select-form', 'sr1-form-request', isEqualTo('selectForm', 'sr1-form-request'));

  plan.addSequence(
    'ds1500',
    'review',
    'ds1500-download'
  );

  return plan;
};
