const sinon = require('sinon');
const chai = require('chai');
chai.use(require('sinon-chai'));

const rewire = require('rewire');
const { assert, expect } = chai;
const route = rewire('../../../routes/feedback');

describe('routes/feedback', () => {
  const res = {
    status: () => ({
      redirect: () => {},
      render: () => {}
    }),
    clearCookie: () => { },
    locals: {
      t: (k) => k
    }
  };

  const req = {
    session: {
      id: 1
    },
    query: {}
  };

  const router = {};

  it('should setup "get" route for feedback', (done) => {
    res.render = (template) => {
      assert.equal(template, 'feedback');
    };
    router.get = (path, csrfMiddleware, callback) => {
      assert.equal(path, '/feedback');
      callback(req, res);
      done();
    };
    route(router);
  });

  it('should set up a POST route for feedback and redirects to thankyou page', (done) => {
    const notifyService = sinon.stub().resolves();
    /* eslint-disable-next-line no-underscore-dangle */
    route.__set__('notifyService', notifyService);

    try {
      res.render = (path, options) => {
        assert.equal(path, 'thankyou');
        expect(options).to.have.property('sessionid');
        expect(options).to.have.property('appVersion');
        done();
      };
      router.get = () => { };
      router.post = (path, csrfMiddleware, callback) => {
        assert.equal(path, '/feedback');
        callback(req, res);
        done()
      };
      route(router);
    } catch (e) {
      done(e);
    }
  });

  it('should rerender feedback page if validation errors if rating is empty', (done) => {
    const notifyService = sinon.stub().rejects();
    /* eslint-disable-next-line no-underscore-dangle */
    route.__set__('notifyService', notifyService);

    res.render = {
      path: '/feedback',
      options: {
        formErrors: {
          errors: {
            rating: {
              summary: 'Select a satisfaction rating',
              message: 'Select a satisfaction rating',
              inline: 'Select a satisfaction rating'
            }
          }
        },
        formErrorsGovukArray: {
          errorList: [{
            text: 'Select a satisfaction rating',
            href: '#f-rating-error'
          }]
        }
      }
    };

    try {
      req.body = {
        rating: '',
        improvements: ''
      }
      res.render = (path, options) => {
        assert.equal(path, 'feedback');
        expect(options).to.have.property('formErrors');
        expect(options).to.have.property('formErrorsGovukArray');
        expect(options.formErrors).to.have.nested.property('errors.rating');
        expect(options.formErrorsGovukArray).to.have.nested.property('errorList[0].href', '#f-rating-error')
        done();
      };
      router.get = () => { };
      router.post = (path, csrfMiddleware, callback) => {
        assert.equal(path, '/feedback');
        callback(req, res);
        done()
      };
      route(router);
    } catch (e) {
      done(e);
    }
  });

  it('should rerender feedback page if validation errors if improvement characters are more than 1200', (done) => {
    const notifyService = sinon.stub().rejects();
    /* eslint-disable-next-line no-underscore-dangle */
    route.__set__('notifyService', notifyService);

    res.render = {
      path: '/feedback',
      options: {
        formErrors: {
          errors: {
            improvements: {
              summary: 'Enter improvement suggestions using 1200 characters or less',
              message: 'Enter improvement suggestions using 1200 characters or less',
              inline: 'Enter improvement suggestions using 1200 characters or less'
            }
          }
        },
        formErrorsGovukArray: {
          errorList: [{
            text: 'Enter improvement suggestions using 1200 characters or less',
            href: '#improvements-error'
          }]
        }
      }
    };

    try {
      req.body = {
        rating: 'Satisfied',
        improvements: 'a'.repeat(1250)
      }
      res.render = (path, options) => {
        assert.equal(path, 'feedback');
        expect(options).to.have.property('formErrors');
        expect(options).to.have.property('formErrorsGovukArray');
        expect(options.formErrors).to.have.nested.property('errors.improvements');
        expect(options.formErrorsGovukArray).to.have.nested.property('errorList[0].href', '#improvements-error')
        done();
      };
      router.get = () => { };
      router.post = (path, csrfMiddleware, callback) => {
        assert.equal(path, '/feedback');
        callback(req, res);
        done()
      };
      route(router);
    } catch (e) {
      done(e);
    }
  });

  it('should redirect to feedback-sent page if rating is provided and improvements are empty', (done) => {
    const notifyService = sinon.stub().resolves();
    /* eslint-disable-next-line no-underscore-dangle */
    route.__set__('notifyService', notifyService);

    try {
      req.body = {
        rating: 'Satisfied',
        improvements: ''
      }
      res.redirect = (path, options) => {
        assert.equal(path, '/feedback-sent');
        expect(options).to.have.property('sessionid');
        done()
      };
      router.get = () => { };
      router.post = (path, csrfMiddleware, callback) => {
        assert.equal(path, '/feedback');
        callback(req, res);
        done()
      };
      route(router);
    } catch (e) {
      done(e);
    }
  });

  it('should set up a POST route for feedback and redirects to feedback-sent page if feedback-sent url is whitelisted', (done) => {
    const notifyService = sinon.stub().resolves();
    /* eslint-disable-next-line no-underscore-dangle */
    route.__set__('notifyService', notifyService);

    const whiteListValidateRedirect = sinon.stub()
    whiteListValidateRedirect.returns('feedback-sent');

    /* eslint-disable-next-line no-underscore-dangle */
    route.__set__('whiteListValidateRedirect', whiteListValidateRedirect);
    try {
      req.body = {
        rating: 'Satisfied',
        improvements: ''
      }
      res.render = (path, options) => {
        assert.equal(path, 'feedback-sent');
        expect(options).to.have.property('sessionid');
        expect(options).to.have.property('appVersion');
        done();
      };
      router.get = () => { };
      router.post = (path, csrfMiddleware, callback) => {
        assert.equal(path, '/feedback');
        callback(req, res);
        done()
      };
      route(router);
    } catch (e) {
      done(e);
    }
  });

  it('should render the errors/500.njk page if feedback-sent url is not whitelisted', (done) => {
    const notifyService = sinon.stub().rejects();
    /* eslint-disable-next-line no-underscore-dangle */
    route.__set__('notifyService', notifyService);

    const whiteListValidateRedirect = sinon.stub()
    whiteListValidateRedirect.returns('notlisted');

    /* eslint-disable-next-line no-underscore-dangle */
    route.__set__('whiteListValidateRedirect', whiteListValidateRedirect);
    req.body = {
      rating: 'Satisfied',
      improvements: 'need some improvements'
    }
    try {
      router.get = () => { };
      res.status = () => ({
        render: (template) => {
          assert.equal(template, 'casa/errors/500');
          done();
        }
      });
      router.post = (path, csrfMiddleware, callback) => {
        assert.equal(path, '/feedback');
        callback(req, res);
      };
      route(router);
    } catch (e) {
      done(e);
    }
  });

  it('should render the errors/500.njk page if it catches a notify error', (done) => {
    const notifyService = sinon.stub().rejects();
    /* eslint-disable-next-line no-underscore-dangle */
    route.__set__('notifyService', notifyService);

    try {
      req.body = {
        rating: 'Satisfied',
        improvements: 'need some improvements'
      }
      router.get = () => { };
      res.status = () => ({
        render: (template) => {
          assert.equal(template, 'casa/errors/500');
          done();
        }
      });
      router.post = (path, csrfMiddleware, callback) => {
        assert.equal(path, '/feedback');
        callback(req, res);
      };
      route(router);
    } catch (e) {
      done(e);
    }
  });
});
