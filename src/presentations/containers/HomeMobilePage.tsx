// tslint:disable:no-any
import * as React from 'react';

import { decreaseCount, increaseCount } from 'action-creators/actionCreators';
import { Container, IContainerProps } from 'presentations/containers/Container';
import { Link } from 'router/Link';
import { context } from 'router/Navigator';
import { IState } from 'state/state';

export class HomeMobilePage extends Container<{}, IState> {
  private move: any;

  private onClickIncrementButton: any;

  private onClickDecrementButton: any;

  constructor(props: IContainerProps) {
    super(props);

    this.state = { ...this.getState() };

    this.actions = {
      increaseCount: (num: number): Promise<{}> => {
        return increaseCount(this.dispatch, num);
      },
      decreaseCount: (num: number): Promise<{}> => {
        return decreaseCount(this.dispatch, num);
      },
    };

    this.onClickIncrementButton = this.handleClickIncrementButton.bind(this);
    this.onClickDecrementButton = this.handleClickDecrementButton.bind(this);
  }

  public render(): JSX.Element {
    return (
      <section className="Page HomeMobilePage">
        <context.Consumer>{this.bindContext.bind(this)}</context.Consumer>
        <div>Home(Mobile)</div>
        <div>{this.state.count}</div>
        <span onClick={this.onClickIncrementButton} role="button">
          INCREMENT
        </span>
        <span onClick={this.onClickDecrementButton} role="button">
          DECREMENT
        </span>
        <Link to="/sub">to Sub</Link>
      </section>
    );
  }

  private bindContext(ctx: any): null {
    this.move = ctx.move;

    return null;
  }

  private handleClickIncrementButton(): void {
    this.actions.increaseCount(1);
  }

  private handleClickDecrementButton(): void {
    this.actions.decreaseCount(1);
  }
}
