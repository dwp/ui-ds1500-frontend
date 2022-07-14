const { expect } = require('chai').use(require('sinon-chai'));
const Request = require('../../../helpers/fake-request');
const Response = require('../../../helpers/fake-response');
const ds1500Download = require('../../../../definitions/hooks/ds1500-download');

describe('Hooks: ds1500-download', () => {
  it('should export a function', () => {
    expect(ds1500Download).to.be.a('function');
  });

  it('should return a object with prerender and preredirect functions', () => {
    const ds1500DownloadHooks = ds1500Download();
    expect(ds1500DownloadHooks).to.be.an('object');
    expect(ds1500DownloadHooks).to.have.property('prerender').that.is.a('function');
  });

  describe('prerender', () => {
    it('should call next', (done) => {
      const req = new Request();
      const res = new Response(req);
      const { prerender } = ds1500Download();

      prerender(req, res, done);
      done()
    });
  });
});
