import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {videoApi} from '../apis';
import {videoReducer, videoUploaderReducer} from '../slices';

// import logger from 'redux-logger';

const rootReducer = combineReducers({
  [videoApi.reducerPath]: videoApi.reducer,
  videoReducer,
  videoUploaderReducer,
});

// const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => {
    const middlewares = getDefaultMiddleware({
      // serializableCheck: {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // },
    }).concat(videoApi.middleware);

    if (__DEV__) {
      const createDebugger = require('redux-flipper').default;
      middlewares.push(createDebugger());
    }

    return middlewares;
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;

// export const persistor = persistStore(store);
