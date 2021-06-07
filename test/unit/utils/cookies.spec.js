const sinon = require('sinon');
const { expect } = require('chai').use(require('sinon-chai'));
const Request = require('../../helpers/fake-request');
const Response = require('../../helpers/fake-response');
const { CONSENT_COOKIE_NAME } = require('../../../lib/constants')
const { setCookie, clearCookie } = require('../../../utils/cookies');

describe('Utils: cookies', () => {
  it('should export functions', () => {
    expect(setCookie).to.be.a('function');
    expect(clearCookie).to.be.a('function');
  });

  it('should set cookie name to value', () => {
    const req = new Request();
    const res = new Response(req);
    setCookie(req, res, 'name', 'value');
    expect(res.cookies).to.have.property('name').that.equals('value');
  });

  // @TODO add test for setting and unsetting cookies

  it('should set cookieChoiceMade in session to true if consent cookie set', () => {
    const req = new Request();
    const res = new Response(req);
    req.flash = sinon.stub();
    setCookie(req, res, CONSENT_COOKIE_NAME, 'reject');
    expect(req.session).to.have.property('cookieChoiceMade').that.equals(true);
  });

  it('should not set cookieChoiceMade in session to true if conset cookie is not set', () => {
    const req = new Request();
    const res = new Response(req);
    req.flash = sinon.stub();
    setCookie(req, res, 'name', 'value');
    expect(req.session).to.not.have.property('cookieChoiceMade');
  });
});
