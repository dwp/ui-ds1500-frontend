const { expectValidatorToFail, expectValidatorToPass } = require('../../../helpers/validator-assertions');
const validators = require('../../../../definitions/field-validators/feedback');

describe('Validators: feedback', () => {
  describe('field: rating', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'rating', 'required', {}, {
        summary: 'feedback:errors.required'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      await expectValidatorToPass(validators, 'rating', 'required', { rating: 'test' });
    });

    it('should fail "inArray" validator if invalid value is provided', async () => {
      await expectValidatorToFail(validators, 'rating', 'inArray', { rating: 'invalid value' }, {
        summary: 'feedback:errors.required'
      });
    });

    it('should pass "inArray" validator if value is Very satisfied', async () => {
      await expectValidatorToPass(validators, 'rating', 'inArray', { rating: 'Very satisfied' });
    });

    it('should pass "inArray" validator if value is Satisfied', async () => {
      await expectValidatorToPass(validators, 'rating', 'inArray', { rating: 'Satisfied' });
    });

    it('should pass "inArray" validator if value is Very Neither satisfied or dissatisfied', async () => {
      await expectValidatorToPass(validators, 'rating', 'inArray', { rating: 'Neither satisfied or dissatisfied' });
    });

    it('should pass "inArray" validator if value is Dissatisfied', async () => {
      await expectValidatorToPass(validators, 'rating', 'inArray', { rating: 'Dissatisfied' });
    });

    it('should pass "inArray" validator if value is Very dissatisfied', async () => {
      await expectValidatorToPass(validators, 'rating', 'inArray', { rating: 'Very dissatisfied' });
    });
  })

  describe('field: improvements', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(validators, 'improvements', 'required', {}, {
        summary: 'feedback:errors.maxLength'
      });
    });

    it('should pass "required" validator if a non-empty value is provided', async () => {
      await expectValidatorToPass(validators, 'improvements', 'required', { improvements: 'test' });
    });

    it('should fail "strlen" validator if invalid length is provided', async () => {
      await expectValidatorToFail(validators, 'improvements', 'strlen', { improvements: 'a'.repeat(1201) }, {
        summary: 'feedback:errors.maxLength'
      });
    });

    it('should pass "strlen" validator if a valid length is provided', async () => {
      await expectValidatorToPass(validators, 'improvements', 'strlen', { improvements: 'a'.repeat(120) });
    });
  })
})
