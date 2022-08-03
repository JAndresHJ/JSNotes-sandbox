import { isAnyOf, Middleware } from '@reduxjs/toolkit';
import { cellsActions, saveCells } from '../reducers/cellsReducer';
import { AppDispatch } from '../store';

export const persistCells: Middleware = ({
  dispatch,
}: {
  dispatch: AppDispatch;
}) => {
  let timer: any;
  return (next) => (action) => {
    const { moveCell, updateCell, insertCellAfter, deleteCell } = cellsActions;
    next(action);

    const matchesMyAction = isAnyOf(
      moveCell,
      updateCell,
      insertCellAfter,
      deleteCell
    );

    if (matchesMyAction(action)) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        dispatch(saveCells());
      }, 250);
    }
  };
};
