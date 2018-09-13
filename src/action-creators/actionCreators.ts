// tslint:disable:no-any
import { actionTypes } from 'constants/actionTypes';

export interface IAction {
  actionType: string;
  payload?: any;
  meta?: any;
  error?: any;
}

export type IDispatch = (action: IAction) => void;

export async function increaseCount(dispatch: IDispatch, num: number): Promise<IAction> {
  const action: IAction = {
    actionType: actionTypes.INCREASE_COUNT,
    payload: num,
  };
  dispatch(action);

  return action;
}

export async function decreaseCount(dispatch: IDispatch, num: number): Promise<IAction> {
  const action: IAction = {
    actionType: actionTypes.DECREASE_COUNT,
    payload: num,
  };
  dispatch(action);

  return action;
}
