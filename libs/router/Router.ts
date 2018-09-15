// tslint:disable:no-any
const PATH_REGEXP: RegExp = new RegExp(
  ['(\\\\.)', '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'].join(
    '|',
  ),
  'g',
);

export interface IToken {
  name: string;
  pattern: string;
}

export interface IRoute {
  path: string;
  title: string;
  component: any;
}

export interface IMatchedRoute extends IRoute {
  params: { [key: string]: string } | null;
}

export function parse(str: string): (IToken | string)[] {
  const tokens: (IToken | string)[] = [];
  let index: number = 0;
  let path: string = '';
  let res: RegExpExecArray | null = PATH_REGEXP.exec(str);

  while (res !== null) {
    const offset: number = res.index;

    path += str.slice(index, offset);
    index = offset + res[0].length;

    // If not exist path or empty string
    if (path) {
      tokens.push(path);
    }
    path = '';

    const token: IToken = {
      name: res[3],
      pattern: '[^/]+?',
    };
    tokens.push(token);
    res = PATH_REGEXP.exec(str);
  }

  if (index < str.length) {
    path += str.substr(index);
  }
  if (path) {
    tokens.push(path);
  }

  return tokens;
}

export function tokensToRegexp(tokens: (IToken | string)[]): RegExp {
  let route: string = '';
  const lastToken: IToken | string | undefined = tokens[tokens.length - 1];
  const endsWithSlash: boolean = typeof lastToken === 'string' && /\/$/.test(lastToken);

  tokens.forEach((token: IToken | string) => {
    if (typeof token === 'string') {
      route += token;
    } else {
      let capture: string = token.pattern;
      capture = `/(${capture})`;
      route += capture;
    }
  });
  route = `${endsWithSlash ? route.slice(0, -2) : route}(?:\\/(?=$))?$`;

  return new RegExp(`^${route}`, 'i');
}

export function pathToRegexp(path: string): { regexp: RegExp; keys: { name: string }[] } {
  const tokens: (IToken | string)[] = parse(path);
  const regexp: RegExp = tokensToRegexp(tokens);

  const keys: { name: string }[] = [];
  tokens.forEach((token: IToken | string) => {
    if (typeof token !== 'string') {
      keys.push(token);
    }
  });

  return {
    regexp,
    keys,
  };
}

export function getParams(keys: { name: string }[], matches: RegExpExecArray | null): { [key: string]: any } {
  const params: { [key: string]: any } = {};

  if (matches) {
    keys.forEach((key: { name: string }, index: number) => {
      let value: any = matches[index + 1];
      try {
        value = JSON.parse(value);
      } catch (e) {
        value = value;
      }
      params[key.name] = value;
    });
  }

  return params;
}

// Now, `exec` doesn't allow same naming keys.
// OK: /path/:id/to/:id2
// NG: /path/:id/to/:id
export function exec(
  regexp: RegExp,
  keys: { name: string }[],
  path: string,
): {
  matches: RegExpExecArray | null;
  params: { [key: string]: string };
} {
  const matches: RegExpExecArray | null = regexp.exec(path);
  const params: { [key: string]: string } = getParams(keys, matches);

  return {
    matches,
    params,
  };
}

export class Router {
  private routes: IRoute[];

  constructor(routes: IRoute[]) {
    this.routes = routes;
  }

  public getPaths(): string[] {
    return this.routes.map((route: IRoute) => route.path);
  }

  public matchRoute(path: string): IMatchedRoute | null {
    for (const route of this.routes) {
      const { regexp, keys } = pathToRegexp(route.path || '');
      const { matches, params } = exec(regexp, keys, path);
      if (matches) {
        return { ...route, params };
      }
    }

    return null;
  }
}
