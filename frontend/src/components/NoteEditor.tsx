// frontend/src/components/NoteEditor.tsx

import { useState, useEffect, useMemo } from 'react';
import type { Note } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Select from 'react-select';
import * as notesApi from '../api/notesApi';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { FaRegFileAlt } from 'react-icons/fa';

// --- 类型定义 ---
type NoteUpdatePayload = Partial<Omit<Note, 'id'>> & {
  tag_ids?: number[];
};
type NoteEditorProps = {
  activeNote: Note | null;
  onUpdateNote: (note: NoteUpdatePayload) => void;
};
type TagOption = {
  value: number;
  label: string;
};

// --- react-select 深度定制样式对象 ---
const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: 'var(--bg-secondary)', // 使用 secondary 背景色
      border: 'none',
      boxShadow: 'none',
      minHeight: '40px',
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: 'var(--bg-secondary)',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'var(--primary-blue)' : state.isFocused ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
      color: 'var(--text-primary)',
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: 'transparent',
      border: '1px solid #A7A1FF',
      borderRadius: '16px',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: '#A7A1FF',
      fontWeight: 500,
      fontSize: '13px',
      padding: '4px 8px',
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: 'var(--text-secondary)',
      ':hover': {
        backgroundColor: '#A7A1FF',
        color: 'white',
      },
    }),
    input: (provided: any) => ({ ...provided, color: 'var(--text-primary)' }),
    placeholder: (provided: any) => ({ ...provided, color: 'var(--text-secondary)' }),
    clearIndicator: (provided: any) => ({ ...provided, display: 'none' }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (provided: any) => ({ ...provided, color: 'var(--text-secondary)' }),
};

// --- 组件 ---
function NoteEditor({ activeNote, onUpdateNote }: NoteEditorProps) {
  // --- 状态管理 ---
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [allTags, setAllTags] = useState<TagOption[]>([]);

  // --- useEffects ---
  useEffect(() => {
    notesApi.getTags().then(tags => {
      setAllTags(tags.map(tag => ({ value: tag.id, label: tag.name })));
    });
  }, []);

  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title);
      setContent(activeNote.content || '');
      setMode('edit');
    } else {
      setTitle('');
      setContent('');
    }
  }, [activeNote]);

  useEffect(() => {
    if (!activeNote) return;
    const handler = setTimeout(() => {
      if (title !== activeNote.title || content !== activeNote.content) {
        onUpdateNote({ title, content });
      }
    }, 1000);
    return () => clearTimeout(handler);
  }, [title, content, activeNote, onUpdateNote]);

  // --- 事件处理 ---
  const handleTagsChange = (selectedOptions: readonly TagOption[]) => {
    const tag_ids = selectedOptions.map(option => option.value);
    onUpdateNote({ tag_ids });
  };

  // --- 派生状态 ---
  const statusBarInfo = useMemo(() => {
    if (!activeNote) return null;
    const charCount = content.length;
    const readTime = Math.ceil(charCount / 500);
    const lastModified = formatDistanceToNow(new Date(activeNote.updated_at), { addSuffix: true, locale: zhCN });
    return { charCount, readTime, lastModified };
  }, [content, activeNote]);

  const currentTagOptions = activeNote ? activeNote.tags.map(tag => ({ value: tag.id, label: tag.name })) : [];

  // --- JSX 渲染 ---
  return (
    <div className="note-editor">
      <div className="editor-wrapper">
        {/* 条件渲染：只有在有活动笔记时才显示编辑器内容 */}
        {activeNote ? (
          <>
            <div className="editor-header">
              <div className="editor-status">
                <FaRegFileAlt /> <span>正在阅读</span>
              </div>
              <div className="editor-toolbar">
                <button onClick={() => setMode('edit')} className={mode === 'edit' ? 'active' : ''}>编辑</button>
                <button onClick={() => setMode('preview')} className={mode === 'preview' ? 'active' : ''}>预览</button>
              </div>
            </div>

            <div className="editor-content-area">
              <input 
                className="note-title-input" 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="请输入标题..."
              />
              <div className="tag-selector-container">
                <Select
                  isMulti
                  options={allTags}
                  value={currentTagOptions}
                  onChange={handleTagsChange}
                  placeholder="选择或创建标签..."
                  styles={customSelectStyles} 
                />
              </div>
              {mode === 'edit' ? (
                <textarea 
                  className="note-content-textarea" 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="开始书写你的笔记..."
                />
              ) : (
                <div className="markdown-preview">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                </div>
              )}
            </div>

            {statusBarInfo && (
              <div className="editor-footer">
                <span>最后修改: {statusBarInfo.lastModified}</span>
                <span>{statusBarInfo.charCount} 字</span>
                <span>{statusBarInfo.readTime} 分钟阅读</span>
              </div>
            )}
          </>
        ) : (
          // 如果没有活动笔记，显示空状态
          <div className="note-editor-empty">请在左侧选择或创建一篇新笔记</div>
        )}
      </div>
    </div>
  );
}

export default NoteEditor;