import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BundleStartPayload, BundleCompletePayload } from '../actions';
import bundle from '../../bundler';

interface BundlesState {
  [key: string]:
    | {
        code: string;
        error: string;
        loading: boolean;
      }
    | undefined;
}

interface BundleCell {
  cellId: string;
  input: string;
}

export const createBundle = createAsyncThunk(
  'bundle/fetchByIdStatus',
  async (bundleCell: BundleCell, thunkAPI) => {
    thunkAPI.dispatch(
      bundlesActions.bundleStart({
        cellId: bundleCell.cellId,
      })
    );

    const result = await bundle(bundleCell.input);

    if (!result) return;

    thunkAPI.dispatch(
      bundlesActions.bundleComplete({
        cellId: bundleCell.cellId,
        bundle: result,
      })
    );
  }
);

const initialState: BundlesState = {};

const bundleSlice = createSlice({
  name: 'cells',
  initialState,
  reducers: {
    bundleStart(
      state: BundlesState,
      action: PayloadAction<BundleStartPayload>
    ) {
      state[action.payload.cellId] = {
        loading: true,
        code: '',
        error: '',
      };
    },
    bundleComplete(
      state: BundlesState,
      action: PayloadAction<BundleCompletePayload>
    ) {
      state[action.payload.cellId] = {
        loading: false,
        code: action.payload.bundle.code,
        error: action.payload.bundle.error,
      };
    },
  },
});

export const bundlesActions = bundleSlice.actions;

export default bundleSlice.reducer;
