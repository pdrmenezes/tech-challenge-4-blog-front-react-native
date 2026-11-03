export type Teacher = {
  id: number;
  name: string;
  email: string;
  subject: string;
};

export type Student = {
  id: number;
  name: string;
  email: string;
  course: string;
};

export type CreateTeacherInput = Omit<Teacher, "id">;
export type UpdateTeacherInput = Partial<Omit<Teacher, "id">>;

export type CreateStudentInput = Omit<Student, "id">;
export type UpdateStudentInput = Partial<Omit<Student, "id">>;