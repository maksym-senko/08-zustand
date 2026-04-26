import axios from "axios";
import type { Note } from "@/types/note";

const API_BASE_URL = "https://notehub-public.goit.study/api";

const noteInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

noteInstance.interceptors.request.use((config) => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

noteInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      `API Error [${error.config?.url}]:`,
      error.response?.status,
      error.response?.data
    );
    return Promise.reject(error);
  }
);

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

// Визначаємо чіткий інтерфейс для параметрів, уникаючи any
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
  
  // Ініціалізуємо об'єкт з обов'язковими числовими полями
  const params: FetchNotesQuery = {
    page: Number(page),
    perPage: Number(perPage),
  };

  // Додаємо опціональні поля тільки якщо вони мають валідне значення
  if (tag && tag !== "all" && tag.trim() !== "") {
    params.tag = tag;
  }

  if (search && search.trim() !== "") {
    params.search = search.trim();
  }

  try {
    const { data } = await noteInstance.get<NotesResponse>("/notes", { params });
    return data;
  } catch (error) {
    return { notes: [], totalPages: 0 };
  }
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  try {
    const { data } = await noteInstance.get<Note>(`/notes/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const createNote = async (note: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> => {
  try {
    const { data } = await noteInstance.post<Note>("/notes", note);
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteNote = async (id: string): Promise<Note> => {
  try {
    const { data } = await noteInstance.delete<Note>(`/notes/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateNote = async (id: string, note: Partial<Note>): Promise<Note> => {
  try {
    const { data } = await noteInstance.patch<Note>(`/notes/${id}`, note);
    return data;
  } catch (error) {
    throw error;
  }
};