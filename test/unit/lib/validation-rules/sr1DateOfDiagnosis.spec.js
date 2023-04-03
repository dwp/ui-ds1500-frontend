const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const {
  isEmptyDateOfDiagnosis,
  isDateNumeric,
  isValidDateRange,
  isDateOfDiagnosisInFuture,
  isDateBeforeDoB
} = require('../../../../lib/validation-rules/sr1DateOfDiagnosis');

const expectedErrorMsg = (fieldName, errKey, focusSfx = []) => {
  return [{
    focusSuffix: focusSfx,
    inline: `sr1:${fieldName}.${errKey}`,
    message: `sr1:${fieldName}.${errKey}`,
    summary: `sr1:${fieldName}.${errKey}`,
    variables: {},
    field: undefined,
    fieldHref: undefined,
    fieldKeySuffix: undefined,
    validator: undefined
  }]
}

describe('sr1 validations: Date of Diagnosis', () => {
  let dataContext = { fieldName: 'dateOfDiagnosis' }
  describe('isEmptyDateOfDiagnosis', () => {
    it('should throw error message if both MM and YYYY are empty', () => {
      const fieldValue = { mm: '', yyyy: '' };
      return expect(isEmptyDateOfDiagnosis(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'empty', ['[mm]', '[yyyy]']))
    })
    it('should throw error message if MM is empty', () => {
      dataContext = { fieldName: 'dateOfDiagnosis[mm]' }
      const fieldValue = { mm: '', yyyy: '2020' };
      return expect(isEmptyDateOfDiagnosis(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'empty', '[mm]'))
    })
    it('should throw error message if YYYY is empty', () => {
      dataContext = { fieldName: 'dateOfDiagnosis[yyyy]' }
      const fieldValue = { mm: '12', yyyy: '' };
      return expect(isEmptyDateOfDiagnosis(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'empty', '[yyyy]'))
    })
    it('should not throw error message if both MM and YYYY are provided', () => {
      const fieldValue = { mm: '12', yyyy: '2020' };
      return expect(isEmptyDateOfDiagnosis(fieldValue)).to.eql([])
    })
  })

  describe('isDateNumeric', () => {
    it('should throw error message if both MM and YYYY are non numeric', () => {
      dataContext = { fieldName: 'dateOfDiagnosis' }
      const fieldValue = { mm: '12c', yyyy: '20-20' };
      return expect(isDateNumeric(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'isNumeric', ['[mm]', '[yyyy]']))
    })
    it('should throw error message if MM is non numeric', () => {
      const fieldValue = { mm: '12c', yyyy: '2020' };
      return expect(isDateNumeric(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'isNumeric', '[mm]'))
    })
    it('should throw error message if YYYY is non numeric', () => {
      const fieldValue = { mm: '12', yyyy: '20-20' };
      return expect(isDateNumeric(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'isNumeric', '[yyyy]'))
    })
    it('should not throw error message if both MM and YYYY are numeric', () => {
      const fieldValue = { mm: '12', yyyy: '2020' };
      return expect(isDateNumeric(fieldValue)).to.eql([])
    })
  })

  describe('isValidDateRange', () => {
    it('should throw error message if both MM and YYYY are non in range', () => {
      const fieldValue = { mm: '13', yyyy: '1888' };
      return expect(isValidDateRange(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'range', ['[mm]', '[yyyy]']))
    })
    it('should throw error message if MM is not in range[1-12]', () => {
      dataContext = { fieldName: 'dateOfDiagnosis[mm]' }
      const fieldValue = { mm: '14', yyyy: '2020' };
      return expect(isValidDateRange(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'range', '[mm]'))
    })
    it('should throw error message if YYYY is non in range[1890-present]', () => {
      dataContext = { fieldName: 'dateOfDiagnosis[yyyy]' }
      const year = new Date().getFullYear() + 1
      const fieldValue = { mm: '10', yyyy: year };
      return expect(isValidDateRange(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'range', '[yyyy]'))
    })
    it('should not throw error message if both MM and YYYY are in range', () => {
      const fieldValue = { mm: '12', yyyy: '2020' };
      return expect(isValidDateRange(fieldValue)).to.eql([])
    })
  })

  describe('isDateOfDiagnosisInFuture', () => {
    let clock;
    beforeEach(() => {
      // stub date to 01/01/2020
      clock = sinon.useFakeTimers(new Date(2020, 1, 1).getTime());
    })
    afterEach(() => {
      // restore to original date
      clock.restore();
    })

    it('should throw error message if Date of diagnosis is present year and future month', () => {
      dataContext = { fieldName: 'dateOfDiagnosis' }
      const fieldValue = { mm: '03', yyyy: '2020' };
      return expect(isDateOfDiagnosisInFuture(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'future', ['[mm]', '[yyyy]']))
    })
    it('should not throw error message if both MM and YYYY are in range', () => {
      const fieldValue = { mm: '01', yyyy: '2020' };
      return expect(isDateOfDiagnosisInFuture(fieldValue)).to.eql([])
    })
  })

  describe('isDateBeforeDoB', () => {
    it('should throw error message if dateOfDiagnosis is before dateOfBirth', () => {
      const dateOfDiagnosis = { mm: '10', yyyy: '2010' }
      dataContext = {
        waypoint: 'testPage',
        fieldName: 'dateOfDiagnosis',
        journeyContext: {
          getDataForPage: function (waypoint) {
            return this[waypoint]
          },
          testPage: {
            patientDateOfBirth: {
              dd: '01',
              mm: '01',
              yyyy: '2012'
            }
          }
        }
      }
      return expect(isDateBeforeDoB(dateOfDiagnosis, dataContext)).to.eql(expectedErrorMsg(dataContext.fieldName, 'beforeDob', ['[mm]', '[yyyy]']))
    })

    it('should throw error message if dateOfDiagnosis is before "01 2001" when dateOfBirth is empty', () => {
      const dateOfDiagnosis = { mm: '10', yyyy: '2000' }
      dataContext = {
        waypointId: 'testPage',
        fieldName: 'dateOfBirth',
        journeyContext: {
          getDataForPage: function () {
            return this.testPage
          },
          testPage: {
            patientDateOfBirth: {
              dd: '',
              mm: '',
              yyyy: ''
            }
          }
        }
      }
      return expect(isDateBeforeDoB(dateOfDiagnosis, dataContext)).to.eql(expectedErrorMsg(dataContext.fieldName, 'beforeDob', ['[mm]', '[yyyy]']))
    })

    it('should not throw error message if dateOfDiagnosis is after dateOfBirth', () => {
      const dateOfDiagnosis = { mm: '10', yyyy: '2020' }
      dataContext = {
        waypointId: 'testPage',
        fieldName: 'dateOfBirth',
        journeyContext: {
          getDataForPage: function () {
            return this.testPage
          },
          testPage: {
            patientDateOfBirth: {
              dd: '01',
              mm: '01',
              yyyy: '2012'
            }
          }
        }
      }
      return expect(isDateBeforeDoB(dateOfDiagnosis, dataContext)).to.eql([])
    })

    it('should not throw error message if dateOfDiagnosis is after "01 2001" when dateOfBirth is empty', () => {
      const dateOfDiagnosis = { mm: '10', yyyy: '2020' }
      dataContext = {
        waypointId: 'testPage',
        fieldName: 'dateOfBirth',
        journeyContext: {
          getDataForPage: function () {
            return this.testPage
          },
          testPage: {
            patientDateOfBirth: {
              dd: '',
              mm: '',
              yyyy: ''
            }
          }
        }
      }
      return expect(isDateBeforeDoB(dateOfDiagnosis, dataContext)).to.eql([])
    })
  })
});
