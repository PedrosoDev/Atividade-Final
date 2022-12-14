export type TResponseClassesDetails = {
  id: string;
  code: string;
  slug: string;
  name: string;
  users: {
    user: {
      id: string;
      name: string;
      email: string;
    };
    role: "TEACHER" | "STUDENT";
  }[];
  posts: {
    id: string;
    title: string;
    slug: string;
    content: string;
  }[];
  teacherName: string;
};
