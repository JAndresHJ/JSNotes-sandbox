import { useAppSelector, useAppDispatch } from '../../hooks/useAppSelector';
import { Fragment, useEffect } from 'react';
import './cell-list.css';

// Components
import AddCell from '../AddCell';
import CellListItem from './CellListItem';
import { fetchCells } from '../../state';

const CellList: React.FC = () => {
  const cells = useAppSelector(({ cells: { order, data } }) =>
    order.map((id) => data[id])
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCells());
  }, [dispatch]);

  const renderCells = cells.map((cell) => (
    <Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell previousCellId={cell.id} />
    </Fragment>
  ));

  return (
    <div className='cell-list'>
      <AddCell forceVisible={cells.length === 0} previousCellId={null} />
      {renderCells}
    </div>
  );
};

export default CellList;
