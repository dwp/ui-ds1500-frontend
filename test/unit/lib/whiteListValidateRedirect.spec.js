const chai = require('chai');
const expect = chai.expect;

const whiteListValidateRedirect = require('../../../lib/whiteListValidateRedirect')

describe('WhiteListValidateRedirect', function () {
  it('should be a function', function () {
    expect(whiteListValidateRedirect).to.be.an.instanceOf(Function);
  });

  it('should validate redirect if it is in whitelist', function () {
    const redirect = 'sr1'
    expect(whiteListValidateRedirect(redirect)).to.equal('sr1');
  });

  it('should not validate redirect if it is not in whitelist', function () {
    const redirect = 'fake url'
    expect(whiteListValidateRedirect(redirect)).to.be.equal(false);
  });
})
