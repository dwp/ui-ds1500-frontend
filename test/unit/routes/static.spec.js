const chai = require('chai');
chai.use(require('sinon-chai'));

const { assert } = chai;

const route = require('../../../routes/static');

describe('routes/static', () => {
  const res = {
    status: () => ({
      render: () => {}
    }),
    clearCookie: () => {}
  };

  const req = {
    session: {
      id: 1
    },
    query: {}
  };

  const router = {};

  it('should setup "get" route for any static routes (cookies)', (done) => {
    res.render = (template) => {
      assert.equal(template, 'cookies');
    };
    router.get = (path, csrfMiddleware, callback) => {
      assert.equal(path, '/cookies');
      callback(req, res);
      done();
    };
    route(router);
  });

  it('should render cookies page', (done) => {
    try {
      res.render = (path, options) => {
        assert.equal(path, 'cookies');
        done();
      };
      router.get = () => {};
      router.post = (path, callback) => {
        assert.equal(path, '/cookies');
        callback(req, res);
      };
      route(router);
      done()
    } catch (e) {
      done(e);
    }
  });
});
