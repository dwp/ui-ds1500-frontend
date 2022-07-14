const { expect } = require('chai').use(require('sinon-chai'));
const Request = require('../../../helpers/fake-request');
const Response = require('../../../helpers/fake-response');

const defaultEnv = {
  SERVER_PORT: 3000,
  DS1500_CONTROLLER_URL: 'http://example.com',
  NOTIFY_EMAILTO: 'notify@dwp.com',
  NOTIFY_APIKEY: '12exampleAbc',
  NOTIFY_PROXY_HOST: 'test',
  NOTIFY_PROXY_PORT: 5000,
  SESSIONS_SECRET: 'secret',
  SESSIONS_TTL: 10,
  REDIS_PORT: 8080,
  REDIS_HOST: 'test'
}
process.env = { ...process.env, ...defaultEnv }
describe('Hooks: review', () => {
  let review
  beforeEach(() => {
    Object.assign(defaultEnv, process.env);
    process.env = { ...process.env, ...defaultEnv }
    review = require('../../../../definitions/hooks/review');
  });

  it('should export a function', () => {
    expect(review).to.be.a('function');
  });

  it('should return a object with prerender and preredirect functions', () => {
    const reviewHooks = review();
    expect(reviewHooks).to.be.an('object');
    expect(reviewHooks).to.have.property('prerender').that.is.a('function');
    expect(reviewHooks).to.have.property('postvalidate').that.is.a('function');
  });

  describe('prerender', () => {
    it('should add journey data to res.locals', () => {
      const req = new Request({
        ds1500: {
          patientName: 'test',
          patientAddress: 'test',
          patientDateOfBirth: { dd: '1', mm: '1', yyyy: '2001' },
          dateOfDiagnosis: { dd: '1', mm: '1', yyyy: '2011' }
        }
      });

      const res = new Response(req);
      const { prerender } = review();

      prerender(req, res, () => {});
      expect(res.locals.jData).to.eql({
        patientName: 'test',
        patientAddress: 'test',
        patientDateOfBirth: { dd: '1', mm: '1', yyyy: '2001' },
        dateOfDiagnosis: { dd: '1', mm: '1', yyyy: '2011' }
      });
    });

    it('should call next', (done) => {
      const req = new Request({
        ds1500: {
          patientName: 'test',
          patientAddress: 'test',
          patientDateOfBirth: { dd: '1', mm: '1', yyyy: '2001' },
          dateOfDiagnosis: { dd: '1', mm: '1', yyyy: '2011' }
        }
      });
      const res = new Response(req);
      const { prerender } = review();

      prerender(req, res, done);
    });
  });

  describe('postvalidate', () => {
    it('should submit the application', (done) => {
      const req = new Request({
        ds1500: {
          patientName: 'test',
          patientAddress: 'test',
          patientDateOfBirth: { dd: '1', mm: '1', yyyy: '2001' },
          dateOfDiagnosis: { dd: '1', mm: '1', yyyy: '2011' }
        }
      });
      const res = new Response(req);
      const { postvalidate } = review();

      postvalidate(req, res, done);
      done()
    });
  });
});
