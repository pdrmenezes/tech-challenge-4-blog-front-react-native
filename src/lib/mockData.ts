import type { Post } from "../types/posts";
import type { Student, Teacher } from "../types/people";

export const MOCK_POSTS: Post[] = [
  {
    id: 1,
    title: "Bem-vindo ao Blog",
    content:
      "Esse é o conteúdo completo do primeiro post. Aqui você pode escrever tudo o que quiser sobre o assunto abordado.",
    author: "João Silva",
    author_email: "joao@docente.com",
    status: "publicado",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Rascunho em andamento",
    content: "Conteúdo ainda em elaboração...",
    author: "João Silva",
    author_email: "joao@docente.com",
    status: "rascunho",
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
    status: "publicado",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const MOCK_TEACHERS: Teacher[] = [
  { id: 1, name: "Ana Pereira", email: "ana@docente.com", subject: "Português" },
  { id: 2, name: "João Silva", email: "joao@docente.com", subject: "Matemática" },
];

export const MOCK_STUDENTS: Student[] = [
  { id: 1, name: "Maria Souza", email: "maria@discente.com", course: "Letras" },
  { id: 2, name: "Pedro Lima", email: "pedro@discente.com", course: "Engenharia" },
];

export const MOCK_USERS = new Map([
  ["ana@docente.com", "prof1"],
  ["joao@docente.com", "prof2"],
  ["maria@discente.com", "discente1"],
  ["pedro@discente.com", "discente2"],
]);