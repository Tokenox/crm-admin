import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web
import categorySlice from './slice/categorySlice';
import leadSlice from './slice/leadSlice';
import authSlice from './slice/authSlice';

const rootReducer = combineReducers({
  auth: authSlice,
  lead: leadSlice,
  category: categorySlice
});

const persistConfig = {
  key: 'root',
  storage,
  // Optionally, you can specify which reducers to persist or blacklist specific reducers
  whitelist: ['auth', 'category'],
  blacklist: ['lead']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
