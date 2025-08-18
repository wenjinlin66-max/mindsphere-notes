// 正确示范 ✅
export interface Tag {
  id: number;
  name: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  tags: Tag[];
  is_favorite: boolean;
  is_trashed: boolean;
}