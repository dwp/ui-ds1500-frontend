const chai = require('chai');
chai.use(require('sinon-chai'));

const { assert } = chai;

const route = require('../../../routes/confirmation');

describe('routes/confirmation', () => {
  const makeResponse = () => {
    return {
      status: () => ({
      }),
      clearCookie: () => {}
    };
  }

  const makeRequest = (sessionAttrs = {}, attrs = {}) => {
    const req = {
      session: {
        ...sessionAttrs,
        cookie: true,
        id: 1,
        downloadContext: {
          transactionID: 'a12c'
        }
      },
      ...attrs
    };
    Object.defineProperty(req.session, 'save', {
      enumerable: false,
      configurable: true,
      value: (cb) => cb()
    });

    Object.defineProperty(req.session, 'regenerate', {
      enumerable: false,
      configurable: true,
      value: (cb) => cb()
    });
    return req;
  }

  const router = {};

  it('should setup "get" route for confirmation', (done) => {
    const req = makeRequest();
    const res = makeResponse()
    res.status = () => ({
      render: () => {}
    });
    router.get = (path, callback) => {
      assert.equal(path, '/confirmation');
      callback(req, res);
      done();
    };
    route(router);
  });

  it('should render the errors/500.njk page if it catches a session error', (done) => {
    const req = makeRequest();
    const res = makeResponse()
    res.status = () => ({
      render: (template) => {
        assert.equal(template, 'casa/errors/500');
      }
    });
    router.get = (path, callback) => {
      assert.equal(path, '/confirmation');
      callback(req, res);
      done();
    };
    route(router);
  });
});
