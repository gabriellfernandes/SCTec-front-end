import { useState } from 'react';
import type { FormEvent } from 'react';
import { login } from '../services/api/auth-api';
import type { AuthUser } from '../types/auth';

type LoginState = {
  email: string;
  password: string;
};

const INITIAL_STATE: LoginState = {
  email: '',
  password: '',
};

export function useLoginForm() {
  const [form, setForm] = useState<LoginState>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState<AuthUser | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await login({
        email: form.email,
        password: form.password,
      });

      localStorage.setItem('sctec.accessToken', result.accessToken);
      setUser(result.user);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro inesperado no login';
      setErrorMessage(message);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  function updateField(field: keyof LoginState, value: string): void {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return {
    form,
    user,
    isLoading,
    errorMessage,
    updateField,
    handleSubmit,
  };
}
