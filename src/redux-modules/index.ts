import { configureStore, combineReducers } from '@reduxjs/toolkit';
import mapReducer from './map/reducer';
import destinationReducer from './destination/reducer';
import miscReducer from './misc/reducer';
import { robotStatusName, robotStatusReducer } from './robot-status/slice';

const rootReducer = combineReducers({
    map: mapReducer,
    destination: destinationReducer,
    misc: miscReducer,
    [robotStatusName]: robotStatusReducer,
});

const Store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof Store.dispatch;
export default Store;
