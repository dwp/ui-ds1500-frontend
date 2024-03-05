const sinon = require('sinon');
const { expectValidatorToFail, expectValidatorToPass } = require('../../../helpers/validator-assertions');
const validators = require('../../../../definitions/fields/sr1')();

const defaultValidators = {
  patientName: '',
  patientAddress: '',
  patientDateOfBirth: { dd: '', mm: '', yyyy: '' },
  dateOfDiagnosis: { dd: '', mm: '', yyyy: '' }
}

describe('sr1 field: dateOfDiagnosis', () => {
  describe('validator: isEmptyDateOfDiagnosis', () => {
    it('should fail "isEmptyDateOfDiagnosis" validator if no "dd mm yyyy" is provided', async () => {
      await expectValidatorToFail(validators, 'dateOfDiagnosis', 'isEmptyDateOfDiagnosis', { dd: '', mm: '', yyyy: '' }, { ...defaultValidators }, {
        summary: 'sr1:dateOfDiagnosis.empty'
      });
    });
    it('should fail "isEmptyDateOfDiagnosis" validator if no "dd" is provided', async () => {
      const dateOfDiagnosis = { dd: '', mm: '02', yyyy: '2020' }
      await expectValidatorToFail(validators, 'dateOfDiagnosis', 'isEmptyDateOfDiagnosis', dateOfDiagnosis, { ...defaultValidators, dateOfDiagnosis }, {
        summary: 'sr1:dateOfDiagnosis[dd].empty'
      });
    });
    it('should fail "isEmptyDateOfDiagnosis" validator if no "mm" is provided', async () => {
      const dateOfDiagnosis = { dd: '01', mm: '', yyyy: '2020' }
      await expectValidatorToFail(validators, 'dateOfDiagnosis', 'isEmptyDateOfDiagnosis', dateOfDiagnosis, { ...defaultValidators, dateOfDiagnosis }, {
        summary: 'sr1:dateOfDiagnosis[mm].empty'
      });
    });
    it('should fail "isEmptyDateOfDiagnosis" validator if no "yyyy" is provided', async () => {
      const dateOfDiagnosis = { dd: '01', mm: '12', yyyy: '' }
      await expectValidatorToFail(validators, 'dateOfDiagnosis', 'isEmptyDateOfDiagnosis', dateOfDiagnosis, { ...defaultValidators, dateOfDiagnosis }, {
        summary: 'sr1:dateOfDiagnosis[yyyy].empty'
      });
    });
    it('should pass "isEmptyDateOfDiagnosis" validator if a valid value is provided', async () => {
      const dateOfDiagnosis = { dd: '01', mm: '12', yyyy: '2020' }
      await expectValidatorToPass(validators, 'dateOfDiagnosis', 'isEmptyDateOfDiagnosis', dateOfDiagnosis, { ...defaultValidators, dateOfDiagnosis });
    });
  })

  describe('validator: isDateNumeric', () => {
    it('should fail "isDateNumeric" validator if "dd mm yyyy" is not numeric', async () => {
      const dateOfDiagnosis = { dd: '1a', mm: '2b', yyyy: '202c' }
      await expectValidatorToFail(validators, 'dateOfDiagnosis', 'isDateNumeric', dateOfDiagnosis, { ...defaultValidators, dateOfDiagnosis }, {
        summary: 'sr1:dateOfDiagnosis.isNumeric'
      });
    });
    it('should fail "isDateNumeric" validator if "dd" is not numeric', async () => {
      const dateOfDiagnosis = { dd: '1a', mm: '02', yyyy: '2020' }
      await expectValidatorToFail(validators, 'dateOfDiagnosis', 'isDateNumeric', dateOfDiagnosis, { ...defaultValidators, dateOfDiagnosis }, {
        summary: 'sr1:dateOfDiagnosis.isNumeric'
      });
    });
    it('should fail "isDateNumeric" validator if "mm" is not numeric', async () => {
      const dateOfDiagnosis = { dd: '01', mm: '2a', yyyy: '2020' }
      await expectValidatorToFail(validators, 'dateOfDiagnosis', 'isDateNumeric', dateOfDiagnosis, { ...defaultValidators, dateOfDiagnosis }, {
        summary: 'sr1:dateOfDiagnosis.isNumeric'
      });
    });
    it('should fail "isDateNumeric" validator if "yyyy" is not numeric', async () => {
      const dateOfDiagnosis = { dd: '01', mm: '02', yyyy: '202c' }
      await expectValidatorToFail(validators, 'dateOfDiagnosis', 'isDateNumeric', dateOfDiagnosis, { ...defaultValidators, dateOfDiagnosis }, {
        summary: 'sr1:dateOfDiagnosis.isNumeric'
      });
    });
    it('should pass "isDateNumeric" validator if "dd mm yyyy" is numeric', async () => {
      const dateOfDiagnosis = { dd: '01', mm: '02', yyyy: '2020' }
      await expectValidatorToPass(validators, 'dateOfDiagnosis', 'isDateNumeric', dateOfDiagnosis, { ...defaultValidators, dateOfDiagnosis });
    });
  })

  describe('validator: isValidDateRange', () => {
    it('should fail "isValidDateRange" validator if "dd mm yyyy" is not in range', async () => {
      const dateOfDiagnosis = { dd: '40', mm: '13', yyyy: '1888' };
      await expectValidatorToFail(validators, 'dateOfDiagnosis', 'isValidDateRange', dateOfDiagnosis, { ...defaultValidators, dateOfDiagnosis }, {
        summary: 'sr1:dateOfDiagnosis.range'
      });
    });
    it('should fail "isValidDateRange" validator if "dd" is not in range', async () => {
      const dateOfDiagnosis = { dd: '40', mm: '12', yyyy: '2019' };
      await expectValidatorToFail(validators, 'dateOfDiagnosis', 'isValidDateRange', dateOfDiagnosis, { ...defaultValidators, dateOfDiagnosis }, {
        summary: 'sr1:dateOfDiagnosis[dd].range'
      });
    });
    it('should fail "isValidDateRange" validator if "mm" is not in range', async () => {
      const dateOfDiagnosis = { dd: '02', mm: '14', yyyy: '2019' };
      await expectValidatorToFail(validators, 'dateOfDiagnosis', 'isValidDateRange', dateOfDiagnosis, { ...defaultValidators, dateOfDiagnosis }, {
        summary: 'sr1:dateOfDiagnosis[mm].range'
      });
    });
    it('should fail "isValidDateRange" validator if "yyyy" is not in range', async () => {
      const dateOfDiagnosis = { dd: '01', mm: '12', yyyy: '1684' };
      await expectValidatorToFail(validators, 'dateOfDiagnosis', 'isValidDateRange', dateOfDiagnosis, { ...defaultValidators, dateOfDiagnosis }, {
        summary: 'sr1:dateOfDiagnosis[yyyy].range'
      });
    });
    it('should pass "isValidDateRange" validator if "dd mm yyyy" is in range', async () => {
      const dateOfDiagnosis = { dd: '01', mm: '12', yyyy: '2020' };
      await expectValidatorToPass(validators, 'dateOfDiagnosis', 'isValidDateRange', dateOfDiagnosis, { ...defaultValidators, dateOfDiagnosis });
    });
  })

  describe('validator: isDateOfDiagnosisInFuture', () => {
    let clock;
    beforeEach(() => {
      // stub date to 01/01/2020
      clock = sinon.useFakeTimers(new Date(1970, 1, 1).getTime());
    })
    afterEach(() => {
      // restore to original date
      clock.restore();
    })

    it('should fail "isDateOfDiagnosisInFuture" validator if value is beyond today', async () => {
      const setValidators = {
        dateOfDiagnosis: { dd: '01', mm: '03', yyyy: '1970' },
        patientDateOfBirth: { dd: '01', mm: '01', yyyy: '1970' }
      }

      await expectValidatorToFail(validators, 'dateOfDiagnosis', 'isDateOfDiagnosisInFuture', setValidators.dateOfDiagnosis, { ...defaultValidators, ...setValidators }, {
        summary: 'sr1:dateOfDiagnosis.future',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      });
    });

    it('should pass "isDateOfDiagnosisInFuture" validator if value is before today', async () => {
      const dateOfDiagnosis = { dd: '01', mm: '01', yyyy: '1969' }
      await expectValidatorToPass(validators, 'dateOfDiagnosis', 'isDateOfDiagnosisInFuture', dateOfDiagnosis, { ...defaultValidators, dateOfDiagnosis });
    });
  })

  describe('validator: isDateBeforeDoB', () => {
    let clock;
    beforeEach(() => {
      // stub date to 01/01/1970
      clock = sinon.useFakeTimers(new Date(1970, 1, 1).getTime());
    })
    afterEach(() => {
      // restore to original date
      clock.restore();
    })

    it('should fail "isDateBeforeDoB" validator if date is beyond DOB', async () => {
      const setValidators = {
        dateOfDiagnosis: { dd: '01', mm: '01', yyyy: '1969' },
        patientDateOfBirth: { dd: '01', mm: '01', yyyy: '1970' }
      }

      await expectValidatorToFail(validators, 'dateOfDiagnosis', 'isDateBeforeDoB', setValidators.dateOfDiagnosis, { ...defaultValidators, ...setValidators }, {
        summary: 'sr1:dateOfDiagnosis.beforeDob',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      });
    });

    it('should pass "isDateBeforeDoB" validator if date is after DOB', async () => {
      const setValidators = {
        dateOfDiagnosis: { dd: '01', mm: '01', yyyy: '1969' },
        patientDateOfBirth: { dd: '01', mm: '01', yyyy: '1968' }
      }
      await expectValidatorToPass(validators, 'dateOfDiagnosis', 'isDateBeforeDoB', setValidators.dateOfDiagnosis, { ...defaultValidators, ...setValidators });
    });
  })
})
