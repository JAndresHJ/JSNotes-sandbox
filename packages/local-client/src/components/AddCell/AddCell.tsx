import { useAppDispatch } from '../../hooks/useAppSelector';
import { cellsActions } from '../../state';
import './add-cell.css';

interface AddCellProps {
  forceVisible?: boolean;
  previousCellId: string | null;
}

const AddCell: React.FC<AddCellProps> = ({ previousCellId, forceVisible }) => {
  const dispatch = useAppDispatch();

  const addCodeCell = () => {
    dispatch(
      cellsActions.insertCellAfter({ id: previousCellId, type: 'code' })
    );
  };

  const addTextCell = () => {
    dispatch(
      cellsActions.insertCellAfter({ id: previousCellId, type: 'text' })
    );
  };

  return (
    <div className={`add-cell ${forceVisible && 'force-visible'}`}>
      <div className='add-buttons'>
        <button
          className='button is-rounded is-primary is-small'
          onClick={addCodeCell}
        >
          <span className='icon is-small'>
            <i className='fas fa-plus' />
          </span>
          <span>Code</span>
        </button>
        <button
          className='button is-rounded is-primary is-small'
          onClick={addTextCell}
        >
          <span className='icon is-small'>
            <i className='fas fa-plus' />
          </span>
          <span>Text</span>
        </button>
      </div>
      <div className='divider' />
    </div>
  );
};

export default AddCell;
