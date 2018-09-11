// tslint:disable:no-any
import { actionTypes } from 'constants/actionTypes';

export interface IAction {
  actionType: string;
  payload?: any;
  meta?: any;
  error?: any;
}

export type IDispatch = (action: IAction) => void;

export async function createSomething(dispatch: IDispatch): Promise<IAction> {
  const preAction: IAction = {
    actionType: actionTypes.CREATE_SOMETHING,
  };
  dispatch(preAction);

  return preAction;
}

export async function updateSomething(dispatch: IDispatch): Promise<IAction> {
  const preAction: IAction = {
    actionType: actionTypes.UPDATE_SOMETHING,
  };
  dispatch(preAction);

  return preAction;
}
