const chai = require('chai');
const expect = chai.expect;
const { formatServiceData } = require('../../../utils/submission-service');

describe('submission-service', () => {
  const validDate = {
    yyyy: '2000', mm: '01', dd: '01'
  }

  const validDateSummary = {
    yyyy: '2000', mm: '01', dd: '01'
  }

  const validForm = {
    patientDateOfBirth: { ...validDate },
    dateOfDiagnosis: { ...validDateSummary }
  }

  const expectedServiceData = {
    'patientDateOfBirth-day': validDate.dd,
    'patientDateOfBirth-month': validDate.mm,
    'patientDateOfBirth-year': validDate.yyyy,
    'dateOfDiagnosis-month': validDateSummary.mm,
    'dateOfDiagnosis-year': validDateSummary.yyyy
  }

  const result = formatServiceData(validForm)

  it('should return an object with expected keys', () => {
    expect(Object.keys(result)).to.eql(Object.keys(expectedServiceData))
  })

  it('should return expected result', () => {
    expect(result).to.eql(expectedServiceData)
  })

  it('should format data if provided declaration equals "Specialist nurse" then formats to "declaration:Other" and "declarationAdditionalDetail:Specialist nurse"', () => {
    const inputData = {
      declaration: 'Specialist nurse',
      ...validForm
    }
    const outputData = {
      declaration: 'Other',
      declarationAdditionalDetail: 'Specialist nurse',
      ...expectedServiceData
    }

    expect(formatServiceData(inputData)).to.eql(outputData)
  })
})
