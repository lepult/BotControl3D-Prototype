import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { counterReducer } from './counter/reducer';
import mapReducer from './map/reducer';
import destinationReducer from './destination/reducer';
import miscReducer from './misc/reducer';

const rootReducer = combineReducers({
    counter: counterReducer,
    map: mapReducer,
    destination: destinationReducer,
    misc: miscReducer,
});

const Store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof Store.dispatch;
export default Store;
