export type PostStatus = "rascunho" | "publicado" | "excluido";

export type Comment = {
  id: number;
  post_id: number;
  user_id?: number | null;
  content: string;
  author: string;
  created_at: string;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
  author_email: string;
  user_id?: number | null;
  accepts_comments: boolean;
  status: PostStatus;
  created_at: string;
  updated_at: string;
  image?: string | null;
  comments?: Comment[];
};

export type CreatePostInput = {
  title: string;
  content: string;
  author: string;
  acceptsComments?: boolean;
};

export type UpdatePostInput = {
  title: string;
  content: string;
  author: string;
  acceptsComments?: boolean;
};
