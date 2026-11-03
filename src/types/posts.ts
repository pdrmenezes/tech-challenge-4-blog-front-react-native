export type PostStatus = "rascunho" | "publicado" | "excluido";

export type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
  author_email: string;
  status: PostStatus;
  created_at: string;
  updated_at: string;
};

export type CreatePostInput = Pick<Post, "title" | "content" | "author">;

export type UpdatePostInput = Partial<Pick<Post, "title" | "content" | "author">>;