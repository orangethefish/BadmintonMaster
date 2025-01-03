export interface UserModel {
  userId?: string;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  deleted?: boolean;
  dateCreated?: string;
  dateModified?: string;
  dateDeleted?: string | null;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    userId: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
} 