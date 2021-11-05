const chai = require('chai');
chai.use(require('sinon-chai'));

const { assert, expect } = chai;

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

  const casaApp = { router }
  it('should setup "get" route for ds1500-start', (done) => {
    res.render = (template) => {
      assert.equal(template, 'ds1500-start');
    };
    router.get = (path, callback) => {
      assert.equal(path, '/ds1500-start');
      callback(req, res);
      done();
    };
    route(casaApp);
  });

  it('should render ds1500-start page if validSession', (done) => {
    req.session.validSession = true
    res.render = (template) => {
      assert.equal(template, 'ds1500-start');
    };
    router.get = (path, callback) => {
      assert.equal(path, '/ds1500-start');
      callback(req, res);
      done();
    };
    route(casaApp);
  });

  it('should redirect to "session-timeout" page if validSession false', (done) => {
    req.session.validSession = false
    res.redirect = (path) => {
      assert.equal(path, '/session-timeout');
    };
    router.get = (path, callback) => {
      assert.equal(path, '/ds1500-start');
      callback(req, res);
      done();
    };
    route(casaApp);
  });

  it('should render ds1500-start page', (done) => {
    try {
      res.render = (path, options) => {
        assert.equal(path, 'ds1500-start');
        expect(options).to.have.property('sessionid');
        expect(options).to.have.property('appVersion');
        done();
      };
      router.get = () => {};
      router.post = (path, callback) => {
        assert.equal(path, '/ds1500-start');
        callback(req, res);
      };
      route(casaApp);
    } catch (e) {
      done(e);
    }
  });
});
