const { validationRules: r, simpleFieldValidation: sf } = require('@dwp/govuk-casa')

const fieldValidators = {
  pageId: sf([
    r.optional
  ])
};

module.exports = fieldValidators;
