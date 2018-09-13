import { IAction } from 'action-creators/action-creators';
import { actionTypes } from 'constants/actionTypes';
import { IState } from 'state/state';

export function reducers(state: IState, action: IAction): IState {
  const newState: IState = JSON.parse(JSON.stringify(state));

  switch (action.actionType) {
    case actionTypes.INCREASE_COUNT: {
      newState.count += action.payload;
      break;
    }
    case actionTypes.DECREASE_COUNT: {
      newState.count -= action.payload;
      break;
    }
    default:
  }

  return newState;
}
