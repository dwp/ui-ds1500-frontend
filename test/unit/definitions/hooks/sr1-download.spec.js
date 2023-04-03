const { expect } = require('chai').use(require('sinon-chai'));
const Request = require('../../../helpers/fake-request');
const Response = require('../../../helpers/fake-response');
const sr1Download = require('../../../../definitions/hooks/sr1-download');

describe('Hooks: sr1-download', () => {
  it('should export a function', () => {
    expect(sr1Download).to.be.a('function');
  });

  it('should return a object with prerender and preredirect functions', () => {
    const sr1DownloadHooks = sr1Download();
    expect(sr1DownloadHooks).to.be.an('object');
    expect(sr1DownloadHooks).to.have.property('prerender').that.is.a('function');
  });

  describe('prerender', () => {
    it('should call next', (done) => {
      const req = new Request();
      const res = new Response(req);
      const { prerender } = sr1Download();

      prerender(req, res, done);
      done()
    });
  });
});
