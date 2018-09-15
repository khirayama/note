import { IQuery, queryString } from 'router/queryString';

describe('queryString', () => {
  describe('parse', () => {
    it('', () => {
      const actual: IQuery = queryString.parse('');
      expect({}).toEqual(actual);
    });

    it('?', () => {
      const actual: IQuery = queryString.parse('?');
      expect({}).toEqual(actual);
    });

    it('#', () => {
      const actual: IQuery = queryString.parse('#');
      expect({}).toEqual(actual);
    });

    it('?q=someid', () => {
      const actual: IQuery = queryString.parse('?q=someid');
      expect({
        q: 'someid',
      }).toEqual(actual);
    });

    it('#q=someid', () => {
      const actual: IQuery = queryString.parse('?q=someid');
      expect({
        q: 'someid',
      }).toEqual(actual);
    });

    it('q=someid', () => {
      const actual: IQuery = queryString.parse('?q=someid');
      expect({
        q: 'someid',
      }).toEqual(actual);
    });

    it('q=someid&q2=someid2', () => {
      const actual: IQuery = queryString.parse('?q=someid&q2=someid2');
      expect({
        q: 'someid',
        q2: 'someid2',
      }).toEqual(actual);
    });

    it('bool=true&num=0', () => {
      const actual: IQuery = queryString.parse('bool=true&num=0');
      expect({
        bool: true,
        num: 0,
      }).toEqual(actual);
    });
  });
  describe('stringify', () => {
    it('{q: "someid"}', () => {
      const actual: string = queryString.stringify({ q: 'someid' });
      expect('q=someid').toEqual(actual);
    });

    it('{q: "someid", q2: "someid2"}', () => {
      const actual: string = queryString.stringify({ q: 'someid', q2: 'someid2' });
      expect('q=someid&q2=someid2').toEqual(actual);
    });

    it('{bool: true, num: 0}', () => {
      const actual: string = queryString.stringify({ bool: true, num: 0 });
      expect('bool=true&num=0').toEqual(actual);
    });

    it('{num: 0, bool: true}', () => {
      const actual: string = queryString.stringify({ num: 0, bool: true });
      expect('num=0&bool=true').toEqual(actual);
    });
  });
});
