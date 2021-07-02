const { expectValidatorToFail, expectValidatorToPass } = require('../../../helpers/validator-assertions');
const validators = require('../../../../definitions/field-validators/ds1500');

const defaultValidators = {
  patientName: '',
  patientAddress: '',
  patientDateOfBirth: { dd: '', mm: '', yyyy: '' },
  dateOfDiagnosis: { dd: '', mm: '', yyyy: '' }
}

describe('ds1500 field: patientDateOfBirth', () => {
  describe('validator: isEmptyDateOfBirth', () => {
    it('should fail "isEmptyDateOfBirth" validator if no "dd mm yyyy" is provided', async () => {
      await expectValidatorToFail(validators, 'patientDateOfBirth', 'isEmptyDateOfBirth', { ...defaultValidators }, {
        summary: 'ds1500:patientDateOfBirth.empty'
      });
    });
    it('should fail "isEmptyDateOfBirth" validator if no "dd" is provided', async () => {
      const patientDateOfBirth = { dd: '', mm: '12', yyyy: '2020' }
      await expectValidatorToFail(validators, 'patientDateOfBirth', 'isEmptyDateOfBirth', { ...defaultValidators, patientDateOfBirth }, {
        summary: 'ds1500:patientDateOfBirth[dd].empty'
      });
    });
    it('should fail "isEmptyDateOfBirth" validator if no "mm" is provided', async () => {
      const patientDateOfBirth = { dd: '28', mm: '', yyyy: '2020' }
      await expectValidatorToFail(validators, 'patientDateOfBirth', 'isEmptyDateOfBirth', { ...defaultValidators, patientDateOfBirth }, {
        summary: 'ds1500:patientDateOfBirth[mm].empty'
      });
    });
    it('should fail "isEmptyDateOfBirth" validator if no "yyyy" is provided', async () => {
      const patientDateOfBirth = { dd: '28', mm: '12', yyyy: '' }
      await expectValidatorToFail(validators, 'patientDateOfBirth', 'isEmptyDateOfBirth', { ...defaultValidators, patientDateOfBirth }, {
        summary: 'ds1500:patientDateOfBirth[yyyy].empty'
      });
    });
    it('should fail "isEmptyDateOfBirth" validator if no "mm yyyy" is provided', async () => {
      const patientDateOfBirth = { dd: '28', mm: '', yyyy: '' }
      await expectValidatorToFail(validators, 'patientDateOfBirth', 'isEmptyDateOfBirth', { ...defaultValidators, patientDateOfBirth }, {
        summary: 'ds1500:patientDateOfBirth.empty[MMYY]'
      });
    });
    it('should fail "isEmptyDateOfBirth" validator if no "dd yyyy" is provided', async () => {
      const patientDateOfBirth = { dd: '', mm: '12', yyyy: '' }
      await expectValidatorToFail(validators, 'patientDateOfBirth', 'isEmptyDateOfBirth', { ...defaultValidators, patientDateOfBirth }, {
        summary: 'ds1500:patientDateOfBirth.empty[DDYY]'
      });
    });
    it('should fail "isEmptyDateOfBirth" validator if no "dd mm" is provided', async () => {
      const patientDateOfBirth = { dd: '', mm: '', yyyy: '2020' }
      await expectValidatorToFail(validators, 'patientDateOfBirth', 'isEmptyDateOfBirth', { ...defaultValidators, patientDateOfBirth }, {
        summary: 'ds1500:patientDateOfBirth.empty[DDMM]'
      });
    });
    it('should pass "isEmptyDateOfBirth" validator if a valid value is provided', async () => {
      const patientDateOfBirth = { dd: '01', mm: '12', yyyy: '2020' }
      await expectValidatorToPass(validators, 'patientDateOfBirth', 'isEmptyDateOfBirth', { ...defaultValidators, patientDateOfBirth });
    });
  })

  describe('validator: isDateNumericDob', () => {
    it('should fail "isDateNumericDob" validator if "dd mm yyyy" is not numeric', async () => {
      const patientDateOfBirth = { dd: '1a', mm: '2b', yyyy: '202c' }
      await expectValidatorToFail(validators, 'patientDateOfBirth', 'isDateNumericDob', { ...defaultValidators, patientDateOfBirth }, {
        summary: 'ds1500:patientDateOfBirth.isNumeric'
      });
    });
    it('should fail "isDateNumericDob" validator if "mm yyyy" is not numeric', async () => {
      const patientDateOfBirth = { dd: '01', mm: '2b', yyyy: '202c' }
      await expectValidatorToFail(validators, 'patientDateOfBirth', 'isDateNumericDob', { ...defaultValidators, patientDateOfBirth }, {
        summary: 'ds1500:patientDateOfBirth.isNumeric'
      });
    });
    it('should fail "isDateNumericDob" validator if "dd yyyy" is not numeric', async () => {
      const patientDateOfBirth = { dd: '1a', mm: '02', yyyy: '202c' }
      await expectValidatorToFail(validators, 'patientDateOfBirth', 'isDateNumericDob', { ...defaultValidators, patientDateOfBirth }, {
        summary: 'ds1500:patientDateOfBirth.isNumeric'
      });
    });
    it('should fail "isDateNumericDob" validator if "dd mm" is not numeric', async () => {
      const patientDateOfBirth = { dd: '1a', mm: '2b', yyyy: '2020' }
      await expectValidatorToFail(validators, 'patientDateOfBirth', 'isDateNumericDob', { ...defaultValidators, patientDateOfBirth }, {
        summary: 'ds1500:patientDateOfBirth.isNumeric'
      });
    });
    it('should fail "isDateNumericDob" validator if "dd" is not numeric', async () => {
      const patientDateOfBirth = { dd: '1a', mm: '02', yyyy: '2020' }
      await expectValidatorToFail(validators, 'patientDateOfBirth', 'isDateNumericDob', { ...defaultValidators, patientDateOfBirth }, {
        summary: 'ds1500:patientDateOfBirth.isNumeric'
      });
    });
    it('should fail "isDateNumericDob" validator if "mm" is not numeric', async () => {
      const patientDateOfBirth = { dd: '01', mm: '2a', yyyy: '2020' }
      await expectValidatorToFail(validators, 'patientDateOfBirth', 'isDateNumericDob', { ...defaultValidators, patientDateOfBirth }, {
        summary: 'ds1500:patientDateOfBirth.isNumeric'
      });
    });
    it('should fail "isDateNumericDob" validator if "yyyy" is not numeric', async () => {
      const patientDateOfBirth = { dd: '01', mm: '02', yyyy: '202c' }
      await expectValidatorToFail(validators, 'patientDateOfBirth', 'isDateNumericDob', { ...defaultValidators, patientDateOfBirth }, {
        summary: 'ds1500:patientDateOfBirth.isNumeric'
      });
    });
    it('should pass "isDateNumericDob" validator if "dd mm yyyy" is numeric', async () => {
      const patientDateOfBirth = { dd: '01', mm: '02', yyyy: '2020' }
      await expectValidatorToPass(validators, 'patientDateOfBirth', 'isDateNumericDob', { ...defaultValidators, patientDateOfBirth });
    });
  })

  describe('validator: isValidDateRangeDob', () => {
    it('should fail "isValidDateRangeDob" validator if "dd mm yyyy" is not in range', async () => {
      const patientDateOfBirth = { dd: '32', mm: '13', yyyy: '1888' };
      await expectValidatorToFail(validators, 'patientDateOfBirth', 'isValidDateRangeDob', { ...defaultValidators, patientDateOfBirth }, {
        summary: 'ds1500:patientDateOfBirth.range'
      });
    });
    it('should fail "isValidDateRangeDob" validator if "mm yyyy" is not in range', async () => {
      const patientDateOfBirth = { dd: '01', mm: '13', yyyy: '1774' };
      await expectValidatorToFail(validators, 'patientDateOfBirth', 'isValidDateRangeDob', { ...defaultValidators, patientDateOfBirth }, {
        summary: 'ds1500:patientDateOfBirth.range[MMYY]'
      });
    });
    it('should fail "isValidDateRangeDob" validator if "dd yyyy" is not in range', async () => {
      const patientDateOfBirth = { dd: '39', mm: '01', yyyy: '1884' };
      await expectValidatorToFail(validators, 'patientDateOfBirth', 'isValidDateRangeDob', { ...defaultValidators, patientDateOfBirth }, {
        summary: 'ds1500:patientDateOfBirth.range[DDYY]'
      });
    });
    it('should fail "isValidDateRangeDob" validator if "dd mm" is not in range', async () => {
      const patientDateOfBirth = { dd: '32', mm: '13', yyyy: '2020' };
      await expectValidatorToFail(validators, 'patientDateOfBirth', 'isValidDateRangeDob', { ...defaultValidators, patientDateOfBirth }, {
        summary: 'ds1500:patientDateOfBirth.range[DDMM]'
      });
    });
    it('should fail "isValidDateRangeDob" validator if "dd" is not in range', async () => {
      const patientDateOfBirth = { dd: '32', mm: '12', yyyy: '2020' };
      await expectValidatorToFail(validators, 'patientDateOfBirth', 'isValidDateRangeDob', { ...defaultValidators, patientDateOfBirth }, {
        summary: 'ds1500:patientDateOfBirth[dd].range'
      });
    });
    it('should fail "isValidDateRangeDob" validator if "mm" is not in range', async () => {
      const patientDateOfBirth = { dd: '01', mm: '14', yyyy: '2019' };
      await expectValidatorToFail(validators, 'patientDateOfBirth', 'isValidDateRangeDob', { ...defaultValidators, patientDateOfBirth }, {
        summary: 'ds1500:patientDateOfBirth[mm].range'
      });
    });
    it('should fail "isValidDateRangeDob" validator if "yyyy" is not in range', async () => {
      const patientDateOfBirth = { dd: '01', mm: '12', yyyy: '1684' };
      await expectValidatorToFail(validators, 'patientDateOfBirth', 'isValidDateRangeDob', { ...defaultValidators, patientDateOfBirth }, {
        summary: 'ds1500:patientDateOfBirth[yyyy].range'
      });
    });
    it('should pass "isValidDateRangeDob" validator if "dd mm yyyy" is in range', async () => {
      const patientDateOfBirth = { dd: '01', mm: '12', yyyy: '2020' };
      await expectValidatorToPass(validators, 'patientDateOfBirth', 'isValidDateRangeDob', { ...defaultValidators, patientDateOfBirth });
    });
  })
  describe('validator: isTooLongDob', () => {
    it('should fail "isTooLongDob" validator if "dd mm yyyy" is more than 8 chars in total', async () => {
      const patientDateOfBirth = { dd: '01', mm: '11', yyyy: '01890' };
      await expectValidatorToFail(validators, 'patientDateOfBirth', 'isTooLongDob', { ...defaultValidators, patientDateOfBirth }, {
        summary: 'ds1500:patientDateOfBirth.tooLong'
      });
    });
    it('should pass "isTooLongDob" validator if "dd mm yyyy" are less than 8 chars in total', async () => {
      const patientDateOfBirth = { dd: '01', mm: '12', yyyy: '2020' };
      await expectValidatorToPass(validators, 'patientDateOfBirth', 'isTooLongDob', { ...defaultValidators, patientDateOfBirth });
    });
  })

  describe('validator: dateObject', () => {
    let _now;

    before(() => {
      _now = Date.now;
    });

    after(() => {
      Date.now = _now;
    });

    it('should fail "dateObject" validator if value is not a valid date', async () => {
      const patientDateOfBirth = { dd: '30', mm: '2', yyyy: '1970' };
      await expectValidatorToFail(validators, 'patientDateOfBirth', 'DateObject', { ...defaultValidators, patientDateOfBirth }, {
        summary: 'ds1500:patientDateOfBirth.invalid'
      });
    });

    it('should fail "dateObject" validator if value is beyond today', async () => {
      Date.now = () => (0); // 1970-01-01
      const patientDateOfBirth = { mm: '1', dd: '2', yyyy: '1970' }
      await expectValidatorToFail(validators, 'patientDateOfBirth', 'DateObject', { ...defaultValidators, patientDateOfBirth }, {
        summary: 'ds1500:patientDateOfBirth.future',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      });
    });

    it('should pass "dateObject" validator if value is before today', async () => {
      Date.now = () => (86400000); // 1970-01-02
      const patientDateOfBirth = { mm: 1, dd: 1, yyyy: 1970 }
      await expectValidatorToPass(validators, 'patientDateOfBirth', 'DateObject', { ...defaultValidators, patientDateOfBirth });
    });
  })
})
