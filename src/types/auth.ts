export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  active: boolean;
};

export type LoginResponse = {
  accessToken: string;
  expiresIn: string;
  user: AuthUser;
};
