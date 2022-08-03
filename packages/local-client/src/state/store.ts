import { configureStore } from '@reduxjs/toolkit';

// Reducers
import cellsReducer from './reducers/cellsReducer';
import bundlesReducer from './reducers/bundlesReducer';

// Middleware
import { persistCells } from './middlewares/persistCells';

export const store = configureStore({
  reducer: {
    cells: cellsReducer,
    bundles: bundlesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistCells),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
