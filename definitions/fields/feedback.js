const { field, validators: r } = require('@dwp/govuk-casa');

module.exports = () => [
  field('rating').validators([
    r.required.make({
      errorMsg: 'feedback:errors.required'
    }),
    r.inArray.make({
      source: ['Very satisfied', 'Satisfied', 'Neither satisfied or dissatisfied', 'Dissatisfied', 'Very dissatisfied'],
      errorMsg: 'feedback:errors.required'
    })
  ]),
  field('improvements').validators([
    r.required.make({
      errorMsg: 'feedback:errors.maxLength'
    }),
    r.strlen.make({
      max: 1200,
      errorMsgMax: 'feedback:errors.maxLength'
    })
  ])
];
