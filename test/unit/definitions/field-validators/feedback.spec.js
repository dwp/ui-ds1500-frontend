const { expectValidatorToFail, expectValidatorToPass } = require('../../../helpers/validator-assertions');
const validators = require('../../../../definitions/fields/feedback')();

describe('Validators: feedback', () => {
  describe('field: rating', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'rating', 'Required', '', {}, {
        summary: 'feedback:errors.required'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      await expectValidatorToPass(validators, 'rating', 'Required', 'test', { rating: 'test' });
    });

    it('should fail "inArray" validator if invalid value is provided', async () => {
      await expectValidatorToFail(validators, 'rating', 'InArray', 'invalid value', { rating: 'invalid value' }, {
        summary: 'feedback:errors.required'
      });
    });

    it('should pass "inArray" validator if value is Very satisfied', async () => {
      await expectValidatorToPass(validators, 'rating', 'InArray', 'Very satisfied', { rating: 'Very satisfied' });
    });

    it('should pass "inArray" validator if value is Satisfied', async () => {
      await expectValidatorToPass(validators, 'rating', 'InArray', 'Satisfied', { rating: 'Satisfied' });
    });

    it('should pass "inArray" validator if value is Very Neither satisfied or dissatisfied', async () => {
      await expectValidatorToPass(validators, 'rating', 'InArray', 'Neither satisfied or dissatisfied', { rating: 'Neither satisfied or dissatisfied' });
    });

    it('should pass "inArray" validator if value is Dissatisfied', async () => {
      await expectValidatorToPass(validators, 'rating', 'InArray', 'Dissatisfied', { rating: 'Dissatisfied' });
    });

    it('should pass "inArray" validator if value is Very dissatisfied', async () => {
      await expectValidatorToPass(validators, 'rating', 'InArray', 'Very dissatisfied', { rating: 'Very dissatisfied' });
    });
  })

  describe('field: improvements', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'improvements', 'Required', '', {}, {
        summary: 'feedback:errors.maxLength'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      await expectValidatorToPass(validators, 'improvements', 'Required', 'test', { improvements: 'test' });
    });

    it('should fail "strlen" validator if invalid length is provided', async () => {
      await expectValidatorToFail(validators, 'improvements', 'Strlen', 'a'.repeat(1201), { improvements: 'a'.repeat(1201) }, {
        summary: 'feedback:errors.maxLength'
      });
    });

    it('should pass "strlen" validator if a valid length is provided', async () => {
      await expectValidatorToPass(validators, 'improvements', 'Strlen', 'a'.repeat(120), { improvements: 'a'.repeat(120) });
    });
  })
})
