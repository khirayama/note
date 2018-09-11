// tslint:disable:no-any
import * as React from 'react';

import { createSomething, updateSomething } from 'action-creators/action-creators';
import { Container, IContainerProps } from 'presentations/containers/Container';
import { Link } from 'router/Link';
import { context } from 'router/Navigator';
import { IState } from 'state/state';

export class HomeDesktopPage extends Container<{}, IState> {
  private move: any;

  constructor(props: IContainerProps) {
    super(props);

    const id: string = props.params.id;

    this.state = { ...this.getState() };

    this.actions = {
      createSomething: (): Promise<{}> => {
        return createSomething(this.dispatch);
      },
      updateSomething: (): Promise<{}> => {
        return updateSomething(this.dispatch);
      },
    };
  }

  public render(): JSX.Element {
    return (
      <section className="Page HomeDesktopPage">
        <context.Consumer>{this.bindContext.bind(this)}</context.Consumer>
        <div>Hello Component</div>
      </section>
    );
  }

  private bindContext(ctx: any): null {
    this.move = ctx.move;

    return null;
  }
}
