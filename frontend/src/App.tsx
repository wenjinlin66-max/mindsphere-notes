// frontend/src/App.tsx

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Note, FilterType } from './types';
import * as notesApi from './api/notesApi';

// 1. 导入 dnd-kit 的组件和类型
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core'; // <-- 【已修正】使用 'type' 关键字导入类型
import { arrayMove } from '@dnd-kit/sortable';

// 导入你的组件
import Sidebar from './components/Sidebar';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';

// 导入你的主样式文件
import './App.css';

function App() {
  // --- 状态管理 ---
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);

  // --- 数据获取 ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setIsLoading(true);
      notesApi.getNotes(searchTerm)
        .then(fetchedNotes => {
          setNotes(fetchedNotes);
        })
        .catch(error => console.error("获取笔记失败:", error))
        .finally(() => setIsLoading(false));
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // --- 派生状态 ---
  const activeNote = useMemo(() => 
    notes.find(note => note.id === activeNoteId) || null, 
    [notes, activeNoteId]
  );

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      if (filter === 'favorites') return note.is_favorite && !note.is_trashed;
      if (filter === 'trashed') return note.is_trashed;
      return !note.is_trashed;
    });
  }, [notes, filter]);

  // --- 事件处理函数 ---
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

  type NoteUpdatePayload = Partial<Omit<Note, 'id'>> & { tag_ids?: number[] };
  const handleUpdateNote = useCallback(async (updatedFields: NoteUpdatePayload) => {
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

  // 【已修正】恢复完整的函数体，消除“未使用变量”的警告
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
  
  // 【已修正】恢复完整的函数体，消除“未使用变量”的警告
  const handleToggleTrash = useCallback(async (noteId: number, isTrashed: boolean) => {
    try {
      const updatedNote = await notesApi.updateNote(noteId, { is_trashed: !isTrashed });
      setNotes(prevNotes => 
        prevNotes.map(note => (note.id === noteId ? updatedNote : note))
      );
      if (activeNoteId === noteId) {
        setActiveNoteId(null);
      }
    } catch (error) {
      console.error("切换废纸篓状态失败:", error);
    }
  }, [activeNoteId]);
  
  // --- dnd-kit 的拖拽结束处理逻辑 ---
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = notes.findIndex((item) => item.id === active.id);
      const newIndex = notes.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrderedNotes = arrayMove(notes, oldIndex, newIndex);
        setNotes(newOrderedNotes);
        
        const orderedIds = newOrderedNotes.map(item => item.id);
        // 【已修正】确保 notesApi.reorderNotes 存在
        notesApi.reorderNotes(orderedIds).catch((err: unknown) => { // <-- 【已修正】为 err 添加类型
          console.error("重新排序失败，正在回滚UI:", err);
          setNotes(notes); 
        });
      }
    }
  }, [notes]);
  
  // --- dnd-kit 传感器配置 ---
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="app-container">
        <Sidebar 
          onNewNote={handleNewNote}
          onFilterChange={setFilter}
          activeFilter={filter}
        />
        <NoteList
          notes={filteredNotes} // 列表仍然显示过滤后的笔记
          setNotes={setNotes} // <-- 【已修正】确保传递了 setNotes，需要在 NoteListProps 中定义
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
    </DndContext>
  );
}

export default App;