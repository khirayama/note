// tslint:disable:no-any
import * as React from 'react';

import { decreaseCount, increaseCount } from 'action-creators/actionCreators';
import { Container, IContainerProps } from 'presentations/containers/Container';
import { Link } from 'router/Link';
import { IState } from 'state/state';

export class HomeDesktopPage extends Container<{}, IState> {
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
      <section className="Page HomeDesktopPage">
        <div>Home(Desktop)</div>
        <div>{this.state.count}</div>
        <div onClick={this.onClickIncrementButton} role="button">
          INCREMENT
        </div>
        <div onClick={this.onClickDecrementButton} role="button">
          DECREMENT
        </div>
        <div>
          <Link to="/sub">to Sub</Link>
        </div>
      </section>
    );
  }

  private handleClickIncrementButton(): void {
    this.actions.increaseCount(1);
  }

  private handleClickDecrementButton(): void {
    this.actions.decreaseCount(1);
  }
}
