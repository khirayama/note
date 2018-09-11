import { IAction } from 'action-creators/action-creators';
import { actionTypes } from 'constants/actionTypes';
import { IState } from 'state/state';

export function reducers(state: IState, action: IAction): IState {
  return JSON.parse(JSON.stringify(state));
}
