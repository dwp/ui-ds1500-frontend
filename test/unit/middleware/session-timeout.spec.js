const { expect } = require('chai');
const Request = require('../../helpers/fake-request.js');
const Response = require('../../helpers/fake-response.js');
const sessionTimeout = require('../../../middleware/session-timeout.js');

const app = {
  prependUse (path, mw) {
    this.path = path;
    this.mw = mw;
  }
};

const waypoints = {
  SESSION_KEEP_ALIVE: 'session-keep-alive',
  SESSION_TIMEOUT: 'session-timeout',
  SESSION_ENDED: 'session-ended'
}

describe('Middleware: session-timeout', () => {
  it('should add a middleware function', () => {
    sessionTimeout(app, '/');
    expect(app.mw).to.be.an.instanceOf(Function);
  });

  it('should set routing path', () => {
    sessionTimeout(app, '/', '/');
    expect(app.path).to.equal('/');
  });

  it('should add timeoutDialog object to res.locals', () => {
    const req = new Request();
    const res = new Response(req);
    sessionTimeout(app, '/', '/', waypoints);

    app.mw(req, res, () => { });
    expect(res.locals.timeoutDialog).to.be.an('object');
  });

  it('should add keepAliveUrl to timeoutDialog', () => {
    const req = new Request();
    const res = new Response(req);
    sessionTimeout(app, '/', '/', { SESSION_KEEP_ALIVE: 'keep-alive' });

    app.mw(req, res, () => { });
    expect(res.locals.timeoutDialog).to.have.property('keepAliveUrl').that.equals('/keep-alive');
  });

  it('should add signOutUrl to timeoutDialog', () => {
    const req = new Request();
    const res = new Response(req);
    sessionTimeout(app, '/', '/', waypoints);

    app.mw(req, res, () => { });
    expect(res.locals.timeoutDialog).to.have.property('signOutUrl').that.equals('/session-ended');
  });

  it('should add timeoutUrl of current path to timeoutDialog', () => {
    const req = new Request();
    const res = new Response(req);
    sessionTimeout(app, '/', '/', waypoints);

    app.mw(req, res, () => { });
    expect(res.locals.timeoutDialog).to.have.property('timeoutUrl').that.equals('/session-timeout');
  });

  it('should add timeoutUrl of current path to timeoutDialog including current querystring', () => {
    const req = new Request();
    const res = new Response(req);
    sessionTimeout(app, '/', '/', waypoints);

    app.mw(req, res, () => { });
    expect(res.locals.timeoutDialog).to.have.property('timeoutUrl').that.equals('/session-timeout');
  });

  it('should add countdown to timeoutDialog (SESSION_TTL - TIMEOUT_DIALOG_COUNTDOWN)', () => {
    const req = new Request();
    const res = new Response(req);
    sessionTimeout(app, '/', '/', waypoints, 1800, 1500);

    app.mw(req, res, () => { });
    expect(res.locals.timeoutDialog).to.have.property('countdown').that.equals(300);
  });

  it('should add timeout to timeoutDialog', () => {
    const req = new Request();
    const res = new Response(req);
    sessionTimeout(app, '/', '/', waypoints, 1800, 1500);

    app.mw(req, res, () => { });
    expect(res.locals.timeoutDialog).to.have.property('timeout').that.equals(1800);
  });
});
