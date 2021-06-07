const chai = require('chai');
const Request = require('../../helpers/fake-request.js');
const Response = require('../../helpers/fake-response.js');
const nonce = require('../../../middleware/nonce.js');

const { expect } = chai;
const cspHeaderName = 'Content-Security-Policy';

const casaApp = {
  router: {
    use (mw) {
      this.mw = mw;
    }
  }
};

describe('Middleware: nonce', () => {
  const { router: app } = casaApp

  it('should add a middleware function if ENABLE_CSP is true', () => {
    nonce(casaApp, true);
    expect(app.mw).to.be.an.instanceOf(Function);
  });

  it('should add a middleware function if ENABLE_CSP is false', () => {
    nonce(casaApp, false);
    expect(app.mw).to.be.an.instanceOf(Function);
  });

  describe('Production middleware', () => {
    it('should append nonce to CSP header', () => {
      const req = new Request();
      const res = new Response(req);
      nonce(casaApp, true);

      res.setHeader(cspHeaderName, 'test');

      app.mw(req, res, () => {});
      expect(res.headers[cspHeaderName]).to.match(/^test 'nonce-[a-z0-9+/]{22}=='$/i);
    });

    it('should add nonce to res.locals', () => {
      const req = new Request();
      const res = new Response(req);
      nonce(casaApp, true);

      app.mw(req, res, () => {});
      expect(res.locals.nonce).to.match(/^[a-z0-9+/]{22}==$/i);
    });

    it('should add same nonce to res.locals and header', () => {
      const req = new Request();
      const res = new Response(req);
      nonce(casaApp, true);

      res.setHeader(cspHeaderName, 'test');

      app.mw(req, res, () => {});
      const templateNonce = res.locals.nonce;
      const headerNonce = res.headers[cspHeaderName].match(/^test 'nonce-([^']+)'$/i)[1];

      expect(templateNonce).to.equal(headerNonce);
    });

    it('should add different nonce each time', () => {
      const req = new Request();
      const res = new Response(req);
      nonce(casaApp, true);

      app.mw(req, res, () => {});
      const nonce1 = res.locals.nonce;

      app.mw(req, res, () => {});
      const nonce2 = res.locals.nonce;

      app.mw(req, res, () => {});
      const nonce3 = res.locals.nonce;

      expect(nonce1).to.not.equal(nonce2);
      expect(nonce2).to.not.equal(nonce3);
      expect(nonce1).to.not.equal(nonce3);
    });

    it('should call next', (done) => {
      const req = new Request();
      const res = new Response(req);
      nonce(casaApp, true);

      app.mw(req, res, done);
    });
  });

  describe('Non-production middleware', () => {
    it('should remove CSP header', () => {
      const req = new Request();
      const res = new Response(req);
      nonce(casaApp, false);

      res.setHeader(cspHeaderName, 'test');

      app.mw(req, res, () => {});
      expect(res.headers[cspHeaderName]).to.equal(undefined);
    });

    it('should call next', (done) => {
      const req = new Request();
      const res = new Response(req);
      nonce(casaApp, false);

      app.mw(req, res, done);
    });
  });
});
