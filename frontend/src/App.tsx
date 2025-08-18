import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Note, FilterType } from './types';
import * as notesApi from './api/notesApi';

// 导入你的组件（确保这些文件已创建）
import Sidebar from './components/Sidebar';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';

// 导入你的主样式文件
import './App.css';

// 定义过滤器的类型

function App() {
  // --- 状态管理 ---
  const [notes, setNotes] = useState<Note[]>([]); // 原始笔记列表
  const [activeNoteId, setActiveNoteId] = useState<number | null>(null); // 只存储ID，更高效
  const [searchTerm, setSearchTerm] = useState(''); // 搜索词
  const [filter, setFilter] = useState<FilterType>('all'); // 当前过滤器
  const [isLoading, setIsLoading] = useState(true); // 加载状态

  // --- 数据获取 ---
  useEffect(() => {
    // 使用防抖来避免在用户输入搜索词时频繁请求API
    const handler = setTimeout(() => {
      setIsLoading(true);
      notesApi.getNotes(searchTerm)
        .then(fetchedNotes => {
          setNotes(fetchedNotes);
        })
        .catch(error => console.error("获取笔记失败:", error))
        .finally(() => setIsLoading(false));
    }, 300); // 300毫秒防抖

    return () => clearTimeout(handler);
  }, [searchTerm]); // 仅当搜索词变化时重新获取

  // --- 派生状态 (Derived State) ---
  // 使用 useMemo 进行性能优化，只有在依赖项变化时才重新计算
  const activeNote = useMemo(() => 
    notes.find(note => note.id === activeNoteId) || null, 
    [notes, activeNoteId]
  );

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      if (filter === 'favorites') return note.is_favorite && !note.is_trashed;
      if (filter === 'trashed') return note.is_trashed;
      // 默认'all'视图不显示已在废纸篓的笔记
      return !note.is_trashed;
    });
  }, [notes, filter]);

  // --- 事件处理函数 (Event Handlers) ---
  // 使用 useCallback 避免不必要的子组件重渲染
  const handleSelectNote = useCallback((id: number) => {
    setActiveNoteId(id);
  }, []);

  const handleNewNote = useCallback(async () => {
    try {
      const newNote = await notesApi.createNote({ title: "无标题笔记", content: "" });
      setNotes(prevNotes => [newNote, ...prevNotes]);
      setActiveNoteId(newNote.id);
    } catch (error) {
      console.error("创建笔记失败:", error);
    }
  }, []);

  const handleUpdateNote = useCallback(async (updatedFields: Partial<Omit<Note, 'id'>>) => {
    if (!activeNoteId) return;
    try {
      const updatedNote = await notesApi.updateNote(activeNoteId, updatedFields);
      setNotes(prevNotes => 
        prevNotes.map(note => (note.id === activeNoteId ? updatedNote : note))
      );
    } catch (error) {
      console.error("更新笔记失败:", error);
    }
  }, [activeNoteId]);

  const handleToggleFavorite = useCallback(async (noteId: number, isFavorite: boolean) => {
    try {
      const updatedNote = await notesApi.updateNote(noteId, { is_favorite: !isFavorite });
      setNotes(prevNotes => 
        prevNotes.map(note => (note.id === noteId ? updatedNote : note))
      );
    } catch (error) {
      console.error("切换收藏失败:", error);
    }
  }, []);
  
  const handleToggleTrash = useCallback(async (noteId: number, isTrashed: boolean) => {
    try {
      const updatedNote = await notesApi.updateNote(noteId, { is_trashed: !isTrashed });
      setNotes(prevNotes => 
        prevNotes.map(note => (note.id === noteId ? updatedNote : note))
      );
      // 如果删除的是当前选中的笔记，则取消选中
      if (activeNoteId === noteId) {
        setActiveNoteId(null);
      }
    } catch (error) {
      console.error("切换废纸篓状态失败:", error);
    }
  }, [activeNoteId]);
  
 return (
    <div className="app-container">
      {/* 关键修改：移除 left-panel-wrapper，让三个组件成为直接子元素 */}
      <Sidebar 
        onNewNote={handleNewNote}
        onFilterChange={setFilter}
        activeFilter={filter}
      />
      <NoteList
        notes={filteredNotes}
        isLoading={isLoading}
        activeNoteId={activeNoteId}
        onSelectNote={handleSelectNote}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onToggleFavorite={handleToggleFavorite}
        onToggleTrash={handleToggleTrash}
      />
      <NoteEditor
        key={activeNote?.id ?? 'empty'} 
        activeNote={activeNote}
        onUpdateNote={handleUpdateNote}
      />
    </div>
  );
}
export default App;