const { expectValidatorToPass } = require('../../../helpers/validator-assertions');
const validators = require('../../../../definitions/fields/sr1-start');

describe('sr1-start field: pageId', () => {
  it('should pass "optional" validator if no value provided', async () => {
    await expectValidatorToPass(validators, 'pageId', 'optional', { pageId: '' });
  });

  it('should pass "optional" validator if value provided', async () => {
    await expectValidatorToPass(validators, 'pageId', 'optional', { pageId: 1 });
  });
});
