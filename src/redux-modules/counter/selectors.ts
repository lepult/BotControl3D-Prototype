import { counterSliceName } from './reducer';
import { RootState } from '../index';

export const selectCounterState = (state: RootState) => state[counterSliceName];

export const selectCounterValue = (state: RootState) => selectCounterState(state).value;
