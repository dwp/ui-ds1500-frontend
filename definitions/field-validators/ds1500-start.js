const { validationRules: r, simpleFieldValidation: sf } = require('@dwp/govuk-casa')

// hack in include a non-capturing page in the CASA plan sequence
const fieldValidators = {
  pageId: sf([
    r.optional
  ])
}

module.exports = fieldValidators;
