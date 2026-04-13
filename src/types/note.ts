export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: string;
}
export interface CreateNotePayload {
  title: string;
  content: string;
  tag: string;
}
