export interface LoginDto {
  username: string;
  password: string;
}

export interface CredentialDto {
  accessToken: string;
}

export interface JwtPayload {
  sub: string;
  username: string;
  name: string;
}

export interface AuthUser {
  id: string;
  username: string;
  name: string;
}
