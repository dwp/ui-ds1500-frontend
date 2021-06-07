const sinon = require('sinon');
const { expect } = require('chai').use(require('sinon-chai'));
const { COOKIE_DETAILS } = require('../../../../lib/constants');
const Request = require('../../../helpers/fake-request');
const Response = require('../../../helpers/fake-response');
const cookiePolicyGet = require('../../../../routes/cookies/cookie-policy.get');

describe('Routes: cookies/cookie-policy.get', () => {
  it('should be an function', () => {
    expect(cookiePolicyGet).to.be.an.instanceOf(Function);
  });

  it('should return a function', () => {
    expect(cookiePolicyGet()).to.be.an.instanceOf(Function);
  });

  it('should render template with data', () => {
    const route = cookiePolicyGet(COOKIE_DETAILS);
    const req = new Request();
    const res = new Response(req);
    const renderStub = sinon.stub();
    res.render = renderStub;
    route(req, res);
    expect(renderStub).to.be.calledOnceWithExactly('pages/cookies/cookie-policy.njk', {
      cookieDetailsUrl: COOKIE_DETAILS,
      formErrorsGovukArray: undefined,
      formErrors: undefined
    });
  });

  it('should render template with data including errors if in session', () => {
    const route = cookiePolicyGet(COOKIE_DETAILS);
    const req = new Request();
    const res = new Response(req);
    const renderStub = sinon.stub();
    res.render = renderStub;
    res.locals.t = (k) => k;
    req.session.cookieConsentError = 'error';
    route(req, res);
    expect(renderStub).to.be.calledOnceWithExactly('pages/cookies/cookie-policy.njk', {
      cookieDetailsUrl: COOKIE_DETAILS,
      formErrorsGovukArray: [{
        text: 'error',
        href: '#f-cookieConsent'
      }],
      formErrors: {
        cookieConsent: [{
          summary: 'error',
          inline: 'error'
        }]
      }
    });
  });

  it('should clear error from session', () => {
    const route = cookiePolicyGet(COOKIE_DETAILS);
    const req = new Request();
    const res = new Response(req);
    const renderStub = sinon.stub();
    res.render = renderStub;
    res.locals.t = (k) => k;
    req.session.cookieConsentError = 'error';
    route(req, res);
    expect(req.session.cookieConsentError).to.equal(undefined);
  });
});
