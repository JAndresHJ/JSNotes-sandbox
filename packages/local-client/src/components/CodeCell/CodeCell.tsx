import { useEffect } from 'react';
import { Cell, cellsActions } from '../../state';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppSelector';
import { createBundle } from '../../state/reducers/bundlesReducer';
import './code-cell.css';

// Components
import CodeEditor from '../CodeEditor/CodeEditor';
import Resizable from '../Resizable';
import Preview from '../Preview/Preview';
import { useCumulativeCode } from '../../hooks/useCumulativeCode';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const bundle = useAppSelector((state) => state.bundles[cell.id]);
  const cumulativeCode = useCumulativeCode(cell.id);
  const dispatch = useAppDispatch();

  const onChange = (value: string) => {
    dispatch(cellsActions.updateCell({ id: cell.id, content: value }));
  };

  useEffect(() => {
    if (!bundle) {
      dispatch(createBundle({ cellId: cell.id, input: cumulativeCode }));
      return;
    }

    const timer = setTimeout(async () => {
      dispatch(createBundle({ cellId: cell.id, input: cumulativeCode }));
    }, 750);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cumulativeCode, cell.id, dispatch]);

  return (
    <Resizable direction='vertical'>
      <div
        style={{
          height: 'calc(100% - 10px)',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Resizable direction='horizontal'>
          <CodeEditor initialValue={cell.content} onChange={onChange} />
        </Resizable>
        <div className='progress-wrapper'>
          {!bundle || bundle.loading ? (
            <div className='progress-cover'>
              <progress className='progress is-small is-primary' max='100'>
                Loading
              </progress>
            </div>
          ) : (
            <Preview error={bundle.error} code={bundle.code} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
