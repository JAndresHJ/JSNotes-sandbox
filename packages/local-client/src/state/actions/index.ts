import { CellTypes } from '../cell';

export type Direction = 'up' | 'down';
export interface MoveCellPayload {
  id: string;
  direction: Direction;
}

export interface DeleteCellPayload {
  id: string;
}

export interface InsertCellAfterPayload {
  id: string | null;
  type: CellTypes;
}

export interface UpdateCellPayload {
  id: string;
  content: string;
}

export interface BundleStartPayload {
  cellId: string;
}

export interface BundleCompletePayload {
  cellId: string;
  bundle: {
    code: string;
    error: string;
  };
}
