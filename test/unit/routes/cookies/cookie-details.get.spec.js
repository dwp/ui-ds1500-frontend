const sinon = require('sinon');
const { expect } = require('chai').use(require('sinon-chai'));
const { COOKIE_POLICY, CONSENT_COOKIE_NAME, SESSIONID } = require('../../../../lib/constants');
const Request = require('../../../helpers/fake-request');
const Response = require('../../../helpers/fake-response');
const cookieDetailsGet = require('../../../../routes/cookies/cookie-details.get');

const sessionTtl = 60;

describe('Routes: cookie/cookie-details', () => {
  describe('get', () => {
    it('should be an function', () => {
      expect(cookieDetailsGet).to.be.an.instanceOf(Function);
    });

    it('should return a function', () => {
      expect(cookieDetailsGet()).to.be.an.instanceOf(Function);
    });

    it('should render template with data', () => {
      const route = cookieDetailsGet(CONSENT_COOKIE_NAME, SESSIONID, sessionTtl);
      const req = new Request();
      const res = new Response(req);
      const renderStub = sinon.stub();
      res.render = renderStub;
      res.locals.cookiePolicyUrl = COOKIE_POLICY
      route(req, res);
      expect(renderStub).to.be.calledOnceWithExactly('pages/cookies/cookie-details.njk', {
        cookiePolicyUrl: COOKIE_POLICY,
        sessionMinutes: sessionTtl / 60,
        consentCookieName: CONSENT_COOKIE_NAME,
        sessionCookieName: SESSIONID
      });
    });
  });
});
