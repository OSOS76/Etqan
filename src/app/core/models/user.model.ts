export interface User {
  name: string;
  email: string;
  phone: string;
  role: 'student' | 'teacher';

  // Teacher data
  subject?: string;
  bio?: string;
  image?: string;
  experienceYears?: number;
  grades?: string[];

}
