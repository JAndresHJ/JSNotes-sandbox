import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Cell } from '../cell';
import axios from 'axios';
import {
  DeleteCellPayload,
  InsertCellAfterPayload,
  MoveCellPayload,
  UpdateCellPayload,
} from '../actions';
import { RootState } from '../store';

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

export const fetchCells = createAsyncThunk<
  Cell[],
  void,
  {
    rejectValue: string;
  }
>('cells/fetchCells', async (_, thunkAPI) => {
  try {
    const { data }: { data: Cell[] } = await axios.get('/cells');
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const saveCells = createAsyncThunk<
  void,
  void,
  {
    rejectValue: string;
    state: RootState;
  }
>('cells/saveCells', async (_, thunkAPI) => {
  try {
    const {
      cells: { data, order },
    } = thunkAPI.getState();

    const cells = order.map((id) => data[id]);
    await axios.post('/cells', { cells });
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

const cellsSlice = createSlice({
  name: 'cells',
  initialState,
  reducers: {
    updateCell(state: CellsState, action: PayloadAction<UpdateCellPayload>) {
      const { id, content } = action.payload;
      state.data[id].content = content;
    },
    deleteCell(state: CellsState, action: PayloadAction<DeleteCellPayload>) {
      delete state.data[action.payload.id];
      state.order = state.order.filter((id) => id !== action.payload.id);
    },
    moveCell(state: CellsState, action: PayloadAction<MoveCellPayload>) {
      const { direction } = action.payload;
      const index = state.order.findIndex((id) => id === action.payload.id);
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex > state.order.length - 1) {
        return;
      }

      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = action.payload.id;
    },
    insertCellAfter(
      state: CellsState,
      action: PayloadAction<InsertCellAfterPayload>
    ) {
      const cell: Cell = {
        id: randomId(),
        content: '',
        type: action.payload.type,
      };

      state.data[cell.id] = cell;
      const index = state.order.findIndex((id) => id === action.payload.id);

      if (index < 0) {
        state.order.unshift(cell.id);
      } else {
        state.order.splice(index + 1, 0, cell.id);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCells.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCells.fulfilled, (state, action) => {
      state.order = action.payload.map((cell) => cell.id);
      state.data = action.payload.reduce((acc, cell) => {
        acc[cell.id] = cell;
        return acc;
      }, {} as CellsState['data']);
    });
    builder.addCase(fetchCells.rejected, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.error = action.payload;
      }
    });
    builder.addCase(saveCells.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(saveCells.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(saveCells.rejected, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.error = action.payload;
      }
    });
  },
});

const randomId = () => {
  return Math.random().toString(36).substring(2, 5);
};

export const cellsActions = cellsSlice.actions;

export default cellsSlice.reducer;
