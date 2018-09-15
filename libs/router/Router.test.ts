import * as assert from 'power-assert';

import {
  exec, // test
  getParams, // test
  IRoute,
  IToken,
  parse,
  pathToRegexp, // test
  Router,
  tokensToRegexp,
} from 'router/Router';

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
