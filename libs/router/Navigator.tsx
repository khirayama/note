// tslint:disable:no-any
import * as React from 'react';

import { IMatchedRoute, IRoute, Router } from 'router/Router';

export const context: any = React.createContext(null);

interface INavigatorProps {
  props?: any;
  router: Router;
  path: string;
  onMount?(matchedRoute: IMatchedRoute): any;
  onTransition?(matchedRoute: IMatchedRoute): any;
}

export class Navigator extends React.Component<INavigatorProps, { path: string }> {
  constructor(props: INavigatorProps) {
    super(props);

    this.state = {
      path: props.path,
    };

    if (typeof window === 'object' && window.history && window.history.pushState) {
      window.addEventListener('popstate', () => {
        const { router } = this.props;
        const path: string = window.location.pathname;
        const matchedRoute: IMatchedRoute | null = router.matchRoute(path);
        if (matchedRoute !== null) {
          window.document.title = matchedRoute.title;
          this.setState({ path });
          if (this.props.onTransition) {
            this.props.onTransition(matchedRoute);
          }
        }
      });
    }
  }

  public componentDidMount(): void {
    const { router } = this.props;
    const { path } = this.state;
    const matchedRoute: IMatchedRoute | null = router.matchRoute(path);
    if (matchedRoute !== null && this.props.onMount) {
      this.props.onMount(matchedRoute);
    }
  }

  public render(): JSX.Element | null {
    const { props, router } = this.props;
    const { path } = this.state;

    let pathname: string = path;
    if (pathname.indexOf('?') !== -1) {
      pathname = pathname.split('?')[0];
    }

    const matchedRoute: IMatchedRoute | null = router.matchRoute(pathname);
    if (matchedRoute !== null) {
      const params: { [key: string]: string } = matchedRoute.params || {};
      const component: string | React.ComponentClass | React.StatelessComponent =
        matchedRoute.component.toString().indexOf('class') === -1 ? matchedRoute.component() : matchedRoute.component;

      const ctx: {
        move(path: string): void;
      } = {
        move: this.move.bind(this),
      };

      return <context.Provider value={ctx}>{React.createElement(component, { ...props, params })}</context.Provider>;
    }

    return null;
  }

  private move(path: string): void {
    const { router } = this.props;
    let pathname: string = path;
    let search: string = '';
    if (pathname.indexOf('?') !== -1) {
      const tmp: string[] = pathname.split('?');
      pathname = tmp[0];
      search = tmp[1];
    }
    if (window.location.pathname !== pathname || window.location.search.replace('?', '') !== search) {
      const matchedRoute: IMatchedRoute | null = router.matchRoute(pathname);
      if (matchedRoute !== null) {
        window.document.title = matchedRoute.title;
        window.history.pushState(null, matchedRoute.title, path);
        this.setState({ path });
        if (this.props.onTransition) {
          this.props.onTransition(matchedRoute);
        }
      }
    }
  }
}
