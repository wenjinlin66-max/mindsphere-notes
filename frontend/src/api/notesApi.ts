// frontend/src/api/notesApi.ts

import axios from 'axios';
// 确保从你的类型定义文件中导入 Note 和 Tag
import type { Note, Tag } from '../types';

const API_URL = import.meta.env.VITE_API_BASE_URL;

// 创建一个配置好的axios实例，方便统一管理
const apiClient = axios.create({
  baseURL: API_URL,
});

// --- Note API ---

// 获取所有笔记，支持搜索
export const getNotes = (searchTerm: string = ''): Promise<Note[]> => {
  return apiClient.get('/notes/', { params: { search: searchTerm } }).then(res => res.data);
};

// 根据ID获取单个笔记（如果需要）
export const getNoteById = (id: number): Promise<Note> => {
  return apiClient.get(`/notes/${id}/`).then(res => res.data);
};

// 创建新笔记
export const createNote = (note: Partial<Note>): Promise<Note> => {
    return apiClient.post('/notes/', note).then(res => res.data);
};

// 更新笔记 (使用 PATCH 可以只发送改变的字段)
export const updateNote = (id: number, note: Partial<Omit<Note, 'id'>>): Promise<Note> => {
    return apiClient.patch(`/notes/${id}/`, note).then(res => res.data);
};

// 删除笔记
export const deleteNote = (id: number): Promise<void> => {
    return apiClient.delete(`/notes/${id}/`).then(res => res.data);
};


// --- Tag API ---

// 获取所有标签
export const getTags = (): Promise<Tag[]> => {
  return apiClient.get('/tags/').then(res => res.data);
};