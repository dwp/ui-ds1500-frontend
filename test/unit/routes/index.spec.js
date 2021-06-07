const chai = require('chai');
chai.use(require('sinon-chai'));

const { assert } = chai;

const route = require('../../../routes/index');

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

  it('should redirect to ds1500-start page', (done) => {
    try {
      res.status.redirect = (path) => {
        assert.equal(path, '/ds1500-start');
      }
      router.get = () => {};
      route(casaApp);
      done()
    } catch (e) {
      done(e);
    }
  });
});
