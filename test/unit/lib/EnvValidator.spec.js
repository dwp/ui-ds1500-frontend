const chai = require('chai');
const expect = chai.expect;

const EnvValidators = require('../../../lib/EnvValidator');

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

describe('EnvValidators', function () {
  // set test mode
  process.env.NODE_ENV = 'test';

  it('should be a function', function () {
    expect(EnvValidators).to.be.an.instanceOf(Function);
  });

  it('should return an error if no "SERVER_PORT"', function () {
    expect(EnvValidators.bind(EnvValidators, { ...defaultEnv, SERVER_PORT: undefined })).to.throw('SERVER_PORT is missing');
  });

  it('should return an error if "SERVER_PORT" is string', function () {
    expect(EnvValidators.bind(EnvValidators, { ...defaultEnv, SERVER_PORT: 'abc' })).to.throw('SERVER_PORT must be a positive integer');
  });

  it('should return an error if no "DS1500_CONTROLLER_URL"', function () {
    expect(EnvValidators.bind(EnvValidators, { ...defaultEnv, DS1500_CONTROLLER_URL: '' })).to.throw('DS1500_CONTROLLER_URL is missing');
  });

  it('should return an error if "DS1500_CONTROLLER_URL" is not a string', function () {
    expect(EnvValidators.bind(EnvValidators, { ...defaultEnv, DS1500_CONTROLLER_URL: 123 })).to.throw('DS1500_CONTROLLER_URL must be a string');
  });

  it('should return an error if no "NOTIFY_EMAILTO"', function () {
    expect(EnvValidators.bind(EnvValidators, { ...defaultEnv, NOTIFY_EMAILTO: undefined })).to.throw('NOTIFY_EMAILTO is missing');
  });

  it('should return an error if "NOTIFY_EMAILTO" is not a string', function () {
    expect(EnvValidators.bind(EnvValidators, { ...defaultEnv, NOTIFY_EMAILTO: 123 })).to.throw('NOTIFY_EMAILTO must be a string');
  });

  it('should return an error if no "NOTIFY_APIKEY"', function () {
    expect(EnvValidators.bind(EnvValidators, { ...defaultEnv, NOTIFY_APIKEY: undefined })).to.throw('NOTIFY_APIKEY is missing');
  });

  it('should return an error if "NOTIFY_APIKEY" is not a string', function () {
    expect(EnvValidators.bind(EnvValidators, { ...defaultEnv, NOTIFY_APIKEY: 123 })).to.throw('NOTIFY_APIKEY must be a string');
  });

  it('should return an error if no "NOTIFY_PROXY_HOST"', function () {
    expect(EnvValidators.bind(EnvValidators, { ...defaultEnv, NOTIFY_PROXY_HOST: undefined })).to.throw('NOTIFY_PROXY_HOST is missing');
  });

  it('should return an error if "NOTIFY_PROXY_HOST" is not a string', function () {
    expect(EnvValidators.bind(EnvValidators, { ...defaultEnv, NOTIFY_PROXY_HOST: 123 })).to.throw('NOTIFY_PROXY_HOST must be a string');
  });

  it('should return an error if no "NOTIFY_PROXY_PORT"', function () {
    expect(EnvValidators.bind(EnvValidators, { ...defaultEnv, NOTIFY_PROXY_PORT: undefined })).to.throw('NOTIFY_PROXY_PORT is missing');
  });

  it('should return an error if "NOTIFY_PROXY_PORT" is string', function () {
    expect(EnvValidators.bind(EnvValidators, { ...defaultEnv, NOTIFY_PROXY_PORT: 'abc' })).to.throw('NOTIFY_PROXY_PORT must be a positive integer');
  });

  it('should return an error if no "SESSIONS_SECRET"', function () {
    expect(EnvValidators.bind(EnvValidators, { ...defaultEnv, SESSIONS_SECRET: undefined })).to.throw('SESSIONS_SECRET is missing');
  });

  it('should return an error if "SESSIONS_SECRET" is not a string', function () {
    expect(EnvValidators.bind(EnvValidators, { ...defaultEnv, SESSIONS_SECRET: 123 })).to.throw('SESSIONS_SECRET must be a string');
  });

  it('should return an error if no "SESSIONS_TTL"', function () {
    expect(EnvValidators.bind(EnvValidators, { ...defaultEnv, SESSIONS_TTL: undefined })).to.throw('SESSIONS_TTL is missing');
  });

  it('should return an error if "SESSIONS_TTL" is not a positive integer', function () {
    expect(EnvValidators.bind(EnvValidators, { ...defaultEnv, SESSIONS_TTL: -1 })).to.throw('SESSIONS_TTL must be a positive integer');
  });
});
