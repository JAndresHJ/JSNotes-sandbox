import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cell } from '../cell';
import {
  DeleteCellPayload,
  InsertCellAfterPayload,
  MoveCellPayload,
  UpdateCellPayload,
} from '../actions';

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
});

const randomId = () => {
  return Math.random().toString(36).substring(2, 5);
};

export const cellsActions = cellsSlice.actions;

export default cellsSlice.reducer;
