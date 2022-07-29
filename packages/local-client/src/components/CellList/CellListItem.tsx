import './cell-list-item.css';
import { Cell } from '../../state';

// Components
import ActionBar from '../ActionBar/ActionBar';
import CodeCell from '../CodeCell';
import TextEditor from '../TextEditor';

interface CellListItemProps {
  cell: Cell;
}

const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
  let child: JSX.Element;

  if (cell.type === 'code') {
    child = (
      <>
        <div className='action-bar-wrapper' />
        <ActionBar cellId={cell.id} />
        <CodeCell cell={cell} />
      </>
    );
  } else {
    child = (
      <>
        <TextEditor cell={cell} />
        <ActionBar cellId={cell.id} />
      </>
    );
  }

  return <div className='cell-list-item'>{child}</div>;
};

export default CellListItem;
