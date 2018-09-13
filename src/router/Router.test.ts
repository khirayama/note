import * as assert from 'power-assert';

import { IRoute, Router } from 'router/Router';

let router: Router;
const routes: IRoute[] = [];

describe('Router', () => {
  beforeEach(() => {
    router = new Router(routes);
  });

  it('Test check', () => {
    assert.deepEqual(1, 1);
  });
});
