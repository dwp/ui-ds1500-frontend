const { validationRules: r, simpleFieldValidation: sf } = require('@dwp/govuk-casa')

const fieldValidators = {
  selectForm: sf([
    r.required.make({
      errorMsg: 'select-form:selectForm.empty'
    })
  ])
}

module.exports = fieldValidators;
