const { expectValidatorToPass, expectValidatorToFail } = require('../../../helpers/validator-assertions');
const validators = require('../../../../definitions/fields/select-form')();

describe('field: selectForm', () => {
  it('should fail "required" validator if no value is provided', async () => {
    await expectValidatorToFail(validators, 'selectForm', 'Required', '', { selectForm: '' }, {
      summary: 'select-form:selectForm.empty'
    });
  });

  it('should pass "required" validator if a non-empty value is provided', async () => {
    await expectValidatorToPass(validators, 'selectForm', 'Required', 'test-value', { selectForm: 'test-value' });
  });
})
