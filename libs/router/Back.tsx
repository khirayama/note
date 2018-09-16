// tslint:disable:no-any
import * as React from 'react';

import { context } from 'router/Navigator';

interface IBackProps {
  to: string;
  className?: string;
}

export class Back extends React.Component<IBackProps> {
  public move: any;

  private onClick: (event: React.MouseEvent<HTMLElement>) => void;

  constructor(props: any) {
    super(props);

    this.onClick = this.handleClick.bind(this);
  }

  public render(): JSX.Element {
    const { children, className, to } = this.props;

    return (
      <>
        <context.Consumer>{this.bindContext.bind(this)}</context.Consumer>
        <a href={to} className={className} onClick={this.onClick}>
          {children}
        </a>
      </>
    );
  }

  private bindContext(ctx: any): null {
    this.move = ctx.move;

    return null;
  }

  private handleClick(event: React.MouseEvent<HTMLElement>): void {
    const { to } = this.props;
    const depth: number = window.history.state.depth;

    event.preventDefault();
    event.stopPropagation();
    if (depth > 0) {
      window.history.back();
    } else {
      this.move(to);
    }
  }
}
