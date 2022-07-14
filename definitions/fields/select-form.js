const { field, validators: r } = require('@dwp/govuk-casa');

module.exports = () => [
  field('selectForm').validators([
    r.required.make({
      errorMsg: 'select-form:selectForm.empty'
    })
  ])
];
