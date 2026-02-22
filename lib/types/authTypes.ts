export interface LoginResponse {
  token: string;
  refresh_token?: string;
  user?: {
    id: number;
    email: string;
    name?: string;
  };
  workspaces?: {
    subdomain: string;
    name: string;
  }[];
  isSystemAdmin?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface RefreshTokenResponse {
  data: {
    token: string;
    refresh_token: string;
  };
}
