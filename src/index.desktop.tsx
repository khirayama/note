// tslint:disable:no-any
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { IAction } from 'action-creators/action-creators';
import { reducers } from 'reducers/reducers';
import { Navigator } from 'router/Navigator';
import { IMatchedRoute, Router } from 'router/Router';
import { Tracker } from 'router/Tracker';
import { routes } from 'routes/routes.desktop';
import { initialState, IState } from 'state/state';
import { Store } from 'store/Store';
import { logger } from 'utils/logger';

const store: Store<IState, IAction> = new Store<IState, IAction>(initialState, reducers, { session: true });
const router: Router = new Router(routes);
const tracker: Tracker = new Tracker(router);

tracker.send();

function handleTransition(matchedRoute: IMatchedRoute): void {
  tracker.send();
}

window.addEventListener('DOMContentLoaded', () => {
  logger.info(`Start app at ${new Date().toString()}.`);

  const applicationMainElement: HTMLElement | null = window.document.querySelector('.Application--Main');
  if (applicationMainElement !== null) {
    const path: string = window.location.pathname;
    ReactDOM.render(
      <Navigator props={{ store }} router={router} path={path} onTransition={handleTransition} />,
      applicationMainElement,
    );
  }
});
