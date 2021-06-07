const { expect } = require('chai').use(require('sinon-chai'));
const { CONSENT_COOKIE_NAME, COOKIE_UPDATE_QUERY_PARAM } = require('../../../../lib/constants');
const Request = require('../../../helpers/fake-request');
const Response = require('../../../helpers/fake-response');
const cookiePolicyPost = require('../../../../routes/cookies/cookie-policy.post');

const expectedTestUpdatedUrl = `test?${COOKIE_UPDATE_QUERY_PARAM}=1`

describe('Routes: cookies/cookie-policy.get', () => {
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
    req.body.cookieConsent = undefined;
    req.originalUrl = 'test';
    route(req, res);
    expect(req.session.cookieConsentError).to.equal('cookie-policy:field.cookieConsent.required');
    expect(res.redirectedTo).to.equal(`test?${COOKIE_UPDATE_QUERY_PARAM}=1`);
  });

  it('should add error to session and redirect back if req.body.cookieConsent is not accept or reject', () => {
    const route = cookiePolicyPost(CONSENT_COOKIE_NAME);
    const req = new Request();
    const res = new Response(req);
    req.originalUrl = 'test';
    req.body.cookieConsent = 'wrong';
    route(req, res);
    expect(req.session.cookieConsentError).to.equal('cookie-policy:field.cookieConsent.required');
    expect(res.redirectedTo).to.equal(expectedTestUpdatedUrl);
  });

  it('should update consent cookie if req.body.cookieConsent is accept or reject', () => {
    const route = cookiePolicyPost(CONSENT_COOKIE_NAME);
    const req = new Request();
    const res = new Response(req);
    req.body.cookieConsent = 'accept';
    route(req, res);
    expect(res.cookies).to.have.property(CONSENT_COOKIE_NAME).that.equals('accept');
  });

  it('should redirect back to previousPage query URL if present', () => {
    const route = cookiePolicyPost(CONSENT_COOKIE_NAME);
    const req = new Request();
    const res = new Response(req);
    req.body.cookieConsent = 'accept';
    req.body.previousPage = '/start';
    route(req, res);
    expect(res.redirectedTo).to.equal(`/start?${COOKIE_UPDATE_QUERY_PARAM}=1`);
  });

  it('should redirect back to /cookie-policy if previousPage query is not present', () => {
    const route = cookiePolicyPost(CONSENT_COOKIE_NAME);
    const req = new Request();
    const res = new Response(req);
    req.body.cookieConsent = 'accept';
    req.originalUrl = 'test';
    route(req, res);
    expect(res.redirectedTo).to.equal(`/cookie-policy?${COOKIE_UPDATE_QUERY_PARAM}=1`);
  });
});
