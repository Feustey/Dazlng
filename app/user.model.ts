export interface IUser {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

export type User = IUser;
