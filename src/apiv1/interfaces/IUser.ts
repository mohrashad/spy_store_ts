export interface IUser {
  id?: number;
  cuid?: string;
  name: string;
  email: string;
  password?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  roles?: any;
}
