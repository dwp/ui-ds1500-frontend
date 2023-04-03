const chai = require('chai');
const expect = chai.expect;
const { isEmptyDateOfBirth, isDateNumericDob, isValidDateRangeDob, isTooLongDob } = require('../../../../lib/validation-rules/sr1DateOfBirth');

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

describe('sr1 validations: Date of Birth', () => {
  let dataContext = { fieldName: 'patientDateOfBirth' }
  describe('isEmptyDateOfBirth', () => {
    it('should throw error message if all DD, MM and YYYY are empty', () => {
      const fieldValue = { dd: '', mm: '', yyyy: '' };
      return expect(isEmptyDateOfBirth(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'empty', ['[dd]', '[mm]', '[yyyy]']))
    })
    it('should throw error message if DD is empty', () => {
      dataContext = { fieldName: 'patientDateOfBirth[dd]' }
      const fieldValue = { dd: '', mm: '12', yyyy: '2020' };
      return expect(isEmptyDateOfBirth(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'empty', '[dd]'))
    })
    it('should throw error message if MM is empty', () => {
      dataContext = { fieldName: 'patientDateOfBirth[mm]' }
      const fieldValue = { dd: '01', mm: '', yyyy: '2019' };
      return expect(isEmptyDateOfBirth(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'empty', '[mm]'))
    })
    it('should throw error message if YYYY is empty', () => {
      dataContext = { fieldName: 'patientDateOfBirth[yyyy]' }
      const fieldValue = { dd: '01', mm: '12', yyyy: '' };
      return expect(isEmptyDateOfBirth(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'empty', '[yyyy]'))
    })
    it('should throw error message if MM and YYYY is empty', () => {
      dataContext = { fieldName: 'patientDateOfBirth' }
      const fieldValue = { dd: '01', mm: '', yyyy: '' };
      return expect(isEmptyDateOfBirth(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'empty[MMYY]', ['[dd]', '[mm]', '[yyyy]']))
    })
    it('should throw error message if DD and YYYY is empty', () => {
      const fieldValue = { dd: '', mm: '01', yyyy: '' };
      return expect(isEmptyDateOfBirth(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'empty[DDYY]', ['[dd]', '[mm]', '[yyyy]']))
    })
    it('should throw error message if DD and MM is empty', () => {
      const fieldValue = { dd: '', mm: '', yyyy: '2021' };
      return expect(isEmptyDateOfBirth(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'empty[DDMM]', ['[dd]', '[mm]', '[yyyy]']))
    })
    it('should not throw error message if all DD, MM and YYYY are provided', () => {
      const fieldValue = { dd: '01', mm: '12', yyyy: '2020' };
      return expect(isEmptyDateOfBirth(fieldValue)).to.eql([])
    })
  })

  describe('isDateNumericDob', () => {
    it('should throw error message if all DD, MM and YYYY are non numeric', () => {
      const fieldValue = { dd: '12 ', mm: '01.', yyyy: '2020@' };
      return expect(isDateNumericDob(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'isNumeric', ['[dd]', '[mm]', '[yyyy]']))
    })
    it('should throw error message if DD is non numeric', () => {
      const fieldValue = { dd: '12c', mm: '12', yyyy: '2020' };
      return expect(isDateNumericDob(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'isNumeric', '[dd]'))
    })
    it('should throw error message if MM is non numeric', () => {
      const fieldValue = { dd: '01', mm: '01a', yyyy: '2019' };
      return expect(isDateNumericDob(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'isNumeric', '[mm]'))
    })
    it('should throw error message if YYYY is non numeric', () => {
      const fieldValue = { dd: '01', mm: '12', yyyy: '20-20' };
      return expect(isDateNumericDob(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'isNumeric', '[yyyy]'))
    })
    it('should throw error message if MM and YYYY is non numeric', () => {
      const fieldValue = { dd: '01', mm: '02@', yyyy: '20.19' };
      return expect(isDateNumericDob(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'isNumeric', ['[dd]', '[mm]', '[yyyy]']))
    })
    it('should throw error message if DD and YYYY is non numeric', () => {
      const fieldValue = { dd: '11*', mm: '01', yyyy: '20&10' };
      return expect(isDateNumericDob(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'isNumeric', ['[dd]', '[mm]', '[yyyy]']))
    })
    it('should throw error message if DD and MM is non numeric', () => {
      const fieldValue = { dd: '0.1', mm: '1:2', yyyy: '2021' };
      return expect(isDateNumericDob(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'isNumeric', ['[dd]', '[mm]', '[yyyy]']))
    })
    it('should not throw error message if all DD, MM and YYYY are numeric', () => {
      const fieldValue = { dd: '01', mm: '12', yyyy: '2020' };
      return expect(isDateNumericDob(fieldValue)).to.eql([])
    })
  })

  describe('isValidDateRangeDob', () => {
    it('should throw error message if all DD, MM and YYYY are not in range', () => {
      dataContext = { fieldName: 'patientDateOfBirth' }
      const fieldValue = { dd: '32', mm: '13', yyyy: '1888' };
      return expect(isValidDateRangeDob(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'range', ['[dd]', '[mm]', '[yyyy]']))
    })
    it('should throw error message if DD is not in range', () => {
      dataContext = { fieldName: 'patientDateOfBirth[dd]' }
      const fieldValue = { dd: '32', mm: '12', yyyy: '2020' };
      return expect(isValidDateRangeDob(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'range', '[dd]'))
    })
    it('should throw error message if MM is not in range', () => {
      dataContext = { fieldName: 'patientDateOfBirth[mm]' }
      const fieldValue = { dd: '01', mm: '14', yyyy: '2019' };
      return expect(isValidDateRangeDob(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'range', '[mm]'))
    })
    it('should throw error message if YYYY is not in range', () => {
      dataContext = { fieldName: 'patientDateOfBirth[yyyy]' }
      const fieldValue = { dd: '01', mm: '12', yyyy: '1684' };
      return expect(isValidDateRangeDob(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'range', '[yyyy]'))
    })
    it('should throw error message if MM and YYYY is not in range', () => {
      dataContext = { fieldName: 'patientDateOfBirth' }
      const fieldValue = { dd: '01', mm: '13', yyyy: '1774' };
      return expect(isValidDateRangeDob(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'range[MMYY]', ['[dd]', '[mm]', '[yyyy]']))
    })
    it('should throw error message if DD and YYYY is not in range', () => {
      const fieldValue = { dd: '39', mm: '01', yyyy: '1884' };
      return expect(isValidDateRangeDob(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'range[DDYY]', ['[dd]', '[mm]', '[yyyy]']))
    })
    it('should throw error message if DD and MM is not in range', () => {
      const fieldValue = { dd: '32', mm: '13', yyyy: '2020' };
      return expect(isValidDateRangeDob(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'range[DDMM]', ['[dd]', '[mm]', '[yyyy]']))
    })
    it('should not throw error message if all DD, MM and YYYY are in range', () => {
      const fieldValue = { dd: '01', mm: '12', yyyy: '2020' };
      return expect(isValidDateRangeDob(fieldValue)).to.eql([])
    })
  })

  describe('isTooLongDob', () => {
    it('should throw error message if DD and MM and YYYY is more than 8 chars in total', () => {
      const fieldValue = { dd: '01', mm: '11', yyyy: '01870' };
      return expect(isTooLongDob(fieldValue)).to.eql(expectedErrorMsg(dataContext.fieldName, 'tooLong', ['[dd]', '[mm]', '[yyyy]']))
    })
    it('should not throw error message if all DD, MM and YYYY are less than 8 chars in total', () => {
      const fieldValue = { dd: '01', mm: '12', yyyy: '2020' };
      return expect(isTooLongDob(fieldValue)).to.eql([])
    })
  })
});
