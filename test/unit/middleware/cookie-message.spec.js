const { expect } = require('chai');
const { waypoints } = require('../../../lib/constants');
const Request = require('../../helpers/fake-request');
const Response = require('../../helpers/fake-response');
const cookieMessage = require('../../../middleware/cookie-message');

const mountUrl = '/';
const proxymountUrl = mountUrl
const cookieName = 'cookie-name';

describe('Middleware: cookie-message', () => {
  let app;
  // set test mode
  process.env.NODE_ENV = 'test';

  beforeEach(() => {
    app = {
      prependUse (mw) {
        this.prependUse = mw;
      },
      post (p, mw) {
        this.all = mw;
      }
    };
  });

  it('should add a "prependUse" middleware', () => {
    cookieMessage(app, cookieName, waypoints, mountUrl, proxymountUrl);
    expect(app.prependUse).to.be.an.instanceOf(Function);
  });

  it('should set cookieChoiceMade template variable', () => {
    const req = new Request();
    const res = new Response(req);
    cookieMessage(app, cookieName, waypoints, mountUrl, proxymountUrl);
    req.session.cookieChoiceMade = true;
    app.prependUse(req, res, () => {});
    expect(res.locals).to.have.property('cookieChoiceMade').that.deep.equals(true);
  });

  it('should clear cookieChoiceMade from session after setting template variable', () => {
    const req = new Request();
    const res = new Response(req);
    cookieMessage(app, cookieName, waypoints, mountUrl, proxymountUrl);
    req.session.cookieChoiceMade = true;
    app.prependUse(req, res, () => {});
    expect(req.session.cookieChoiceMade).to.equal(undefined);
  });

  it('should add consent cookie value to template variable', () => {
    const req = new Request();
    const res = new Response(req);
    cookieMessage(app, cookieName, waypoints, mountUrl, proxymountUrl);
    req.cookies[cookieName] = 'test';
    app.prependUse(req, res, () => {});
    expect(res.locals).to.have.property('consentCookieValue').that.equals('test');
  });

  it('should set consent submit URL template variable', () => {
    const req = new Request();
    const res = new Response(req);
    cookieMessage(app, cookieName, waypoints, mountUrl, proxymountUrl);
    app.prependUse(req, res, () => {});
    expect(res.locals).to.have.property('cookieConsentSubmit').that.equals(waypoints.COOKIE_CONSENT);
  });

  it('should set cookie policy footer URL template variable', () => {
    const req = new Request();
    const res = new Response(req);
    cookieMessage(app, cookieName, waypoints, mountUrl, '/proxy/');
    req.url = '/proxy/sr1-start';
    app.prependUse(req, res, () => {});
    expect(res.locals).to.have.property('cookiePolicyUrl').that.equals(`${mountUrl}${waypoints.COOKIE_POLICY}?backto=%2Fsr1-start`);
  });

  it('should not double up on backto queries', () => {
    const req = new Request();
    const res = new Response(req);
    cookieMessage(app, cookieName, waypoints, mountUrl);
    req.url = `${mountUrl}${waypoints.COOKIE_POLICY}?backto=%2Fsr1-start`;
    app.prependUse(req, res, () => {});
    expect(res.locals).to.have.property('cookiePolicyUrl').that.equals(req.url);
  });

  it('should not double up on backto queries when proxied', () => {
    const req = new Request();
    const res = new Response(req);
    cookieMessage(app, cookieName, waypoints, '/mountUrl/', '/proxy/');
    req.url = `/proxy/${waypoints.COOKIE_POLICY}?backto=%2Fsr1-start`;
    app.prependUse(req, res, () => {});
    expect(res.locals).to.have.property('cookiePolicyUrl').that.equals(`/mountUrl/${waypoints.COOKIE_POLICY}?backto=%2Fsr1-start`);
  });

  it('should call next', (done) => {
    const req = new Request();
    const res = new Response(req);
    cookieMessage(app, cookieName, waypoints, mountUrl, proxymountUrl);
    app.prependUse(req, res, done);
  });
});
