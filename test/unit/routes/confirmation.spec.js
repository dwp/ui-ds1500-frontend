const chai = require('chai');
chai.use(require('sinon-chai'));

const { assert } = chai;

const route = require('../../../routes/confirmation');

describe('routes/confirmation', () => {
  const res = {
    status: () => ({
      render: () => { }
    }),
    clearCookie: () => { }
  };

  const req = {
    session: {
      id: 1,
      downloadContext: {
        transactionID: 'a12c'
      }
    },
    query: {}
  };

  const router = {};
  const endSession = () => Promise.resolve()
  const casaApp = {
    router,
    endSession
  }

  it('should setup "get" route for confirmation', (done) => {
    res.render = (template) => {
      assert.equal(template, 'confirmation');
    };
    router.get = (path, callback) => {
      assert.equal(path, '/confirmation');
      callback(req, res);
      done();
    };
    route(casaApp);
  });

  it('should render the errors/500.njk page if it catches a session error', (done) => {
    // eslint-disable-next-line prefer-promise-reject-errors
    casaApp.endSession = () => Promise.reject()
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
    route(casaApp);
  });
});
