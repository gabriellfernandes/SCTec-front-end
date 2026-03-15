import type { LoginRequest, LoginResponse } from '../../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { message?: string | string[] }
      | null;

    const message = Array.isArray(payload?.message)
      ? payload?.message[0]
      : payload?.message;

    throw new Error(message ?? 'Falha ao realizar login');
  }

  return (await response.json()) as LoginResponse;
}
