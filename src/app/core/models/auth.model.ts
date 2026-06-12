export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  name: string;
  email: string;
  token: string;
  role: string;
}

export interface UserTokenPayload {
  userId: number;
  role: 'ROLE_ADMIN' | 'ROLE_ANONYMOUS';
  sub: string;
  exp: number;
}
