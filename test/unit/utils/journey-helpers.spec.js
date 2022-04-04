const { expect } = require('chai');
const { JourneyContext } = require('@dwp/govuk-casa');
const journeyHelpers = require('../../../utils/journey-helpers');

describe('Utils: journey-helpers', () => {
  describe('data', () => {
    it('should be a function', () => {
      expect(journeyHelpers.data).to.instanceOf(Function);
    });

    it('should return data for a given waypoint', () => {
      const data = { data: 'test' };
      const context = new JourneyContext({ page: data });
      const pageData = journeyHelpers.data({}, context, 'page');
      expect(pageData).to.deep.equal(data);
    });

    it('should return a null prototype object if the waypoint has no data', () => {
      const context = new JourneyContext({});
      const pageData = journeyHelpers.data({}, context, 'page');
      expect(pageData).to.deep.equal(Object.create(null));
      expect(Object.getPrototypeOf(pageData)).to.equal(null);
    });

    it('should default waypoint to route source', () => {
      const data = { data: 'test' };
      const context = new JourneyContext({ page: data });
      const pageData = journeyHelpers.data({ source: 'page' }, context);
      expect(pageData).to.deep.equal(data);
    });
  });

  describe('isEqualTo', () => {
    it('should be a function', () => {
      expect(journeyHelpers.isEqualTo).to.instanceOf(Function);
    });

    it('should return a routing function', () => {
      expect(journeyHelpers.isEqualTo()).to.instanceOf(Function);
    });

    it('should return a function that returns true when a given field matches a value on a waypoint', () => {
      const context = new JourneyContext({ waypoint: { field: 'value' } });
      const test = journeyHelpers.isEqualTo('field', 'value', 'waypoint');
      expect(test({}, context)).to.deep.equal(true);
    });

    it('should return a function that returns false when a given field does not match a value on a waypoint', () => {
      const context = new JourneyContext({ waypoint: { field: 'value' } });
      const test = journeyHelpers.isEqualTo('field', 'wrong', 'waypoint');
      expect(test({}, context)).to.deep.equal(false);
    });

    it('should return a function that matches against source waypoint by default', () => {
      const context = new JourneyContext({ waypoint: { field: 'value' } });
      const test = journeyHelpers.isEqualTo('field', 'value');
      expect(test({ source: 'waypoint' }, context)).to.deep.equal(true);
    });
  });
});
