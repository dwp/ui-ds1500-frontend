const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const ds1500Range = require('../../../../lib/validation-rules/ds1500Range');

describe('Validation rule: ds1500Range', function () {
  const r1 = ds1500Range.bind({
    min: 1890,
    max: 2018
  })

  it('should exist', function () {
      expect(ds1500Range).to.exist; // eslint-disable-line
  });

  it('should resolve values within range', function () {
    const queue = [];
    queue.push(expect(r1('2017')).to.be.fulfilled);
    queue.push(expect(r1('1890')).to.be.fulfilled);
    queue.push(expect(r1('2018')).to.be.fulfilled);
    return Promise.all(queue);
  });

  it('should reject values outside of range', function () {
    const queue = [];
    queue.push(expect(r1('1889')).to.be.rejected);
    queue.push(expect(r1('1747')).to.be.rejected);
    queue.push(expect(r1('2019')).to.be.rejected);
    queue.push(expect(r1('3020')).to.be.rejected);
    return Promise.all(queue);
  });
});
