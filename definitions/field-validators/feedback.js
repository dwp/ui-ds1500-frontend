const { validationRules: r, simpleFieldValidation: sf } = require('@dwp/govuk-casa')

const fieldValidators = {
  rating: sf([
    r.required.make({
      errorMsg: 'feedback:errors.required'
    }),
    r.inArray.make({
      source: ['Very satisfied', 'Satisfied', 'Neither satisfied or dissatisfied', 'Dissatisfied', 'Very dissatisfied'],
      errorMsg: 'feedback:errors.required'
    })
  ]),

  improvements: sf([
    r.required.make({
      errorMsg: 'feedback:errors.maxLength'
    }),
    r.strlen.make({
      max: 1200,
      errorMsgMax: 'feedback:errors.maxLength'
    })
  ])
};

module.exports = fieldValidators;
