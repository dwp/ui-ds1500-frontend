const sinon = require('sinon');
const { expectValidatorToFail, expectValidatorToPass } = require('../../../helpers/validator-assertions');
const validators = require('../../../../definitions/fields/sr1')();

const defaultValidators = {
  patientName: '',
  patientAddress: '',
  patientDateOfBirth: { dd: '', mm: '', yyyy: '' },
  dateOfDiagnosis: { dd: '', mm: '', yyyy: '' },
  dateOfSpecialRules: { dd: '', mm: '', yyyy: '' }
}

describe('sr1 field: dateOfSpecialRules', () => {
  describe('validator: isEmptydateOfSpecialRules', () => {
    it('should fail "isEmptydateOfSpecialRules" validator if no "dd mm yyyy" is provided', async () => {
      await expectValidatorToFail(validators, 'dateOfSpecialRules', 'isEmptydateOfSpecialRules', { dd: '', mm: '', yyyy: '' }, { ...defaultValidators }, {
        summary: 'sr1:dateOfSpecialRules.empty'
      });
    });
    it('should fail "isEmptydateOfSpecialRules" validator if no "dd" is provided', async () => {
      const dateOfSpecialRules = { dd: '', mm: '02', yyyy: '2020' }
      await expectValidatorToFail(validators, 'dateOfSpecialRules', 'isEmptydateOfSpecialRules', dateOfSpecialRules, { ...defaultValidators, dateOfSpecialRules }, {
        summary: 'sr1:dateOfSpecialRules[dd].empty'
      });
    });
    it('should fail "isEmptydateOfSpecialRules" validator if no "mm" is provided', async () => {
      const dateOfSpecialRules = { dd: '01', mm: '', yyyy: '2020' }
      await expectValidatorToFail(validators, 'dateOfSpecialRules', 'isEmptydateOfSpecialRules', dateOfSpecialRules, { ...defaultValidators, dateOfSpecialRules }, {
        summary: 'sr1:dateOfSpecialRules[mm].empty'
      });
    });
    it('should fail "isEmptydateOfSpecialRules" validator if no "yyyy" is provided', async () => {
      const dateOfSpecialRules = { dd: '01', mm: '12', yyyy: '' }
      await expectValidatorToFail(validators, 'dateOfSpecialRules', 'isEmptydateOfSpecialRules', dateOfSpecialRules, { ...defaultValidators, dateOfSpecialRules }, {
        summary: 'sr1:dateOfSpecialRules[yyyy].empty'
      });
    });
    it('should pass "isEmptydateOfSpecialRules" validator if a valid value is provided', async () => {
      const dateOfSpecialRules = { dd: '01', mm: '12', yyyy: '2020' }
      await expectValidatorToPass(validators, 'dateOfSpecialRules', 'isEmptydateOfSpecialRules', dateOfSpecialRules, { ...defaultValidators, dateOfSpecialRules });
    });
  })

  describe('validator: isDateNumericSr', () => {
    it('should fail "isDateNumericSr" validator if "dd mm yyyy" is not numeric', async () => {
      const dateOfSpecialRules = { dd: '1a', mm: '2b', yyyy: '202c' }
      await expectValidatorToFail(validators, 'dateOfSpecialRules', 'isDateNumericSr', dateOfSpecialRules, { ...defaultValidators, dateOfSpecialRules }, {
        summary: 'sr1:dateOfSpecialRules.isNumeric'
      });
    });
    it('should fail "isDateNumericSr" validator if "dd" is not numeric', async () => {
      const dateOfSpecialRules = { dd: '1a', mm: '02', yyyy: '2020' }
      await expectValidatorToFail(validators, 'dateOfSpecialRules', 'isDateNumericSr', dateOfSpecialRules, { ...defaultValidators, dateOfSpecialRules }, {
        summary: 'sr1:dateOfSpecialRules.isNumeric'
      });
    });
    it('should fail "isDateNumericSr" validator if "mm" is not numeric', async () => {
      const dateOfSpecialRules = { dd: '01', mm: '2a', yyyy: '2020' }
      await expectValidatorToFail(validators, 'dateOfSpecialRules', 'isDateNumericSr', dateOfSpecialRules, { ...defaultValidators, dateOfSpecialRules }, {
        summary: 'sr1:dateOfSpecialRules.isNumeric'
      });
    });
    it('should fail "isDateNumericSr" validator if "yyyy" is not numeric', async () => {
      const dateOfSpecialRules = { dd: '01', mm: '02', yyyy: '202c' }
      await expectValidatorToFail(validators, 'dateOfSpecialRules', 'isDateNumericSr', dateOfSpecialRules, { ...defaultValidators, dateOfSpecialRules }, {
        summary: 'sr1:dateOfSpecialRules.isNumeric'
      });
    });
    it('should pass "isDateNumericSr" validator if "dd mm yyyy" is numeric', async () => {
      const dateOfSpecialRules = { dd: '01', mm: '02', yyyy: '2020' }
      await expectValidatorToPass(validators, 'dateOfSpecialRules', 'isDateNumericSr', dateOfSpecialRules, { ...defaultValidators, dateOfSpecialRules });
    });
  })

  describe('validator: isValidDateRange', () => {
    it('should fail "isValidDateRange" validator if "dd mm yyyy" is not in range', async () => {
      const dateOfSpecialRules = { dd: '40', mm: '13', yyyy: '1888' };
      await expectValidatorToFail(validators, 'dateOfSpecialRules', 'isValidDateRangeSr', dateOfSpecialRules, { ...defaultValidators, dateOfSpecialRules }, {
        summary: 'sr1:dateOfSpecialRules.range'
      });
    });
    it('should fail "isValidDateRange" validator if "dd" is not in range', async () => {
      const dateOfSpecialRules = { dd: '40', mm: '12', yyyy: '2019' };
      await expectValidatorToFail(validators, 'dateOfSpecialRules', 'isValidDateRangeSr', dateOfSpecialRules, { ...defaultValidators, dateOfSpecialRules }, {
        summary: 'sr1:dateOfSpecialRules[dd].range'
      });
    });
    it('should fail "isValidDateRange" validator if "mm" is not in range', async () => {
      const dateOfSpecialRules = { dd: '02', mm: '14', yyyy: '2019' };
      await expectValidatorToFail(validators, 'dateOfSpecialRules', 'isValidDateRangeSr', dateOfSpecialRules, { ...defaultValidators, dateOfSpecialRules }, {
        summary: 'sr1:dateOfSpecialRules[mm].range'
      });
    });
    it('should fail "isValidDateRange" validator if "yyyy" is not in range', async () => {
      const dateOfSpecialRules = { dd: '01', mm: '12', yyyy: '1684' };
      await expectValidatorToFail(validators, 'dateOfSpecialRules', 'isValidDateRangeSr', dateOfSpecialRules, { ...defaultValidators, dateOfSpecialRules }, {
        summary: 'sr1:dateOfSpecialRules[yyyy].range'
      });
    });
    it('should pass "isValidDateRange" validator if "dd mm yyyy" is in range', async () => {
      const dateOfSpecialRules = { dd: '01', mm: '12', yyyy: '2020' };
      await expectValidatorToPass(validators, 'dateOfSpecialRules', 'isValidDateRangeSr', dateOfSpecialRules, { ...defaultValidators, dateOfSpecialRules });
    });
  })

  describe('validator: isdateOfSpecialRulesInFuture', () => {
    let clock;
    beforeEach(() => {
      // stub date to 01/01/2020
      clock = sinon.useFakeTimers(new Date(1970, 1, 1).getTime());
    })
    afterEach(() => {
      // restore to original date
      clock.restore();
    })

    it('should fail "isdateOfSpecialRulesInFuture" validator if value is beyond today', async () => {
      const setValidators = {
        dateOfSpecialRules: { dd: '01', mm: '03', yyyy: '1970' },
        patientDateOfBirth: { dd: '01', mm: '01', yyyy: '1970' }
      }

      await expectValidatorToFail(validators, 'dateOfSpecialRules', 'isdateOfSpecialRulesInFuture', setValidators.dateOfSpecialRules, { ...defaultValidators, ...setValidators }, {
        summary: 'sr1:dateOfSpecialRules.future',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]']
      });
    });

    it('should pass "isdateOfSpecialRulesInFuture" validator if value is before today', async () => {
      const dateOfSpecialRules = { dd: '01', mm: '01', yyyy: '1969' }
      await expectValidatorToPass(validators, 'dateOfSpecialRules', 'isdateOfSpecialRulesInFuture', dateOfSpecialRules, { ...defaultValidators, dateOfSpecialRules });
    });
  })
})
