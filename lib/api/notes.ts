import axios from "axios";
import type { Note } from "@/types/note";

const noteInstance = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
});

noteInstance.interceptors.request.use((config) => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page: number;
  perPage: number;
  tag?: string;
  search?: string; 
}


export const fetchNotes = async ({
  tag,
  page = 1,
  perPage = 12,
  search = "", 
}: {
  tag?: string;
  page?: number;
  perPage?: number;
  search?: string;
}): Promise<NotesResponse> => {
  const params: FetchNotesParams = { page, perPage };
  
  if (tag && tag !== "all") {
    params.tag = tag;
  }
  
  if (search) {
    params.search = search;
  }

  const { data } = await noteInstance.get<NotesResponse>("/notes", { params });
  return data;
};


export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await noteInstance.get<Note>(`/notes/${id}`);
  return data;
};


export const createNote = async (note: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> => {
  const { data } = await noteInstance.post<Note>("/notes", note);
  return data;
};


export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await noteInstance.delete<Note>(`/notes/${id}`);
  return data;
};