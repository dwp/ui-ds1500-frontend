const { assert, expect } = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');

const feedback = rewire('../../../routes/feedback.js');

describe('Feedback routes', () => {
  const res = {
    status: () => ({
      render: () => {}
    }),
    clearCookie: () => {}
  };
  const router = {};
  const config = { mountUrl: '/' }
  const casaApp = { router, config }
  const req = {
    session: {
      id: 1
    }
  };
  it('should set up a GET route and render the feedback page', (done) => {
    const notifyService = sinon.stub().resolves();
    /* eslint-disable-next-line no-underscore-dangle */
    const resetNotifyService = feedback.__set__('notifyService', notifyService);
    res.render = (template) => {
      assert.equal(template, 'feedback');
      resetNotifyService();
      done();
    };
    router.get = (path, csrfMiddleware, callback) => {
      assert.equal(path, '/feedback');
      callback(req, res);
    };
    router.post = () => {};
    feedback(casaApp);
  });
  it('should set up a POST route and redirect to thankyou page', (done) => {
    const formIsValid = sinon.stub().resolves()
    /* eslint-disable-next-line no-underscore-dangle */
    const resetValidation = feedback.__set__('formIsValid', formIsValid);
    const notifyService = sinon.stub().resolves();
    /* eslint-disable-next-line no-underscore-dangle */
    const resetNotifyService = feedback.__set__('notifyService', notifyService);
    try {
      res.redirect = (path) => {
        assert.equal(path, '/thankyou');
        resetValidation();
        resetNotifyService();
        done();
      };
      router.get = () => {};
      router.post = (path, csrfMiddleware, callback) => {
        assert.equal(path, '/feedback');
        callback(req, res);
      };
      feedback(casaApp);
    } catch (e) {
      resetValidation();
      resetNotifyService();
      done(e);
    }
  });
  it('should rerender feedback page if validation errors', (done) => {
    const notifyService = sinon.stub().rejects();
    /* eslint-disable-next-line no-underscore-dangle */
    const resetNotifyService = feedback.__set__('notifyService', notifyService);
    res.render = {
      path: '/feedback',
      options: {
        sessionid: 'id',
        appVersion: 1,
        formData: {},
        formErrors: {}
      }
    };
    try {
      res.render = (path, options) => {
        assert.equal(path, 'feedback');
        expect(options).to.have.property('sessionid');
        expect(options).to.have.property('appVersion');
        expect(options).to.have.property('formData');
        expect(options).to.have.property('formErrors');
        resetNotifyService();
        done();
      };
      router.get = () => {};
      router.post = (path, csrfMiddleware, callback) => {
        assert.equal(path, '/feedback');
        callback(req, res);
      };
      feedback(casaApp);
    } catch (e) {
      resetNotifyService();
      done(e);
    }
  });
  it('should render the errors/500.njk page if it catches a notify error', (done) => {
    const formIsValid = sinon.stub().resolves()

    /* eslint-disable-next-line no-underscore-dangle */
    const resetValidation = feedback.__set__('formIsValid', formIsValid);
    const notifyService = sinon.stub().rejects();
    /* eslint-disable-next-line no-underscore-dangle */
    const resetNotifyService = feedback.__set__('notifyService', notifyService);
    try {
      router.get = () => {};
      res.status = () => ({
        render: (template) => {
          assert.equal(template, 'casa/errors/500');
          resetValidation();
          resetNotifyService();
          done();
        }
      });
      router.post = (path, csrfMiddleware, callback) => {
        assert.equal(path, '/feedback');
        callback(req, res);
      };
      feedback(casaApp);
    } catch (e) {
      resetValidation();
      resetNotifyService();
      done(e);
    }
  });
});
