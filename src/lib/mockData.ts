import type { Student, Teacher } from "../types/people";
import type { Comment, Post } from "../types/posts";

export const MOCK_POSTS: Post[] = [
  {
    id: 1,
    title: "Boas vindas ao Blog",
    content:
      "Esse é o conteúdo completo do primeiro post. Aqui você pode escrever tudo o que quiser sobre o assunto abordado.",
    author: "João Silva",
    author_email: "joao@docente.com",
    accepts_comments: false,
    status: "publicado",
    image: "https://picsum.photos/seed/1/400/120",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Rascunho em andamento",
    content: "Conteúdo ainda em elaboração...",
    author: "João Silva",
    author_email: "joao@docente.com",
    accepts_comments: false,
    status: "rascunho",
    image: "https://picsum.photos/seed/2/400/120",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Importância da escrita",
    content:
      "A escrita permite que as pessoas compartilhem ideias, contem histórias e registrem informações para o futuro.",
    author: "Ana Pereira",
    author_email: "ana@docente.com",
    accepts_comments: false,
    status: "publicado",
    image: "https://picsum.photos/seed/3/400/120",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const MOCK_TEACHERS: Teacher[] = [
  {
    id: 1,
    name: "Ana Pereira",
    email: "ana@docente.com",
    role: "docente",
    handle: "@ana",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "João Silva",
    email: "joao@docente.com",
    role: "docente",
    handle: "@joao",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const MOCK_STUDENTS: Student[] = [
  {
    id: 1,
    name: "Maria Souza",
    email: "maria@discente.com",
    role: "discente",
    handle: "@maria",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Pedro Lima",
    email: "pedro@discente.com",
    role: "discente",
    handle: "@pedro",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 1,
    post_id: 1,
    user_id: 1,
    author: "@maria",
    content: "ótimo post!",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    post_id: 1,
    user_id: 2,
    author: "@pedro",
    content: "Muito bom!",
    created_at: new Date().toISOString(),
  },
];

export const MOCK_USERS = new Map([
  ["ana@docente.com", "prof1"],
  ["joao@docente.com", "prof2"],
  ["maria@discente.com", "discente1"],
  ["pedro@discente.com", "discente2"],
  ["admin@admin.com", "admin123"],
]);

export const MOCK_USER_NAMES: Record<string, string> = {
  "ana@docente.com": "Ana",
  "joao@docente.com": "João",
  "maria@discente.com": "Maria",
  "pedro@discente.com": "Pedro",
  "admin@admin.com": "Admin",
};
