const { expectValidatorToPass } = require('../../../helpers/validator-assertions');
const validators = require('../../../../definitions/field-validators/empty');

describe('empty field: pageId', () => {
  it('should pass "optional" validator if no value provided', async () => {
    await expectValidatorToPass(validators, 'pageId', 'optional', { pageId: '' });
  });

  it('should pass "optional" validator if no value provided', async () => {
    await expectValidatorToPass(validators, 'pageId', 'optional', { pageId: 1 });
  });
})
