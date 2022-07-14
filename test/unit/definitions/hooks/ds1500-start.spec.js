const { expect } = require('chai').use(require('sinon-chai'));
const Request = require('../../../helpers/fake-request');
const Response = require('../../../helpers/fake-response');
const ds1500Start = require('../../../../definitions/hooks/ds1500-start');

describe('Hooks: ds1500-start', () => {
  it('should export a function', () => {
    expect(ds1500Start).to.be.a('function');
  });

  it('should return a object with prerender and preredirect functions', () => {
    const ds1500StartHooks = ds1500Start();
    expect(ds1500StartHooks).to.be.an('object');
    expect(ds1500StartHooks).to.have.property('prerender').that.is.a('function');
    expect(ds1500StartHooks).to.have.property('preredirect').that.is.a('function');
  });

  describe('prerender', () => {
    it('should add previousPage session as ds1500-start', () => {
      const req = new Request();
      const res = new Response(req);
      const { prerender } = ds1500Start();

      prerender(req, res, () => {});

      expect(req.session).to.have.property('previousPage').that.equals('ds1500-start');
    });

    it('should call next', (done) => {
      const req = new Request();
      const res = new Response(req);
      const { prerender } = ds1500Start();

      prerender(req, res, done);
    });
  });

  describe('preredirect', () => {
    it('should set validSession session to true', () => {
      const req = new Request();
      const res = new Response(req);
      const { preredirect } = ds1500Start();

      preredirect(req, res, () => {});

      expect(req.session).to.have.property('validSession').that.equals(true);
    });

    it('should call next', (done) => {
      const req = new Request();
      const res = new Response(req);
      const { preredirect } = ds1500Start();

      preredirect(req, res, done);
    });
  });
});
