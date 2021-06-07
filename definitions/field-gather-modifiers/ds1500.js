const { gatherModifiers } = require('@dwp/govuk-casa');

const fieldGatherModifiers = {
  patientName: gatherModifiers.trimWhitespace,
  patientPostcode: gatherModifiers.trimWhitespace,
  patientNino: gatherModifiers.trimWhitespace,
  patientDateOfBirth: (value) => {
    let { fieldValue } = value
    fieldValue = Object.keys(fieldValue).forEach((key) => {
      fieldValue[key] = !fieldValue[key] ? fieldValue[key] : fieldValue[key].trim()
    })
    return value.fieldValue
  },
  dateOfDiagnosis: (value) => {
    let { fieldValue } = value
    fieldValue = Object.keys(fieldValue).forEach((key) => {
      fieldValue[key] = !fieldValue[key] ? fieldValue[key] : fieldValue[key].trim()
    })
    return value.fieldValue
  },
  representativePostcode: gatherModifiers.trimWhitespace,
  gmcNumber: gatherModifiers.trimWhitespace,
  gpPhone: gatherModifiers.trimWhitespace
};

module.exports = fieldGatherModifiers
