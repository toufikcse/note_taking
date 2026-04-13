export type UserRole = 'user' | 'admin';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  interests: string[];
  createdAt: Date;
  updatedAt: Date;
}
