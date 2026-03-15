import type { FormEventHandler } from 'react';
import { useState } from 'react';
import {
  ErrorToast,
  FieldBlock,
  Form,
  PasswordField,
  SubmitButton,
  TogglePasswordButton,
} from './login-form.styles';

type LoginFormProps = {
  email: string;
  password: string;
  isLoading: boolean;
  errorMessage: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export function LoginForm({
  email,
  password,
  isLoading,
  errorMessage,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Form onSubmit={onSubmit}>
      <FieldBlock>
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="nome@sctec.com"
          autoComplete="email"
          inputMode="email"
          required
        />
      </FieldBlock>

      <FieldBlock>
        <label htmlFor="password">Senha</label>
        <PasswordField>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            placeholder="Digite sua senha"
            autoComplete="current-password"
            minLength={8}
            required
          />
          <TogglePasswordButton
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? 'Ocultar senha' : 'Visualizar senha'}
            title={showPassword ? 'Ocultar senha' : 'Visualizar senha'}
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M3 5l16 14M10.7 10.9A3 3 0 0013 14a3 3 0 001.8-.6M6.6 8.2A12 12 0 0121 12a12 12 0 01-4 3.9M9.9 5.3A12 12 0 0112 5c5 0 9 3.2 10 7-0.4 1.5-1.3 2.9-2.5 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7-10-7-10-7z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            )}
          </TogglePasswordButton>
        </PasswordField>
      </FieldBlock>

      {errorMessage ? (
        <ErrorToast role="alert" aria-live="polite">
          {errorMessage}
        </ErrorToast>
      ) : null}

      <SubmitButton type="submit" disabled={isLoading}>
        {isLoading ? 'Entrando...' : 'Entrar'}
      </SubmitButton>
    </Form>
  );
}
