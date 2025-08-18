// frontend/src/api/notesApi.ts

import axios from 'axios';
import type { Note, Tag } from '../types';

// 确保 baseURL 正确无误
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api', 
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- API 函数 ---
export const login = (data: any) => apiClient.post('/token/', data);
export const register = (data: any) => apiClient.post('/register/', data);
export const getNotes = (searchTerm: string = ''): Promise<Note[]> => apiClient.get('/notes/', { params: { search: searchTerm } }).then(res => res.data);
export const getTags = (): Promise<Tag[]> => apiClient.get('/tags/').then(res => res.data);
export const createNote = (note: Partial<Note>): Promise<Note> => apiClient.post('/notes/', note).then(res => res.data);
export const updateNote = (id: number, note: Partial<Omit<Note, 'id'>> & { tag_ids?: number[] }): Promise<Note> => apiClient.patch(`/notes/${id}/`, note).then(res => res.data);
export const reorderNotes = (orderedIds: number[]): Promise<void> => apiClient.post('/notes/reorder/', { ordered_ids: orderedIds });
export const deleteNote = (id: number): Promise<void> => apiClient.delete(`/notes/${id}/`).then(res => res.data);