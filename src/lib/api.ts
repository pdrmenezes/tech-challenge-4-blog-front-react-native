import { getAuth } from "./storage";
import type { CreatePostInput, Post, UpdatePostInput } from "../types/posts";
import type {
  CreateStudentInput,
  CreateTeacherInput,
  Student,
  Teacher,
  UpdateStudentInput,
  UpdateTeacherInput,
} from "../types/people";

const API_BASE_URL = "http://localhost:3001";
const AUTH_KEY = "blog_auth";

export interface ListPostsParams {
  limit?: number;
  offset?: number;
}

export interface SearchPostsParams extends ListPostsParams {
  q?: string;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "API Error";
    this.status = status;
  }
}

async function getToken(): Promise<string | null> {
  const stored = await getAuth();
  if (!stored) return null;
  try {
    return JSON.parse(stored)?.token ?? null;
  } catch {
    return null;
  }
}

function buildQuery(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Basic ${token}` } : {}),
      ...options.headers,
    },
  });
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await response.json().catch(() => null) : null;
  if (!response.ok) {
    const message =
      (body && typeof body === "object" && "error" in body && (body as any).error) ||
      `Erro na requisição (${response.status})`;
    throw new ApiError(message, response.status);
  }
  return body as T;
}

export async function listPosts(params: ListPostsParams = {}) {
  const query = buildQuery({ limit: params.limit, offset: params.offset });
  return apiFetch<Post[]>(`/posts${query}`);
}

export async function searchPosts(params: SearchPostsParams = {}) {
  const query = buildQuery({ q: params.q, limit: params.limit, offset: params.offset });
  return apiFetch<Post[]>(`/posts/search${query}`);
}

export async function getPost(id: number) {
  return apiFetch<Post>(`/posts/${id}`);
}

export async function createPost(input: CreatePostInput) {
  return apiFetch<Post>(`/posts`, { method: "POST", body: JSON.stringify(input) });
}

export async function updatePost(id: number, input: UpdatePostInput) {
  return apiFetch<Post>(`/posts/${id}`, { method: "PUT", body: JSON.stringify(input) });
}

export async function togglePostStatus(id: number) {
  return apiFetch<Post>(`/posts/status/${id}`, { method: "PUT" });
}

export async function deletePost(id: number) {
  return apiFetch<Post>(`/posts/${id}`, { method: "DELETE" });
}

export async function recoverPost(id: number) {
  return apiFetch<Post>(`/posts/recover/${id}`, { method: "POST" });
}

// Teachers
export async function listTeachers() {
  return apiFetch<Teacher[]>(`/teachers`);
}
export async function getTeacher(id: number) {
  return apiFetch<Teacher>(`/teachers/${id}`);
}
export async function createTeacher(input: CreateTeacherInput) {
  return apiFetch<Teacher>(`/teachers`, { method: "POST", body: JSON.stringify(input) });
}
export async function updateTeacher(id: number, input: UpdateTeacherInput) {
  return apiFetch<Teacher>(`/teachers/${id}`, { method: "PUT", body: JSON.stringify(input) });
}
export async function deleteTeacher(id: number) {
  await apiFetch(`/teachers/${id}`, { method: "DELETE" });
  return true;
}

// Students
export async function listStudents() {
  return apiFetch<Student[]>(`/students`);
}
export async function getStudent(id: number) {
  return apiFetch<Student>(`/students/${id}`);
}
export async function createStudent(input: CreateStudentInput) {
  return apiFetch<Student>(`/students`, { method: "POST", body: JSON.stringify(input) });
}
export async function updateStudent(id: number, input: UpdateStudentInput) {
  return apiFetch<Student>(`/students/${id}`, { method: "PUT", body: JSON.stringify(input) });
}
export async function deleteStudent(id: number) {
  await apiFetch(`/students/${id}`, { method: "DELETE" });
  return true;
}