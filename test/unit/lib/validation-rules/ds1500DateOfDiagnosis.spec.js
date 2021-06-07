const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const {
  isEmptyDateOfDiagnosis,
  isDateNumeric,
  isValidDateRange,
  isDateOfDiagnosisInFuture,
  isDateBeforeDoB
} = require('../../../../lib/validation-rules/ds1500DateOfDiagnosis');

chai.use(chaiAsPromised);

describe('ds1500 validations: Date of Diagnosis', () => {
  describe('isEmptyDateOfDiagnosis', () => {
    it('should reject if both MM and YYYY are empty', () => {
      const fieldValue = { mm: '', yyyy: '' };
      return expect(isEmptyDateOfDiagnosis(fieldValue)).to.be.rejected
    })
    it('should reject if MM is empty', () => {
      const fieldValue = { mm: '', yyyy: '2020' };
      return expect(isEmptyDateOfDiagnosis(fieldValue)).to.be.rejected
    })
    it('should reject if YYYY is empty', () => {
      const fieldValue = { mm: '12', yyyy: '' };
      return expect(isEmptyDateOfDiagnosis(fieldValue)).to.be.rejected
    })
    it('should resolve if both MM and YYYY are provided', () => {
      const fieldValue = { mm: '12', yyyy: '2020' };
      return expect(isEmptyDateOfDiagnosis(fieldValue)).to.be.fulfilled
    })
  })

  describe('isDateNumeric', () => {
    it('should reject if both MM and YYYY are non numeric', () => {
      const fieldValue = { mm: '12c', yyyy: '20-20' };
      return expect(isDateNumeric(fieldValue)).to.be.rejected
    })
    it('should reject if MM is non numeric', () => {
      const fieldValue = { mm: '12c', yyyy: '2020' };
      return expect(isDateNumeric(fieldValue)).to.be.rejected
    })
    it('should reject if YYYY is non numeric', () => {
      const fieldValue = { mm: '12', yyyy: '20-20' };
      return expect(isDateNumeric(fieldValue)).to.be.rejected
    })
    it('should resolve if both MM and YYYY are numeric', () => {
      const fieldValue = { mm: '12', yyyy: '2020' };
      return expect(isDateNumeric(fieldValue)).to.be.fulfilled
    })
  })

  describe('isValidDateRange', () => {
    it('should reject if both MM and YYYY are non in range', () => {
      const fieldValue = { mm: '13', yyyy: '1888' };
      return expect(isValidDateRange(fieldValue)).to.be.rejected
    })
    it('should reject if MM is not in range[1-12]', () => {
      const fieldValue = { mm: '14', yyyy: '2020' };
      return expect(isValidDateRange(fieldValue)).to.be.rejected
    })
    it('should reject if YYYY is non in range[1890-present]', () => {
      const fieldValue = { mm: '10', yyyy: '2022' };
      return expect(isValidDateRange(fieldValue)).to.be.rejected
    })
    it('should resolve if both MM and YYYY are in range', () => {
      const fieldValue = { mm: '12', yyyy: '2020' };
      return expect(isValidDateRange(fieldValue)).to.be.fulfilled
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

    it('should reject if Date of diagnosis is present year and future month', () => {
      const fieldValue = { mm: '03', yyyy: '2020' };
      return expect(isDateOfDiagnosisInFuture(fieldValue)).to.be.rejected
    })
    it('should resolve if both MM and YYYY are in range', () => {
      const fieldValue = { mm: '01', yyyy: '2020' };
      return expect(isDateOfDiagnosisInFuture(fieldValue)).to.be.fulfilled
    })
  })

  describe('isDateBeforeDoB', () => {
    const validationRule = isDateBeforeDoB.bind({
      otherFieldName: 'dateOfBirth'
    })

    it('should reject if dateOfDiagnosis is before dateOfBirth', () => {
      const dateOfDiagnosis = { mm: '10', yyyy: '2010' }
      const dataContext = {
        waypointId: 'testPage',
        fieldName: 'dateOfBirth',
        journeyContext: {
          getDataForPage: function () {
            return this.testPage
          },
          testPage: {
            dateOfBirth: {
              dd: '01',
              mm: '01',
              yyyy: '2012'
            }
          }
        }
      }
      return expect(validationRule(dateOfDiagnosis, dataContext)).to.be.rejected
    })

    it('should reject if dateOfDiagnosis is before "01 2001" when dateOfBirth is empty', () => {
      const dateOfDiagnosis = { mm: '10', yyyy: '2000' }
      const dataContext = {
        waypointId: 'testPage',
        fieldName: 'dateOfBirth',
        journeyContext: {
          getDataForPage: function () {
            return this.testPage
          },
          testPage: {
            dateOfBirth: {
              dd: '',
              mm: '',
              yyyy: ''
            }
          }
        }
      }
      return expect(validationRule(dateOfDiagnosis, dataContext)).to.be.rejected
    })

    it('should resolve if dateOfDiagnosis is after dateOfBirth', () => {
      const dateOfDiagnosis = { mm: '10', yyyy: '2020' }
      const dataContext = {
        waypointId: 'testPage',
        fieldName: 'dateOfBirth',
        journeyContext: {
          getDataForPage: function () {
            return this.testPage
          },
          testPage: {
            dateOfBirth: {
              dd: '01',
              mm: '01',
              yyyy: '2012'
            }
          }
        }
      }
      return expect(validationRule(dateOfDiagnosis, dataContext)).to.be.fulfilled
    })

    it('should resolve if dateOfDiagnosis is after "01 2001" when dateOfBirth is empty', () => {
      const dateOfDiagnosis = { mm: '10', yyyy: '2020' }
      const dataContext = {
        waypointId: 'testPage',
        fieldName: 'dateOfBirth',
        journeyContext: {
          getDataForPage: function () {
            return this.testPage
          },
          testPage: {
            dateOfBirth: {
              dd: '',
              mm: '',
              yyyy: ''
            }
          }
        }
      }
      return expect(validationRule(dateOfDiagnosis, dataContext)).to.be.fulfilled
    })
  })
});
