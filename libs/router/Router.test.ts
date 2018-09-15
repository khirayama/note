import { exec, IRoute, IToken, parse, pathToRegexp, Router, tokensToRegexp } from 'router/Router';

const routes: IRoute[] = [];

describe('parse', () => {
  it('/path', () => {
    const actual: (IToken | string)[] = parse('/path');
    expect(['/path']).toEqual(actual);
  });

  it('/path/:id', () => {
    const actual: (IToken | string)[] = parse('/path/:id');
    expect([
      '/path',
      {
        name: 'id',
        pattern: '[^/]+?',
      },
    ]).toEqual(actual);
  });

  it('/path/:id/to/:id', () => {
    const actual: (IToken | string)[] = parse('/path/:id/to/:id');
    expect([
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
    ]).toEqual(actual);
  });
});

describe('tokensToRegexp', () => {
  it('/path', () => {
    const tokens: (IToken | string)[] = parse('/path');
    const actual: RegExp = tokensToRegexp(tokens);
    expect(/^\/path(?:\/(?=$))?$/i).toEqual(actual);
  });

  it('/path/:id', () => {
    const tokens: (IToken | string)[] = parse('/path/:id');
    const actual: RegExp = tokensToRegexp(tokens);
    expect(/^\/path\/([^\/]+?)(?:\/(?=$))?$/i).toEqual(actual);
  });

  it('/path/:id/to/:id', () => {
    const tokens: (IToken | string)[] = parse('/path/:id/to/:id');
    const actual: RegExp = tokensToRegexp(tokens);
    expect(/^\/path\/([^\/]+?)\/to\/([^\/]+?)(?:\/(?=$))?$/i).toEqual(actual);
  });
});

describe('pathToRegexp', () => {
  it('/path', () => {
    const { regexp, keys } = pathToRegexp('/path');
    expect(/^\/path(?:\/(?=$))?$/i).toEqual(regexp);
    expect([]).toEqual(keys);
  });

  it('/path/:id', () => {
    const { regexp, keys } = pathToRegexp('/path/:id');
    expect(/^\/path\/([^\/]+?)(?:\/(?=$))?$/i).toEqual(regexp);
    expect([{ name: 'id', pattern: '[^/]+?' }]).toEqual(keys);
  });

  it('/path/:id/to/:id', () => {
    const { regexp, keys } = pathToRegexp('/path/:id/to/:id');
    expect(/^\/path\/([^\/]+?)\/to\/([^\/]+?)(?:\/(?=$))?$/i).toEqual(regexp);
    expect([{ name: 'id', pattern: '[^/]+?' }, { name: 'id', pattern: '[^/]+?' }]).toEqual(keys);
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
    expect(expected).toEqual(matches);
    expect({}).toEqual(params);
  });

  it('route:/path and path:/paths', () => {
    const { regexp, keys } = pathToRegexp('/path');
    const { matches, params } = exec(regexp, keys, '/paths');
    expect(null).toEqual(matches);
    expect({}).toEqual(params);
  });

  it('route:/path/:id and path:/path/1', () => {
    const { regexp, keys } = pathToRegexp('/path/:id');
    const { matches, params } = exec(regexp, keys, '/path/1');
    // tslint:disable-next-line:no-any
    const expected: any = ['/path/1', '1'];
    expected.index = 0;
    expected.input = '/path/1';
    expect(expected).toEqual(matches);
    expect({ id: 1 }).toEqual(params);
  });

  it('route:/path/:id and path:/paths/1', () => {
    const { regexp, keys } = pathToRegexp('/path/:id');
    const { matches, params } = exec(regexp, keys, '/paths/1');
    expect(null).toEqual(matches);
    expect({}).toEqual(params);
  });

  it('route:/path/:id/to/:id and path:/path/1/to/2', () => {
    const { regexp, keys } = pathToRegexp('/path/:id/to/:id');
    const { matches, params } = exec(regexp, keys, '/path/1/to/2');
    // tslint:disable-next-line:no-any
    const expected: any = ['/path/1/to/2', '1', '2'];
    expected.index = 0;
    expected.input = '/path/1/to/2';
    expect(expected).toEqual(matches);
    expect({ id: 2 }).toEqual(params);
  });

  it('route:/path/:id and path:/paths/1/to/2', () => {
    const { regexp, keys } = pathToRegexp('/path/:id/to/:id');
    const { matches, params } = exec(regexp, keys, '/paths/1/to/2');
    expect(null).toEqual(matches);
    expect({}).toEqual(params);
  });

  it('route:/path/:id/from/:id2 and path:/path/1/from/2', () => {
    const { regexp, keys } = pathToRegexp('/path/:id/from/:id2');
    const { matches, params } = exec(regexp, keys, '/path/1/from/2');
    // tslint:disable-next-line:no-any
    const expected: any = ['/path/1/from/2', '1', '2'];
    expected.index = 0;
    expected.input = '/path/1/from/2';
    expect(expected).toEqual(matches);
    expect({ id: 1, id2: 2 }).toEqual(params);
  });
});
