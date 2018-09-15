import * as assert from 'power-assert';

import { exec, IRoute, IToken, parse, pathToRegexp, Router, tokensToRegexp } from 'router/Router';

const routes: IRoute[] = [];

describe('parse', () => {
  it('/path', () => {
    const actual: (IToken | string)[] = parse('/path');
    assert.equal(actual, '/path');
  });

  it('/path/:id', () => {
    const actual: (IToken | string)[] = parse('/path/:id');
    assert.deepEqual(actual, [
      '/path',
      {
        name: 'id',
        pattern: '[^/]+?',
      },
    ]);
  });

  it('/path/:id/to/:id', () => {
    const actual: (IToken | string)[] = parse('/path/:id/to/:id');
    assert.deepEqual(actual, [
      '/path',
      {
        name: 'id',
        pattern: '[^/]+?',
      },
      '/to',
      {
        name: 'id',
        pattern: '[^/]+?',
      },
    ]);
  });
});

describe('tokensToRegexp', () => {
  it('/path', () => {
    const tokens: (IToken | string)[] = parse('/path');
    const actual: RegExp = tokensToRegexp(tokens);
    assert.deepEqual(actual, /^\/path(?:\/(?=$))?$/i);
  });

  it('/path/:id', () => {
    const tokens: (IToken | string)[] = parse('/path/:id');
    const actual: RegExp = tokensToRegexp(tokens);
    assert.deepEqual(actual, /^\/path\/([^\/]+?)(?:\/(?=$))?$/i);
  });

  it('/path/:id/to/:id', () => {
    const tokens: (IToken | string)[] = parse('/path/:id/to/:id');
    const actual: RegExp = tokensToRegexp(tokens);
    assert.deepEqual(actual, /^\/path\/([^\/]+?)\/to\/([^\/]+?)(?:\/(?=$))?$/i);
  });
});

describe('pathToRegexp', () => {
  it('/path', () => {
    const { regexp, keys } = pathToRegexp('/path');
    assert.deepEqual(regexp, /^\/path(?:\/(?=$))?$/i);
    assert.deepEqual(keys, []);
  });

  it('/path/:id', () => {
    const { regexp, keys } = pathToRegexp('/path/:id');
    assert.deepEqual(regexp, /^\/path\/([^\/]+?)(?:\/(?=$))?$/i);
    assert.deepEqual(keys, [{ name: 'id', pattern: '[^/]+?' }]);
  });

  it('/path/:id/to/:id', () => {
    const { regexp, keys } = pathToRegexp('/path/:id/to/:id');
    assert.deepEqual(regexp, /^\/path\/([^\/]+?)\/to\/([^\/]+?)(?:\/(?=$))?$/i);
    assert.deepEqual(keys, [{ name: 'id', pattern: '[^/]+?' }, { name: 'id', pattern: '[^/]+?' }]);
  });
});

describe('exec', () => {
  it('route:/path and path:/path', () => {
    const { regexp, keys } = pathToRegexp('/path');
    const { matches, params } = exec(regexp, keys, '/path');
    // tslint:disable-next-line:no-any
    const expected: any = ['/path'];
    expected.index = 0;
    expected.input = '/path';
    assert.deepEqual(matches, expected);
    assert.deepEqual(params, {});
  });

  it('route:/path and path:/paths', () => {
    const { regexp, keys } = pathToRegexp('/path');
    const { matches, params } = exec(regexp, keys, '/paths');
    assert.deepEqual(matches, null);
    assert.deepEqual(params, {});
  });

  it('route:/path/:id and path:/path/1', () => {
    const { regexp, keys } = pathToRegexp('/path/:id');
    const { matches, params } = exec(regexp, keys, '/path/1');
    // tslint:disable-next-line:no-any
    const expected: any = ['/path/1', '1'];
    expected.index = 0;
    expected.input = '/path/1';
    assert.deepEqual(matches, expected);
    assert.deepEqual(params, { id: 1 });
  });

  it('route:/path/:id and path:/paths/1', () => {
    const { regexp, keys } = pathToRegexp('/path/:id');
    const { matches, params } = exec(regexp, keys, '/paths/1');
    assert.deepEqual(matches, null);
    assert.deepEqual(params, {});
  });

  it('route:/path/:id/to/:id and path:/path/1/to/2', () => {
    const { regexp, keys } = pathToRegexp('/path/:id/to/:id');
    const { matches, params } = exec(regexp, keys, '/path/1/to/2');
    // tslint:disable-next-line:no-any
    const expected: any = ['/path/1/to/2', '1', '2'];
    expected.index = 0;
    expected.input = '/path/1/to/2';
    assert.deepEqual(matches, expected);
    assert.deepEqual(params, { id: 2 });
  });

  it('route:/path/:id and path:/paths/1/to/2', () => {
    const { regexp, keys } = pathToRegexp('/path/:id/to/:id');
    const { matches, params } = exec(regexp, keys, '/paths/1/to/2');
    assert.deepEqual(matches, null);
    assert.deepEqual(params, {});
  });

  it('route:/path/:id/from/:id2 and path:/path/1/from/2', () => {
    const { regexp, keys } = pathToRegexp('/path/:id/from/:id2');
    const { matches, params } = exec(regexp, keys, '/path/1/from/2');
    // tslint:disable-next-line:no-any
    const expected: any = ['/path/1/from/2', '1', '2'];
    expected.index = 0;
    expected.input = '/path/1/from/2';
    assert.deepEqual(matches, expected);
    assert.deepEqual(params, { id: 1, id2: 2 });
  });
});
