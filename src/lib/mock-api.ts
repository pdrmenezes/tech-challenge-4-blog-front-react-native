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
  PostStatus,
  UpdatePostInput,
} from "../types/posts";
import {
  MOCK_POSTS,
  MOCK_STUDENTS,
  MOCK_TEACHERS,
  MOCK_USER_NAMES,
  MOCK_USERS,
} from "./mockData";

const DELAY_MS = 300;

function delay() {
  return new Promise((resolve) => setTimeout(resolve, DELAY_MS));
}

function nextId<T extends { id: number }>(items: T[]): number {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

let posts: Post[] = [...MOCK_POSTS];
let comments: Comment[] = [];
let teachers: Teacher[] = [...MOCK_TEACHERS];
let students: Student[] = [...MOCK_STUDENTS];
let users = new Map<string, string>(MOCK_USERS);

export async function mockListPosts() {
  await delay();
  return [...posts];
}

export async function mockSearchPosts(params: { q?: string }) {
  await delay();
  const term = (params.q ?? "").toLowerCase().trim();
  if (!term) return [...posts.filter((p) => p.status === "publicado")];
  return posts.filter(
    (p) =>
      (p.title.toLowerCase().includes(term) ||
        p.content.toLowerCase().includes(term)) &&
      p.status === "publicado",
  );
}

export async function mockGetPost(id: number): Promise<Post> {
  await delay();
  const post = posts.find((p) => p.id === id);
  if (!post) throw new Error("Post não encontrado.");
  return { ...post, comments: comments.filter((c) => c.post_id === id) };
}

export async function mockCreatePost(input: CreatePostInput): Promise<Post> {
  await delay();
  const now = new Date().toISOString();
  const post: Post = {
    id: nextId(posts),
    title: input.title,
    content: input.content,
    author: input.author,
    author_email: "",
    user_id: null,
    accepts_comments: input.acceptsComments ?? false,
    status: "rascunho",
    created_at: now,
    updated_at: now,
    image: null,
    comments: [],
  };
  posts.unshift(post);
  return post;
}

export async function mockUpdatePost(
  id: number,
  input: UpdatePostInput,
): Promise<Post> {
  await delay();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Post não encontrado.");
  const updated: Post = {
    ...posts[index],
    title: input.title ?? posts[index].title,
    content: input.content ?? posts[index].content,
    author: input.author ?? posts[index].author,
    accepts_comments: input.acceptsComments ?? posts[index].accepts_comments,
    updated_at: new Date().toISOString(),
  };
  posts[index] = updated;
  return updated;
}

export async function mockTogglePostStatus(id: number): Promise<Post> {
  await delay();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Post não encontrado.");
  const current: PostStatus = posts[index].status;
  const next: PostStatus =
    current === "publicado"
      ? "rascunho"
      : current === "rascunho"
        ? "publicado"
        : current;
  posts[index] = {
    ...posts[index],
    status: next,
    updated_at: new Date().toISOString(),
  };
  return posts[index];
}

export async function mockDeletePost(id: number): Promise<Post> {
  await delay();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Post não encontrado.");
  posts[index] = {
    ...posts[index],
    status: "excluido",
    updated_at: new Date().toISOString(),
  };
  return posts[index];
}

export async function mockRecoverPost(id: number): Promise<Post> {
  await delay();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Post não encontrado.");
  posts[index] = {
    ...posts[index],
    status: "rascunho",
    updated_at: new Date().toISOString(),
  };
  return posts[index];
}

export async function mockCreateComment(
  postId: number,
  content: string,
): Promise<Comment> {
  await delay();
  const post = posts.find((p) => p.id === postId);
  if (!post) throw new Error("Post não encontrado.");
  if (!post.accepts_comments)
    throw new Error("Este post não aceita comentários.");
  const now = new Date().toISOString();
  const comment: Comment = {
    id: nextId(comments),
    post_id: postId,
    user_id: null,
    content,
    author: "Usuário",
    created_at: now,
  };
  comments.push(comment);
  return comment;
}

export async function mockListTeachers(): Promise<Teacher[]> {
  await delay();
  return [...teachers];
}

export async function mockGetTeacher(id: number): Promise<Teacher> {
  await delay();
  const teacher = teachers.find((t) => t.id === id);
  if (!teacher) throw new Error("Professor não encontrado.");
  return teacher;
}

export async function mockCreateTeacher(
  input: CreateTeacherInput,
): Promise<Teacher> {
  await delay();
  if (teachers.some((t) => t.email === input.email)) {
    throw new Error("E-mail já cadastrado.");
  }
  const now = new Date().toISOString();
  const teacher: Teacher = {
    id: nextId(teachers),
    name: input.name,
    email: input.email,
    role: "docente",
    handle: input.handle ?? null,
    created_at: now,
    updated_at: now,
  };
  teachers.push(teacher);
  users.set(input.email, input.password ?? "");
  return teacher;
}

export async function mockUpdateTeacher(
  id: number,
  input: UpdateTeacherInput,
): Promise<Teacher> {
  await delay();
  const index = teachers.findIndex((t) => t.id === id);
  if (index === -1) throw new Error("Professor não encontrado.");
  const updated: Teacher = {
    ...teachers[index],
    name: input.name ?? teachers[index].name,
    email: input.email ?? teachers[index].email,
    handle: input.handle ?? teachers[index].handle,
    updated_at: new Date().toISOString(),
  };
  teachers[index] = updated;
  if (input.email && input.email !== teachers[index].email) {
    users.delete(teachers[index].email);
    users.set(input.email, teachers[index].email.includes("@") ? "" : "");
  }
  if (input.password) {
    users.set(updated.email, input.password);
  }
  return updated;
}

export async function mockDeleteTeacher(id: number): Promise<boolean> {
  await delay();
  const index = teachers.findIndex((t) => t.id === id);
  if (index === -1) return false;
  const removed = teachers.splice(index, 1)[0];
  users.delete(removed.email);
  return true;
}

export async function mockListStudents(): Promise<Student[]> {
  await delay();
  return [...students];
}

export async function mockGetStudent(id: number): Promise<Student> {
  await delay();
  const student = students.find((s) => s.id === id);
  if (!student) throw new Error("Aluno não encontrado.");
  return student;
}

export async function mockCreateStudent(
  input: CreateStudentInput,
): Promise<Student> {
  await delay();
  if (students.some((s) => s.email === input.email)) {
    throw new Error("E-mail já cadastrado.");
  }
  const now = new Date().toISOString();
  const student: Student = {
    id: nextId(students),
    name: input.name,
    email: input.email,
    role: "discente",
    handle: input.handle,
    created_at: now,
    updated_at: now,
  };
  students.push(student);
  users.set(input.email, input.password ?? "");
  return student;
}

export async function mockUpdateStudent(
  id: number,
  input: UpdateStudentInput,
): Promise<Student> {
  await delay();
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) throw new Error("Aluno não encontrado.");
  const updated: Student = {
    ...students[index],
    name: input.name ?? students[index].name,
    email: input.email ?? students[index].email,
    handle: input.handle ?? students[index].handle,
    updated_at: new Date().toISOString(),
  };
  students[index] = updated;
  if (input.password) {
    users.set(updated.email, input.password);
  }
  return updated;
}

export async function mockDeleteStudent(id: number): Promise<boolean> {
  await delay();
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return false;
  const removed = students.splice(index, 1)[0];
  users.delete(removed.email);
  return true;
}

export async function mockLogin(
  email: string,
  password: string,
): Promise<boolean> {
  await delay();
  return users.get(email) === password;
}

export function mockUserName(email: string): string {
  return MOCK_USER_NAMES[email] ?? email.split("@")[0] ?? email;
}

export function mockResetData(): void {
  posts = [...MOCK_POSTS];
  comments = [];
  teachers = [...MOCK_TEACHERS];
  students = [...MOCK_STUDENTS];
  users = new Map<string, string>(MOCK_USERS);
}
