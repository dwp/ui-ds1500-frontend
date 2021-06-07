const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const { isEmptyDateOfBirth, isDateNumericDob, isValidDateRangeDob, isTooLongDob } = require('../../../../lib/validation-rules/ds1500DateOfBirth');

chai.use(chaiAsPromised);

describe('ds1500 validations: Date of Birth', () => {
  describe('isEmptyDateOfBirth', () => {
    it('should reject if all DD, MM and YYYY are empty', () => {
      const fieldValue = { dd: '', mm: '', yyyy: '' };
      return expect(isEmptyDateOfBirth(fieldValue)).to.be.rejected
    })
    it('should reject if DD is empty', () => {
      const fieldValue = { dd: '', mm: '12', yyyy: '2020' };
      return expect(isEmptyDateOfBirth(fieldValue)).to.be.rejected
    })
    it('should reject if MM is empty', () => {
      const fieldValue = { dd: '01', mm: '', yyyy: '2019' };
      return expect(isEmptyDateOfBirth(fieldValue)).to.be.rejected
    })
    it('should reject if YYYY is empty', () => {
      const fieldValue = { dd: '01', mm: '12', yyyy: '' };
      return expect(isEmptyDateOfBirth(fieldValue)).to.be.rejected
    })
    it('should reject if MM and YYYY is empty', () => {
      const fieldValue = { dd: '01', mm: '', yyyy: '' };
      return expect(isEmptyDateOfBirth(fieldValue)).to.be.rejected
    })
    it('should reject if DD and YYYY is empty', () => {
      const fieldValue = { dd: '', mm: '01', yyyy: '' };
      return expect(isEmptyDateOfBirth(fieldValue)).to.be.rejected
    })
    it('should reject if DD and MM is empty', () => {
      const fieldValue = { dd: '', mm: '', yyyy: '2021' };
      return expect(isEmptyDateOfBirth(fieldValue)).to.be.rejected
    })
    it('should resolve if all DD, MM and YYYY are provided', () => {
      const fieldValue = { dd: '01', mm: '12', yyyy: '2020' };
      return expect(isEmptyDateOfBirth(fieldValue)).to.be.fulfilled
    })
  })

  describe('isDateNumericDob', () => {
    it('should reject if all DD, MM and YYYY are non numeric', () => {
      const fieldValue = { dd: '12 ', mm: '01.', yyyy: '2020@' };
      return expect(isDateNumericDob(fieldValue)).to.be.rejected
    })
    it('should reject if DD is non numeric', () => {
      const fieldValue = { dd: '12c', mm: '12', yyyy: '2020' };
      return expect(isDateNumericDob(fieldValue)).to.be.rejected
    })
    it('should reject if MM is non numeric', () => {
      const fieldValue = { dd: '01', mm: '01a', yyyy: '2019' };
      return expect(isDateNumericDob(fieldValue)).to.be.rejected
    })
    it('should reject if YYYY is non numeric', () => {
      const fieldValue = { dd: '01', mm: '12', yyyy: '20-20' };
      return expect(isDateNumericDob(fieldValue)).to.be.rejected
    })
    it('should reject if MM and YYYY is non numeric', () => {
      const fieldValue = { dd: '01', mm: '02@', yyyy: '20.19' };
      return expect(isDateNumericDob(fieldValue)).to.be.rejected
    })
    it('should reject if DD and YYYY is non numeric', () => {
      const fieldValue = { dd: '11*', mm: '01', yyyy: '20&10' };
      return expect(isDateNumericDob(fieldValue)).to.be.rejected
    })
    it('should reject if DD and MM is non numeric', () => {
      const fieldValue = { dd: '0.1', mm: '1:2', yyyy: '2021' };
      return expect(isDateNumericDob(fieldValue)).to.be.rejected
    })
    it('should resolve if all DD, MM and YYYY are numeric', () => {
      const fieldValue = { dd: '01', mm: '12', yyyy: '2020' };
      return expect(isDateNumericDob(fieldValue)).to.be.fulfilled
    })
  })

  describe('isValidDateRangeDob', () => {
    it('should reject if all DD, MM and YYYY are not in range', () => {
      const fieldValue = { dd: '32', mm: '13', yyyy: '1888' };
      return expect(isValidDateRangeDob(fieldValue)).to.be.rejected
    })
    it('should reject if DD is not in range', () => {
      const fieldValue = { dd: '32', mm: '12', yyyy: '2020' };
      return expect(isValidDateRangeDob(fieldValue)).to.be.rejected
    })
    it('should reject if MM is not in range', () => {
      const fieldValue = { dd: '01', mm: '14', yyyy: '2019' };
      return expect(isValidDateRangeDob(fieldValue)).to.be.rejected
    })
    it('should reject if YYYY is not in range', () => {
      const fieldValue = { dd: '01', mm: '12', yyyy: '1684' };
      return expect(isValidDateRangeDob(fieldValue)).to.be.rejected
    })
    it('should reject if MM and YYYY is not in range', () => {
      const fieldValue = { dd: '01', mm: '13', yyyy: '1774' };
      return expect(isValidDateRangeDob(fieldValue)).to.be.rejected
    })
    it('should reject if DD and YYYY is not in range', () => {
      const fieldValue = { dd: '39', mm: '01', yyyy: '1884' };
      return expect(isValidDateRangeDob(fieldValue)).to.be.rejected
    })
    it('should reject if DD and MM is not in range', () => {
      const fieldValue = { dd: '32', mm: '13', yyyy: '2020' };
      return expect(isValidDateRangeDob(fieldValue)).to.be.rejected
    })
    it('should resolve if all DD, MM and YYYY are in range', () => {
      const fieldValue = { dd: '01', mm: '12', yyyy: '2020' };
      return expect(isValidDateRangeDob(fieldValue)).to.be.fulfilled
    })
  })

  describe('isTooLongDob', () => {
    it('should reject if DD and MM and YYYY is more than 8 chars in total', () => {
      const fieldValue = { dd: '01', mm: '11', yyyy: '01870' };
      return expect(isTooLongDob(fieldValue)).to.be.rejected
    })
    it('should resolve if all DD, MM and YYYY are less than 8 chars in total', () => {
      const fieldValue = { dd: '01', mm: '12', yyyy: '2020' };
      return expect(isTooLongDob(fieldValue)).to.be.fulfilled
    })
  })
});
