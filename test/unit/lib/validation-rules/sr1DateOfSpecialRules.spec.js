const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const {
  isEmptyDateOfSpecialRules,
  isDateNumericSr,
  isValidDateRangeSr,
  isDateOfSpecialRulesInFuture,
  isDateBeforeDateOfDiagnosis
} = require('../../../../lib/validation-rules/sr1DateOfSpecialRules');

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

describe('sr1 validations: Date of SpecialRules', () => {
  let dataContext = { fieldName: 'dateOfSpecialRules' }
  describe('isEmptyDateOfSpecialRules', () => {
    it('should throw error message if DD, MM and YYYY are empty', () => {
      const fieldValue = { dd: '', mm: '', yyyy: '' };
      return expect(isEmptyDateOfSpecialRules(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'empty', ['[dd]', '[mm]', '[yyyy]']))
    })
    it('should throw error message if DD is empty', () => {
      dataContext = { fieldName: 'dateOfSpecialRules[dd]' }
      const fieldValue = { dd: '', mm: '12', yyyy: '2020' };
      return expect(isEmptyDateOfSpecialRules(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'empty', '[dd]'))
    })
    it('should throw error message if MM is empty', () => {
      dataContext = { fieldName: 'dateOfSpecialRules[mm]' }
      const fieldValue = { dd: '01', mm: '', yyyy: '2020' };
      return expect(isEmptyDateOfSpecialRules(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'empty', '[mm]'))
    })
    it('should throw error message if YYYY is empty', () => {
      dataContext = { fieldName: 'dateOfSpecialRules[yyyy]' }
      const fieldValue = { dd: '01', mm: '12', yyyy: '' };
      return expect(isEmptyDateOfSpecialRules(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'empty', '[yyyy]'))
    })
    it('should not throw error message if DD, MM and YYYY are provided', () => {
      const fieldValue = { dd: '01', mm: '12', yyyy: '2020' };
      return expect(isEmptyDateOfSpecialRules(fieldValue)).to.eql([])
    })
  })

  describe('isDateNumericSr', () => {
    it('should throw error message if DD, MM and YYYY are all non numeric', () => {
      dataContext = { fieldName: 'dateOfSpecialRules' }
      const fieldValue = { dd: '1a', mm: '12c', yyyy: '20-20' };
      return expect(isDateNumericSr(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'isNumeric', ['[dd]', '[mm]', '[yyyy]']))
    })
    it('should throw error message if MM is non numeric', () => {
      const fieldValue = { dd: '01', mm: '12c', yyyy: '2020' };
      return expect(isDateNumericSr(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'isNumeric', '[mm]'))
    })
    it('should throw error message if YYYY is non numeric', () => {
      const fieldValue = { dd: '01', mm: '12', yyyy: '20-20' };
      return expect(isDateNumericSr(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'isNumeric', '[yyyy]'))
    })
    it('should not throw error message if DD, MM and YYYY are all numeric', () => {
      const fieldValue = { dd: '01', mm: '12', yyyy: '2020' };
      return expect(isDateNumericSr(fieldValue)).to.eql([])
    })
  })

  describe('isValidDateRangeSr', () => {
    it('should throw error message if DD, MM and YYYY are not in range', () => {
      const fieldValue = { dd: '40', mm: '13', yyyy: '1888' };
      return expect(isValidDateRangeSr(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'range', ['[dd]', '[mm]', '[yyyy]']))
    })
    it('should throw error message if DD is not in range[1-31]', () => {
      dataContext = { fieldName: 'dateOfSpecialRules[dd]' }
      const fieldValue = { dd: '40', mm: '12', yyyy: '2020' };
      return expect(isValidDateRangeSr(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'range', '[dd]'))
    })
    it('should throw error message if MM is not in range[1-12]', () => {
      dataContext = { fieldName: 'dateOfSpecialRules[mm]' }
      const fieldValue = { dd: '01', mm: '14', yyyy: '2020' };
      return expect(isValidDateRangeSr(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'range', '[mm]'))
    })
    it('should throw error message if YYYY is non in range[1890-present]', () => {
      dataContext = { fieldName: 'dateOfSpecialRules[yyyy]' }
      const year = new Date().getFullYear() + 1
      const fieldValue = { dd: '01', mm: '10', yyyy: year };
      return expect(isValidDateRangeSr(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'range', '[yyyy]'))
    })
    it('should not throw error message if DD, MM and YYYY are in range', () => {
      const fieldValue = { dd: '01', mm: '12', yyyy: '2020' };
      return expect(isValidDateRangeSr(fieldValue)).to.eql([])
    })
  })

  describe('isDateOfSpecialRulesInFuture', () => {
    let clock;
    beforeEach(() => {
      // stub date to 01/01/2020
      clock = sinon.useFakeTimers(new Date(2020, 1, 1).getTime());
    })
    afterEach(() => {
      // restore to original date
      clock.restore();
    })

    it('should not throw error message if DD, MM and YYYY are in range', () => {
      const fieldValue = { dd: '01', mm: '01', yyyy: '2020' };
      return expect(isDateOfSpecialRulesInFuture(fieldValue)).to.eql([])
    })
  })

  describe('isDateBeforeDateOfDiagnosis', () => {
    it('should throw error message if dateOfSpecialRules is before dateOfDiagnosis', () => {
      const dateOfSpecialRules = { dd: '01', mm: '10', yyyy: '2010' }
      dataContext = {
        waypoint: 'testPage',
        fieldName: 'dateOfSpecialRules',
        journeyContext: {
          getDataForPage: function (waypoint) {
            return this[waypoint]
          },
          testPage: {
            dateOfDiagnosis: {
              dd: '01',
              mm: '01',
              yyyy: '2012'
            }
          }
        }
      }
      return expect(isDateBeforeDateOfDiagnosis(dateOfSpecialRules, dataContext)).to.eql(expectedErrorMsg(dataContext.fieldName, 'beforeDob', ['[dd]', '[mm]', '[yyyy]']))
    })

    it('should throw error message if dateOfSpecialRules is before "01 2001" when dateOfDiagnosis is empty', () => {
      const dateOfSpecialRules = { dd: '01', mm: '10', yyyy: '2000' }
      dataContext = {
        waypointId: 'testPage',
        fieldName: 'dateOfSpecialRules',
        journeyContext: {
          getDataForPage: function () {
            return this.testPage
          },
          testPage: {
            dateOfDiagnosis: {
              dd: '',
              mm: '',
              yyyy: ''
            }
          }
        }
      }
      return expect(isDateBeforeDateOfDiagnosis(dateOfSpecialRules, dataContext)).to.eql(expectedErrorMsg(dataContext.fieldName, 'beforeDob', ['[dd]', '[mm]', '[yyyy]']))
    })

    it('should not throw error message if dateOfSpecialRules is after dateOfDiagnosis', () => {
      const dateOfSpecialRules = { dd: '01', mm: '10', yyyy: '2020' }
      dataContext = {
        waypointId: 'testPage',
        fieldName: 'dateOfSpecialRules',
        journeyContext: {
          getDataForPage: function () {
            return this.testPage
          },
          testPage: {
            dateOfDiagnosis: {
              dd: '01',
              mm: '01',
              yyyy: '2012'
            }
          }
        }
      }
      return expect(isDateBeforeDateOfDiagnosis(dateOfSpecialRules, dataContext)).to.eql([])
    })

    it('should not throw error message if dateOfSpecialRules is same as dateOfDiagnosis', () => {
      const dateOfSpecialRules = { dd: '13', mm: '01', yyyy: '2012' }
      dataContext = {
        waypointId: 'testPage',
        fieldName: 'dateOfSpecialRules',
        journeyContext: {
          getDataForPage: function () {
            return this.testPage
          },
          testPage: {
            dateOfDiagnosis: {
              dd: '13',
              mm: '01',
              yyyy: '2012'
            }
          }
        }
      }
      return expect(isDateBeforeDateOfDiagnosis(dateOfSpecialRules, dataContext)).to.eql([])
    })

    it('should not throw error message if dateOfSpecialRules is after "01 01 2001" when dateOfDiagnosis is empty', () => {
      const dateOfSpecialRules = { dd: '01', mm: '10', yyyy: '2020' }
      dataContext = {
        waypointId: 'testPage',
        fieldName: 'dateOfSpecialRules',
        journeyContext: {
          getDataForPage: function () {
            return this.testPage
          },
          testPage: {
            dateOfDiagnosis: {
              dd: '',
              mm: '',
              yyyy: ''
            }
          }
        }
      }
      return expect(isDateBeforeDateOfDiagnosis(dateOfSpecialRules, dataContext)).to.eql([])
    })
  });
});
