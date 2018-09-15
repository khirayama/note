import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { IAction } from 'action-creators/actionCreators';
import { logger } from 'logger';
import { reducers } from 'reducers/reducers';
import { Navigator } from 'router/Navigator';
import { IMatchedRoute, Router } from 'router/Router';
import { routes } from 'routes/routes.desktop';
import { initialState, IState } from 'state/state';
import { Store } from 'Store';
import { IEventOptions, IExceptionOptions, IPageViewOptions, Tracker } from 'Tracker';

declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    ga(...args: (string | IPageViewOptions | IEventOptions | IExceptionOptions)[]): void;
  }
}

const store: Store<IState, IAction> = new Store<IState, IAction>(initialState, reducers, { session: true });
const router: Router = new Router(routes);
const tracker: Tracker = new Tracker({
  code: process.env.GA_CODE || '',
  debug: process.env.NODE_ENV !== 'production',
  analytics: window.ga,
});

function handleTransition(matchedRoute: IMatchedRoute): void {
  tracker.setPage(matchedRoute.path);
  tracker.setLocation(window.location.href);
  tracker.sendPageView();
}

window.addEventListener('DOMContentLoaded', () => {
  logger.info(`Start app at ${new Date().toString()}.`);

  const applicationMainElement: HTMLElement | null = window.document.querySelector('.Application--Main');
  if (applicationMainElement !== null) {
    const path: string = window.location.pathname;
    ReactDOM.render(
      <Navigator
        props={{ store }}
        router={router}
        path={path}
        onMount={handleTransition}
        onTransition={handleTransition}
      />,
      applicationMainElement,
    );
  }
});

// Tracking Error
window.addEventListener(
  'error',
  (evt: ErrorEvent) => {
    let message: string = 'Error: Unknown';
    const target: HTMLElement = evt.target as HTMLElement;
    if (evt.message) {
      message = evt.message;
    } else if (target instanceof HTMLImageElement) {
      message = `No Image: ${target.src}`;
    } else if (target instanceof HTMLScriptElement) {
      message = `No Script: ${target.src}`;
    } else if (target instanceof HTMLLinkElement) {
      message = `No Stylesheet: ${target.href}`;
    }
    tracker.sendException(`${message} at ${window.location.href}`);
  },
  true,
);
