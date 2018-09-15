import * as assert from 'power-assert';

import { IQuery, queryString } from 'router/queryString';

describe('queryString', () => {
  describe('parse', () => {
    it('?q=someid', () => {
      const actual: IQuery = queryString.parse('?q=someid');
      assert.deepEqual(actual, {
        q: 'someid',
      });
    });

    it('#q=someid', () => {
      const actual: IQuery = queryString.parse('?q=someid');
      assert.deepEqual(actual, {
        q: 'someid',
      });
    });

    it('q=someid', () => {
      const actual: IQuery = queryString.parse('?q=someid');
      assert.deepEqual(actual, {
        q: 'someid',
      });
    });

    it('q=someid&q2=someid2', () => {
      const actual: IQuery = queryString.parse('?q=someid&q2=someid2');
      assert.deepEqual(actual, {
        q: 'someid',
        q2: 'someid2',
      });
    });

    it('bool=true&num=0', () => {
      const actual: IQuery = queryString.parse('bool=true&num=0');
      assert.deepEqual(actual, {
        bool: true,
        num: 0,
      });
    });
  });
  describe('stringify', () => {
    it('{q: "someid"}', () => {
      const actual: string = queryString.stringify({q: 'someid'});
      assert.equal(actual, 'q=someid');
    });

    it('{q: "someid", q2: "someid2"}', () => {
      const actual: string = queryString.stringify({q: 'someid', q2: 'someid2'});
      assert.equal(actual, 'q=someid&q2=someid2');
    });

    it('{bool: true, num: 0}', () => {
      const actual: string = queryString.stringify({bool: true, num: 0});
      assert.deepEqual(actual, 'bool=true&num=0');
    });

    it('{num: 0, bool: true}', () => {
      const actual: string = queryString.stringify({num: 0, bool: true});
      assert.deepEqual(actual, 'num=0&bool=true');
    });
  });
});
