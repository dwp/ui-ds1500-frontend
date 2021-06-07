const { expect } = require('chai');
const { COOKIE_POLICY, CONSENT_COOKIE_NAME, COOKIE_CONSENT, COOKIE_UPDATE_QUERY_PARAM } = require('../../../lib/constants');
const Request = require('../../helpers/fake-request');
const Response = require('../../helpers/fake-response');
const cookieMessage = require('../../../middleware/cookie-message');

const mountUrl = '/';
const proxyMountUrl = mountUrl
const SERVER_SSL_ENABLED = false

describe('Middleware: cookie-message', () => {
  let app;
  // set test mode
  process.env.NODE_ENV = 'test';

  beforeEach(() => {
    app = {
      use (mw) {
        this.use = mw;
      },
      post (p, mw) {
        this.all = mw;
      }
    };
  });

  it('should add a "use" middleware', () => {
    cookieMessage(app, mountUrl, proxyMountUrl, CONSENT_COOKIE_NAME, COOKIE_POLICY, COOKIE_CONSENT, SERVER_SSL_ENABLED);
    expect(app.use).to.be.an.instanceOf(Function);
  });

  it('should add an "all" middleware', () => {
    cookieMessage(app, mountUrl, proxyMountUrl, CONSENT_COOKIE_NAME, COOKIE_POLICY, COOKIE_CONSENT, SERVER_SSL_ENABLED);
    expect(app.all).to.be.an.instanceOf(Function);
  });

  describe('use: set template options middleware', () => {
    it('should set cookiesConsented template variable', () => {
      const req = new Request();
      const res = new Response(req);
      const expectCookieValue = 'accept'
      cookieMessage(app, mountUrl, proxyMountUrl, CONSENT_COOKIE_NAME, COOKIE_POLICY, COOKIE_CONSENT, SERVER_SSL_ENABLED);
      req.session.cookieChoiceMade = true;
      req.cookies[CONSENT_COOKIE_NAME] = expectCookieValue
      app.use(req, res, () => {});
      expect(res.locals).to.have.property('cookiesConsented').that.deep.equals(expectCookieValue);
    });

    it('should clear cookieChoiceMade from session after setting template variable', () => {
      const req = new Request();
      const res = new Response(req);
      cookieMessage(app, mountUrl, proxyMountUrl, CONSENT_COOKIE_NAME, COOKIE_POLICY, COOKIE_CONSENT, SERVER_SSL_ENABLED);
      req.session.cookieChoiceMade = true;
      app.use(req, res, () => {});
      expect(req.session.cookieChoiceMade).to.equal(undefined);
    });

    it('should add consent cookie value to template variable', () => {
      const req = new Request();
      const res = new Response(req);
      cookieMessage(app, mountUrl, proxyMountUrl, CONSENT_COOKIE_NAME, COOKIE_POLICY, COOKIE_CONSENT, SERVER_SSL_ENABLED);
      req.cookies[CONSENT_COOKIE_NAME] = 'test';
      app.use(req, res, () => {});
      expect(res.locals).to.have.property('cookieMessage').that.equals('test');
    });

    it('should default consent cookie template variable to "unset"', () => {
      const req = new Request();
      const res = new Response(req);
      cookieMessage(app, mountUrl, proxyMountUrl, CONSENT_COOKIE_NAME, COOKIE_POLICY, COOKIE_CONSENT, SERVER_SSL_ENABLED);
      app.use(req, res, () => {});
      expect(res.locals).to.have.property('cookieMessage').that.equals('unset');
    });

    it('should set consent submit URL template variable', () => {
      const req = new Request();
      const res = new Response(req);
      cookieMessage(app, mountUrl, proxyMountUrl, CONSENT_COOKIE_NAME, COOKIE_POLICY, COOKIE_CONSENT, SERVER_SSL_ENABLED);
      app.use(req, res, () => {});
      expect(res.locals).to.have.property('cookieConsentSubmit').that.equals(COOKIE_CONSENT);
    });

    it('should set cookie policy footer URL template variable', () => {
      const req = new Request();
      const res = new Response(req);
      const expectedUrl = `${mountUrl}${COOKIE_POLICY}`
      cookieMessage(app, mountUrl, proxyMountUrl, CONSENT_COOKIE_NAME, COOKIE_POLICY, COOKIE_CONSENT, SERVER_SSL_ENABLED);
      req.originalUrl = '/start';
      app.use(req, res, () => {});
      expect(res.locals).to.have.property('cookiePolicyUrl').that.equals(expectedUrl);
    });

    it('should call next', (done) => {
      const req = new Request();
      const res = new Response(req);
      cookieMessage(app, mountUrl, proxyMountUrl, CONSENT_COOKIE_NAME, COOKIE_POLICY, COOKIE_CONSENT, SERVER_SSL_ENABLED);
      app.use(req, res, done);
    });
  });

  describe('all: handle submissions from consent banner', () => {
    it('should set consent cookie if accept', () => {
      const req = new Request();
      const res = new Response(req);
      cookieMessage(app, mountUrl, proxyMountUrl, CONSENT_COOKIE_NAME, COOKIE_POLICY, COOKIE_CONSENT, SERVER_SSL_ENABLED);
      req.params.cookieMethod = 'accept';
      app.all(req, res, () => {});
      expect(res.cookies).to.have.property(CONSENT_COOKIE_NAME).that.equals('accept');
    });

    it('should set consent cookie if reject', () => {
      const req = new Request();
      const res = new Response(req);
      cookieMessage(app, mountUrl, proxyMountUrl, CONSENT_COOKIE_NAME, COOKIE_POLICY, COOKIE_CONSENT, SERVER_SSL_ENABLED);
      req.params.cookieMethod = 'accept';
      app.all(req, res, () => {});
      expect(res.cookies).to.have.property(CONSENT_COOKIE_NAME).that.equals('accept');
    });

    it('should not set consent cookie if not accept or reject', () => {
      const req = new Request();
      const res = new Response(req);
      cookieMessage(app, mountUrl, proxyMountUrl, CONSENT_COOKIE_NAME, COOKIE_POLICY, COOKIE_CONSENT, SERVER_SSL_ENABLED);
      req.params.cookieMethod = 'bad';
      app.all(req, res, () => {});
      expect(res.cookies).to.not.have.property(CONSENT_COOKIE_NAME);
    });

    it('should redirect back', () => {
      const req = new Request();
      const res = new Response(req);
      cookieMessage(app, mountUrl, proxyMountUrl, CONSENT_COOKIE_NAME, COOKIE_POLICY, COOKIE_CONSENT, SERVER_SSL_ENABLED);
      app.all(req, res, () => {});
      expect(res.redirectedTo).to.equal(`/cookie-policy?${COOKIE_UPDATE_QUERY_PARAM}=1`);
    });
  });
});
