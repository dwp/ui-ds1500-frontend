const { expect } = require('chai').use(require('sinon-chai'));
const Request = require('../../../helpers/fake-request');
const Response = require('../../../helpers/fake-response');
const sr1Start = require('../../../../definitions/hooks/sr1-start');

describe('Hooks: sr1-start', () => {
  it('should export a function', () => {
    expect(sr1Start).to.be.a('function');
  });

  it('should return a object with prerender and preredirect functions', () => {
    const sr1StartHooks = sr1Start();
    expect(sr1StartHooks).to.be.an('object');
    expect(sr1StartHooks).to.have.property('prerender').that.is.a('function');
    expect(sr1StartHooks).to.have.property('preredirect').that.is.a('function');
  });

  describe('prerender', () => {
    it('should add previousPage session as sr1-start', () => {
      const req = new Request();
      const res = new Response(req);
      const { prerender } = sr1Start();

      prerender(req, res, () => {});

      expect(req.session).to.have.property('previousPage').that.equals('sr1-start');
    });

    it('should call next', (done) => {
      const req = new Request();
      const res = new Response(req);
      const { prerender } = sr1Start();

      prerender(req, res, done);
    });
  });

  describe('preredirect', () => {
    it('should set validSession session to true', () => {
      const req = new Request();
      const res = new Response(req);
      const { preredirect } = sr1Start();

      preredirect(req, res, () => {});

      expect(req.session).to.have.property('validSession').that.equals(true);
    });

    it('should call next', (done) => {
      const req = new Request();
      const res = new Response(req);
      const { preredirect } = sr1Start();

      preredirect(req, res, done);
    });
  });
});
