import './action-bar.css';
import { useAppDispatch } from '../../hooks/useAppSelector';
import { cellsActions } from '../../state';
import ActionButton from './ActionButton';

interface ActionBarProps {
  cellId: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ cellId }) => {
  const dispatch = useAppDispatch();

  const onClickUp = () => {
    dispatch(cellsActions.moveCell({ id: cellId, direction: 'up' }));
  };

  const onClickDown = () => {
    dispatch(cellsActions.moveCell({ id: cellId, direction: 'down' }));
  };

  const onClickDelete = () => {
    dispatch(cellsActions.deleteCell({ id: cellId }));
  };

  return (
    <div className='action-bar'>
      <ActionButton onClick={onClickUp} icon='fa-arrow-up' />
      <ActionButton onClick={onClickDown} icon='fa-arrow-down' />
      <ActionButton onClick={onClickDelete} icon='fa-times' />
    </div>
  );
};

export default ActionBar;
