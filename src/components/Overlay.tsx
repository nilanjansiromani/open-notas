import React, { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import '../styles/overlay.css';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  pageUrl?: string;
  pageTitle?: string;
}

interface Note {
  id: string;
  content: string;
  todos: Todo[];
  createdAt: number;
  updatedAt: number;
}

const NoteOverlay: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [showTodoInput, setShowTodoInput] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p></p>',
  });

  // Load notes from Chrome storage on mount
  useEffect(() => {
    (chrome as any).storage.local.get(['notes'], (result: any) => {
      const loadedNotes = result.notes || [];
      setNotes(loadedNotes);
      
      if (loadedNotes.length > 0) {
        setCurrentNote(loadedNotes[0]);
        setTodos(loadedNotes[0].todos || []);
      } else {
        createNewNote();
      }

      // Check if we have selected data to add
      const selectedData = (window as any).__openNotasSelectedData;
      if (selectedData && selectedData.text) {
        addTodoFromSelection(selectedData.text, selectedData.pageUrl, selectedData.pageTitle);
      }
    });
  }, []);

  // Update editor when current note changes
  useEffect(() => {
    if (editor && currentNote) {
      editor.commands.setContent(currentNote.content);
      setTodos(currentNote.todos || []);
    }
  }, [currentNote?.id, editor]);

  // Auto-save on editor change
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (editor && currentNote) {
        const content = editor.getHTML();
        const updatedNote = {
          ...currentNote,
          content,
          todos,
          updatedAt: Date.now(),
        };
        
        setCurrentNote(updatedNote);
        saveNote(updatedNote);
      }
    }, 500);

    return () => clearTimeout(saveTimer);
  }, [editor?.state.doc, todos]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: '<p></p>',
      todos: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    setCurrentNote(newNote);
    setTodos([]);
    setNotes((prev) => [newNote, ...prev]);
  };

  const saveNote = (note: Note) => {
    const updatedNotes = notes.map((n) => (n.id === note.id ? note : n));
    if (!updatedNotes.find((n) => n.id === note.id)) {
      updatedNotes.unshift(note);
    }
    setNotes(updatedNotes);
    
    (chrome as any).storage.local.set({ notes: updatedNotes }, () => {
      console.log('Notes saved');
    });
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((n) => n.id !== noteId);
    setNotes(updatedNotes);
    
    if (currentNote?.id === noteId) {
      if (updatedNotes.length > 0) {
        setCurrentNote(updatedNotes[0]);
      } else {
        createNewNote();
      }
    }
    
    (chrome as any).storage.local.set({ notes: updatedNotes });
  };

  const addTodoFromSelection = (text: string, pageUrl?: string, pageTitle?: string) => {
    if (!currentNote) return;
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      pageUrl,
      pageTitle,
    };
    
    const updatedTodos = [newTodo, ...todos];
    setTodos(updatedTodos);
    
    const updatedNote = {
      ...currentNote,
      todos: updatedTodos,
      updatedAt: Date.now(),
    };
    
    setCurrentNote(updatedNote);
    saveNote(updatedNote);
  };

  const addTodo = () => {
    if (!newTodoText.trim() || !currentNote) return;
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: newTodoText,
      completed: false,
    };
    
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    setNewTodoText('');
    
    const updatedNote = {
      ...currentNote,
      todos: updatedTodos,
      updatedAt: Date.now(),
    };
    
    setCurrentNote(updatedNote);
    saveNote(updatedNote);
  };

  const toggleTodo = (todoId: string) => {
    if (!currentNote) return;
    
    const updatedTodos = todos.map((t) =>
      t.id === todoId ? { ...t, completed: !t.completed } : t
    );
    setTodos(updatedTodos);
    
    const updatedNote = {
      ...currentNote,
      todos: updatedTodos,
      updatedAt: Date.now(),
    };
    
    setCurrentNote(updatedNote);
    saveNote(updatedNote);
  };

  const deleteTodo = (todoId: string) => {
    if (!currentNote) return;
    
    const updatedTodos = todos.filter((t) => t.id !== todoId);
    setTodos(updatedTodos);
    
    const updatedNote = {
      ...currentNote,
      todos: updatedTodos,
      updatedAt: Date.now(),
    };
    
    setCurrentNote(updatedNote);
    saveNote(updatedNote);
  };

  const closeOverlay = () => {
    const overlay = document.getElementById('open-notas-overlay');
    if (overlay) {
      const parent = overlay.parentNode;
      if (parent) {
        parent.removeChild(overlay);
      }
    }
  };

  return (
    <div className="on-overlay-container">
      <div className="on-overlay-header">
        <h1 className="on-overlay-title">Open Notas</h1>
        <button className="on-overlay-close" onClick={closeOverlay}>
          ✕
        </button>
      </div>

      <div className="on-overlay-toolbar">
        <button className="on-overlay-btn on-btn-new" onClick={createNewNote}>
          + New Note
        </button>
      </div>

      <div className="on-overlay-editor-section">
        <EditorContent editor={editor} />
      </div>

      <div className="on-overlay-todos">
        <h3 className="on-todos-title">Todos</h3>
        
        <div className="on-todos-list">
          {todos.map((todo) => (
            <div key={todo.id} className="on-todo-item">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="on-todo-checkbox"
              />
              <div className="on-todo-content">
                <span className={`on-todo-text ${todo.completed ? 'completed' : ''}`}>
                  {todo.text}
                </span>
                {todo.pageUrl && (
                  <a
                    href={todo.pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="on-todo-link"
                  >
                    {todo.pageTitle || 'Source'}
                  </a>
                )}
              </div>
              <button
                className="on-todo-delete"
                onClick={() => deleteTodo(todo.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {showTodoInput ? (
          <div className="on-todo-input-container">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addTodo();
                }
              }}
              placeholder="Add a new todo..."
              className="on-todo-input"
              autoFocus
            />
            <button className="on-btn-add-todo" onClick={addTodo}>
              Add
            </button>
          </div>
        ) : (
          <button
            className="on-btn-add-todo-toggle"
            onClick={() => setShowTodoInput(true)}
          >
            + Add Todo
          </button>
        )}
      </div>

      <div className="on-overlay-notes-list">
        <h3 className="on-notes-title">Notes</h3>
        <div className="on-notes-scroll">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`on-note-item ${currentNote?.id === note.id ? 'active' : ''}`}
              onClick={() => setCurrentNote(note)}
            >
              <span className="on-note-preview">
                {note.content.replace(/<[^>]*>/g, '').substring(0, 30) ||
                  'Empty note'}
              </span>
              <button
                className="on-note-delete"
                onClick={(e: any) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoteOverlay;
