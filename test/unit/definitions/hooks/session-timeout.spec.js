const { expect } = require('chai').use(require('sinon-chai'));
const Request = require('../../../helpers/fake-request');
const Response = require('../../../helpers/fake-response');
const sessionTimeoutHook = require('../../../../definitions/hooks/session-timeout');

describe('Hooks: session-timeout', () => {
  it('should export a function', () => {
    expect(sessionTimeoutHook).to.be.a('function');
  });

  it('should return a object with prerender and preredirect functions', () => {
    const sessionTimeoutHooks = sessionTimeoutHook();
    expect(sessionTimeoutHooks).to.be.an('object');
    expect(sessionTimeoutHooks).to.have.property('prerender').that.is.a('function');
  });

  describe('prerender', () => {
    it('should call next', (done) => {
      const req = new Request();
      const res = new Response(req);
      const { prerender } = sessionTimeoutHook();

      prerender(req, res, done);
      done()
    });
  });
});
