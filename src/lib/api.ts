import Constants from "expo-constants";
import type {
  CreateStudentInput,
  CreateTeacherInput,
  Student,
  Teacher,
  UpdateStudentInput,
  UpdateTeacherInput,
} from "../types/people";
import type {
  Comment,
  CreatePostInput,
  Post,
  UpdatePostInput,
} from "../types/posts";
import { getAuth } from "./storage";

const API_BASE_URL = "http://localhost:3001";

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

function isMockDataEnabled(): boolean {
  if (
    typeof process !== "undefined" &&
    process.env?.EXPO_PUBLIC_MOCK_DATA === "true"
  ) {
    return true;
  }
  try {
    return Constants.expoConfig?.extra?.MOCK_DATA === true;
  } catch {
    return false;
  }
}

const USE_MOCK = isMockDataEnabled();

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

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Basic ${token}` } : {}),
      ...options.headers,
    },
  });
  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const body = isJson ? await response.json().catch(() => null) : null;
  if (!response.ok) {
    const message =
      (body &&
        typeof body === "object" &&
        "error" in body &&
        (body as any).error) ||
      `Erro na requisição (${response.status})`;
    throw new ApiError(message, response.status);
  }
  return body as T;
}

/**
 * Posts
 */

export async function listPosts(params: ListPostsParams = {}) {
  if (USE_MOCK) {
    const all = await import("./mock-api").then((m) => m.mockListPosts());
    const limit = params.limit ?? 50;
    const offset = params.offset ?? 0;
    return all.slice(offset, offset + limit);
  }
  const query = buildQuery({ limit: params.limit, offset: params.offset });
  return apiFetch<Post[]>(`/posts${query}`);
}

export async function searchPosts(params: SearchPostsParams = {}) {
  if (USE_MOCK) {
    return import("./mock-api").then((m) => m.mockSearchPosts(params));
  }
  const query = buildQuery({
    q: params.q,
    limit: params.limit,
    offset: params.offset,
  });
  return apiFetch<Post[]>(`/posts/search${query}`);
}

export async function getPost(id: number) {
  if (USE_MOCK) {
    return import("./mock-api").then((m) => m.mockGetPost(id));
  }
  return apiFetch<Post>(`/posts/${id}`);
}

export async function createPost(input: CreatePostInput) {
  if (USE_MOCK) {
    return import("./mock-api").then((m) => m.mockCreatePost(input));
  }
  return apiFetch<Post>(`/posts`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updatePost(id: number, input: UpdatePostInput) {
  if (USE_MOCK) {
    return import("./mock-api").then((m) => m.mockUpdatePost(id, input));
  }
  return apiFetch<Post>(`/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function togglePostStatus(id: number) {
  if (USE_MOCK) {
    return import("./mock-api").then((m) => m.mockTogglePostStatus(id));
  }
  return apiFetch<Post>(`/posts/status/${id}`, { method: "PUT" });
}

export async function deletePost(id: number) {
  if (USE_MOCK) {
    return import("./mock-api").then((m) => m.mockDeletePost(id));
  }
  return apiFetch<Post>(`/posts/${id}`, { method: "DELETE" });
}

export async function recoverPost(id: number) {
  if (USE_MOCK) {
    return import("./mock-api").then((m) => m.mockRecoverPost(id));
  }
  return apiFetch<Post>(`/posts/recover/${id}`, { method: "POST" });
}

export async function createComment(postId: number, content: string) {
  if (USE_MOCK) {
    return import("./mock-api").then((m) =>
      m.mockCreateComment(postId, content),
    );
  }
  return apiFetch<Comment>(`/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

/**
 * Docentes
 */

export async function listTeachers() {
  if (USE_MOCK) {
    return import("./mock-api").then((m) => m.mockListTeachers());
  }
  return apiFetch<Teacher[]>(`/users/teachers`);
}
export async function getTeacher(id: number) {
  if (USE_MOCK) {
    return import("./mock-api").then((m) => m.mockGetTeacher(id));
  }
  return apiFetch<Teacher>(`/users/teachers/${id}`);
}
export async function createTeacher(input: CreateTeacherInput) {
  if (USE_MOCK) {
    return import("./mock-api").then((m) => m.mockCreateTeacher(input));
  }
  return apiFetch<Teacher>(`/users/teachers`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}
export async function updateTeacher(id: number, input: UpdateTeacherInput) {
  if (USE_MOCK) {
    return import("./mock-api").then((m) => m.mockUpdateTeacher(id, input));
  }
  return apiFetch<Teacher>(`/users/teachers/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
export async function deleteTeacher(id: number) {
  if (USE_MOCK) {
    return import("./mock-api").then((m) => m.mockDeleteTeacher(id));
  }
  await apiFetch(`/users/teachers/${id}`, { method: "DELETE" });
  return true;
}

/**
 * Discentes
 */

export async function listStudents() {
  if (USE_MOCK) {
    return import("./mock-api").then((m) => m.mockListStudents());
  }
  return apiFetch<Student[]>(`/users/students`);
}
export async function getStudent(id: number) {
  if (USE_MOCK) {
    return import("./mock-api").then((m) => m.mockGetStudent(id));
  }
  return apiFetch<Student>(`/users/students/${id}`);
}
export async function createStudent(input: CreateStudentInput) {
  if (USE_MOCK) {
    return import("./mock-api").then((m) => m.mockCreateStudent(input));
  }
  return apiFetch<Student>(`/users/students`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}
export async function updateStudent(id: number, input: UpdateStudentInput) {
  if (USE_MOCK) {
    return import("./mock-api").then((m) => m.mockUpdateStudent(id, input));
  }
  return apiFetch<Student>(`/users/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
export async function deleteStudent(id: number) {
  if (USE_MOCK) {
    return import("./mock-api").then((m) => m.mockDeleteStudent(id));
  }
  await apiFetch(`/users/students/${id}`, { method: "DELETE" });
  return true;
}
