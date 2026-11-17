export type UserRole = "docente" | "discente" | "admin";

export type Teacher = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  handle: string | null;
  created_at: string;
  updated_at: string;
};

export type Student = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  handle: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateTeacherInput = {
  name: string;
  email: string;
  password: string;
  handle?: string | null;
};

export type UpdateTeacherInput = Partial<{
  name: string;
  email: string;
  password: string;
  handle: string | null;
}>;

export type CreateStudentInput = {
  name: string;
  email: string;
  password: string;
  handle: string;
};

export type UpdateStudentInput = Partial<{
  name: string;
  email: string;
  password: string;
  handle: string | null;
}>;
