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
