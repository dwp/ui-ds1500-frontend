const sinon = require('sinon');
const chai = require('chai');
chai.use(require('sinon-chai'));

const { expect } = chai;

const route = require('../../../../routes/actuator/health');

describe('actuator/health', () => {
  it('should set status to 200', () => {
    const mockRes = {
      status: sinon.stub().returns({ json: sinon.stub() })
    };

    route(null, mockRes);

    expect(mockRes.status).to.be.calledOnceWith(200);
  });

  it('should return JSON', () => {
    const jsonStub = sinon.stub();

    const mockRes = {
      status: sinon.stub().returns({ json: jsonStub })
    };

    route(null, mockRes);

    expect(jsonStub).to.be.calledOnceWith({
      status: 'UP'
    });
  });
});
