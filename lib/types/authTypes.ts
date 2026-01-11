export interface LoginResponse {
  token: string;
  user?: {
    id: number;
    email: string;
    name?: string;
  };
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}
