const sinon = require('sinon');
const chai = require('chai');
chai.use(require('sinon-chai'));

const rewire = require('rewire');
const { assert } = chai;
const route = rewire('../../../routes/index');

describe('routes/index', () => {
  const res = {
    status: () => ({
      render: () => {},
      redirect: () => {}
    }),
    clearCookie: () => {}
  };

  const req = {
    session: {
      id: 1
    }
  };

  const router = {};
  const config = {
    mountUrl: '/'
  }
  const casaApp = { router, config }

  it('should setup get route', (done) => {
    req.query = {}
    res.render = (template) => {
      assert.equal(template, '/ds1500-start');
      done();
    };
    router.get = (path, callback) => {
      assert.equal(path, '/');
      callback(req, res);
      done();
    };
    route(casaApp);
  });

  it('should render the errors/500.njk page if it catches a error', (done) => {
    req.query = {}
    const whiteListValidateRedirect = sinon.stub().returns(false);
    /* eslint-disable-next-line no-underscore-dangle */
    route.__set__('whiteListValidateRedirect', whiteListValidateRedirect);
    res.status = () => ({
      render: (template) => {
        assert.equal(template, 'casa/errors/500');
      }
    });
    router.get = (path, callback) => {
      assert.equal(path, '/');
      callback(req, res);
      done();
    };
    route(casaApp);
  });

  it('should setup get route and clear session if it has "ref" property', (done) => {
    casaApp.endSession = () => Promise.resolve()
    req.query = {
      ref: 'sign-out'
    }
    res.render = (template) => {
      assert.equal(template, 'ds1500-start');
      done();
    };
    router.get = (path, callback) => {
      assert.equal(path, '/');
      callback(req, res);
      done();
    };
    route(casaApp);
  });

  it('should render the /ds1500-start page if it catches a session error', (done) => {
    // eslint-disable-next-line prefer-promise-reject-errors
    casaApp.endSession = () => Promise.reject()
    res.status = () => ({
      render: (template) => {
        assert.equal(template, 'ds1500-start');
      }
    });
    router.get = (path, callback) => {
      assert.equal(path, '/');
      callback(req, res);
      done();
    };
    route(casaApp);
  });
});
