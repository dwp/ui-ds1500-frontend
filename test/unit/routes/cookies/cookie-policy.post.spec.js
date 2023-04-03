const sinon = require('sinon');
const { expect } = require('chai').use(require('sinon-chai'));
const { CONSENT_COOKIE_NAME } = require('../../../../lib/constants');
const Request = require('../../../helpers/fake-request');
const Response = require('../../../helpers/fake-response');
const cookiePolicyPost = require('../../../../routes/cookies/cookie-policy.post');

describe('Routes: cookies/cookie-policy.post', () => {
  it('should be an function', () => {
    expect(cookiePolicyPost).to.be.an.instanceOf(Function);
  });

  it('should return a function', () => {
    expect(cookiePolicyPost(CONSENT_COOKIE_NAME)).to.be.an.instanceOf(Function);
  });

  it('should add error to session and redirect back if req.body.cookieConsent is undefined', () => {
    const route = cookiePolicyPost(CONSENT_COOKIE_NAME);
    const req = new Request();
    const res = new Response(req);
    req.url = 'test';
    route(req, res);
    expect(req.session.cookieConsentError).to.equal('cookie-policy:field.cookieConsent.required');
    expect(res.redirectedTo).to.equal('test');
  });

  it('should add error to session and redirect back if req.body.cookieConsent is not accept or reject', () => {
    const route = cookiePolicyPost(CONSENT_COOKIE_NAME);
    const req = new Request();
    const res = new Response(req);
    req.url = 'test';
    req.body.cookieConsent = 'wrong';
    route(req, res);
    expect(req.session.cookieConsentError).to.equal('cookie-policy:field.cookieConsent.required');
    expect(res.redirectedTo).to.equal('test');
  });

  it('should update consent cookie if req.body.cookieConsent is accept or reject', () => {
    const route = cookiePolicyPost(CONSENT_COOKIE_NAME);
    const req = new Request();
    const res = new Response(req);
    req.body.cookieConsent = 'accept';
    route(req, res);
    expect(res.cookies).to.have.property(CONSENT_COOKIE_NAME).that.equals('accept');
  });

  it('should set cookieChoiceMade in session to true', () => {
    const route = cookiePolicyPost(CONSENT_COOKIE_NAME);
    const req = new Request();
    const res = new Response(req);
    req.body.cookieConsent = 'accept';
    route(req, res);
    expect(req.session).to.have.property('cookieChoiceMade').that.equals(true);
  });

  it('should set secure flag to false by default', () => {
    const route = cookiePolicyPost(CONSENT_COOKIE_NAME);
    const req = new Request();
    const res = new Response(req);
    req.body.cookieConsent = 'accept';
    route(req, res);
    return expect(res.cookieOptions[CONSENT_COOKIE_NAME].secure).to.be.false;
  });

  it('should set secure flag to passed value', () => {
    const route = cookiePolicyPost(CONSENT_COOKIE_NAME, '/mount-url/', '/', true);
    const req = new Request();
    const res = new Response(req);
    req.body.cookieConsent = 'accept';
    route(req, res);
    return expect(res.cookieOptions[CONSENT_COOKIE_NAME].secure).to.be.true;
  });

  it('should set cookie path to mountUrl', () => {
    const route = cookiePolicyPost(CONSENT_COOKIE_NAME, '/mount-url/');
    const req = new Request();
    const res = new Response(req);
    req.body.cookieConsent = 'accept';
    res.cookie = sinon.stub();
    route(req, res);
    expect(res.cookie).to.be.calledWithMatch(CONSENT_COOKIE_NAME, 'accept', sinon.match({
      path: '/mount-url/'
    }));
  });

  it('should remove ga cookies if req.body.cookieConsent is reject', () => {
    process.env.DS1500_SERVICE_DOMAIN = '/gtm-domain';
    const route = cookiePolicyPost(CONSENT_COOKIE_NAME, '/mount-url/', '/gtm-domain', true);
    const req = new Request();
    const res = new Response(req);
    req.body.cookieConsent = 'reject';
    req.headers.cookie = 'test=test; _gat=test';
    res.clearCookie = sinon.stub();
    route(req, res);
    expect(res.clearCookie).to.be.calledWith('_gat', { domain: '/gtm-domain', path: '/' });
    expect(res.clearCookie).to.be.calledWith('_ga', { domain: '/gtm-domain', path: '/' });
    expect(res.clearCookie).to.be.calledWith('_gid', { domain: '/gtm-domain', path: '/' });
    delete process.env.DS1500_SERVICE_DOMAIN;
  });

  it('should remove ga _gat cookie with dynamic name', () => {
    process.env.DS1500_SERVICE_DOMAIN = '/gtm-domain';
    const route = cookiePolicyPost(CONSENT_COOKIE_NAME, '/mount-url/', '/gtm-domain', true);
    const req = new Request();
    const res = new Response(req);
    req.body.cookieConsent = 'reject';
    req.headers.cookie = 'test=test; _gat_UA-345678-1=1; egg=egg';
    res.clearCookie = sinon.stub();
    route(req, res);
    expect(res.clearCookie).to.be.calledWith('_gat_UA-345678-1', { domain: '/gtm-domain', path: '/' });
    delete process.env.DS1500_SERVICE_DOMAIN;
  });

  it('should redirect back to backto query URL if present', () => {
    const route = cookiePolicyPost(CONSENT_COOKIE_NAME);
    const req = new Request();
    const res = new Response(req);
    req.body.cookieConsent = 'accept';
    req.query.backto = 'http://localhost/sr1-start';
    route(req, res);
    expect(res.redirectedTo).to.equal('/sr1-start');
  });

  it('should remove consecutive slashes from backto URL', () => {
    const route = cookiePolicyPost(CONSENT_COOKIE_NAME);
    const req = new Request();
    const res = new Response(req);
    req.body.cookieConsent = 'accept';
    req.query.backto = 'http://localhost/cookie-policy////sr1-start';
    route(req, res);
    expect(res.redirectedTo).to.equal('/cookie-policy/sr1-start');
  });

  it('should remove . and : form backto URL', () => {
    const route = cookiePolicyPost(CONSENT_COOKIE_NAME);
    const req = new Request();
    const res = new Response(req);
    req.body.cookieConsent = 'accept';
    req.query.backto = '/cookie-policy/:sr1-start.';
    route(req, res);
    expect(res.redirectedTo).to.equal('/cookie-policy/sr1-start');
  });

  it('should redirect back to req.url if backto query is not present', () => {
    const route = cookiePolicyPost(CONSENT_COOKIE_NAME);
    const req = new Request();
    const res = new Response(req);
    req.body.cookieConsent = 'accept';
    req.originalUrl = 'proxy/test';
    req.url = 'test';
    route(req, res);
    expect(res.redirectedTo).to.equal('test');
  });
});
