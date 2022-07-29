import './text-editor.css';
import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import { useEffect, useState, useRef } from 'react';
import { Cell, cellsActions } from '../../state';
import { useAppDispatch } from '../../hooks/useAppSelector';

interface TextEditorProps {
  cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const [editing, setEditing] = useState(false);
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement | null>(null);

  const onChange = (value: string | undefined) => {
    dispatch(cellsActions.updateCell({ id: cell.id, content: value || '' }));
  };

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        ref.current &&
        event.target &&
        ref.current.contains(event.target as Node)
      ) {
        return;
      }
      setEditing(false);
    };

    document.addEventListener('click', listener, { capture: true });

    return () => {
      document.removeEventListener('click', listener, { capture: true });
    };
  }, []);

  if (editing) {
    return (
      <div className='text-editor' ref={ref}>
        <MDEditor height={200} value={cell.content} onChange={onChange} />
      </div>
    );
  }

  return (
    <div className='text-editor card' onClick={() => setEditing(true)}>
      <div className='card-content'>
        <MDEditor.Markdown source={cell.content || 'Click to edit'} />
      </div>
    </div>
  );
};

export default TextEditor;
