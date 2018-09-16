import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { Navigator } from 'router/Navigator';
import { IRoute, Router } from 'router/Router';

const sampleRoutes: IRoute[] = [
  {
    path: '/hello',
    title: 'Hello',
    component: 'Hello',
  },
  {
    path: '/world',
    title: 'World',
    component: 'World',
  },
];

describe('Navigator', () => {
  it('renders correctly with hello', () => {
    const router: Router = new Router(sampleRoutes);

    const tree: object = renderer.create(<Navigator router={router} path={'/hello'} />).toJSON();
    expect(tree).toMatchInlineSnapshot(`
<Hello
  params={Object {}}
  query={Object {}}
/>
`);
  });

  it('renders correctly with world', () => {
    const router: Router = new Router(sampleRoutes);

    const tree: object = renderer.create(<Navigator router={router} path={'/world'} />).toJSON();
    expect(tree).toMatchInlineSnapshot(`
<World
  params={Object {}}
  query={Object {}}
/>
`);
  });
});
