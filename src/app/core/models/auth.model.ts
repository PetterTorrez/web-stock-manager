import { USER_ROL } from '../enum/role.enum';

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
  role: USER_ROL.ROLE_ADMIN | USER_ROL.ROLE_ANONYMOUS;
  sub: string;
  exp: number;
}

export interface ApiResponse<T> {
  data: T;
}
