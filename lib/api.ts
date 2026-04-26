import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";
import type { Note } from "@/types/note";

const API_BASE_URL = "https://notehub-public.goit.study/api";

const noteInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

noteInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

noteInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error(
      `API Error [${error.config?.url}]:`,
      error.response?.status,
      error.response?.data || "No details"
    );
    return Promise.reject(error);
  }
);

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesQuery {
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
  const params: FetchNotesQuery = {
    page: Number(page),
    perPage: Number(perPage),
  };

  const trimmedTag = tag?.trim();
  if (trimmedTag && trimmedTag !== "all") {
    params.tag = trimmedTag;
  }

  const trimmedSearch = search?.trim();
  if (trimmedSearch) {
    params.search = trimmedSearch;
  }

  try {
    const { data } = await noteInstance.get<NotesResponse>("/notes", { params });
    return data;
  } catch (error) {
    return { notes: [], totalPages: 0 };
  }
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
  try {
    const payload = {
      ...note,
      tag: note.tag as Note['tag']
    };
    
    const { data } = await noteInstance.post<Note>("/notes", payload);
    return data;
  } catch (error) {
    console.error("Failed to create note:", error);
    throw error;
  }
};


export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await noteInstance.delete<Note>(`/notes/${id}`);
  return data;
};


export const updateNote = async (id: string, note: Partial<Note>): Promise<Note> => {
  const { data } = await noteInstance.patch<Note>(`/notes/${id}`, note);
  return data;
};