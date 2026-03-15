import { LoginForm } from '../../components/auth/login-form';
import { useLoginForm } from '../../hooks/use-login-form';

export function LoginPage() {
  const {
    form,
    user,
    isLoading,
    errorMessage,
    updateField,
    handleSubmit,
  } = useLoginForm();

  return (
    <main className="login-page">
      <section className="login-card">
        <header className="login-card-header">
          <p className="brand">SCTec</p>
          <h2>Entrar na plataforma</h2>
          <p className="subtitle">
            Use suas credenciais para acessar o painel de gestao.
          </p>
        </header>

        <LoginForm
          email={form.email}
          password={form.password}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onEmailChange={(value) => updateField('email', value)}
          onPasswordChange={(value) => updateField('password', value)}
          onSubmit={handleSubmit}
        />

        {user ? (
          <p className="success-text">
            Login realizado como {user.name} ({user.role})
          </p>
        ) : null}

        <footer className="login-card-footer">
          <small>Ambiente protegido para usuarios autorizados.</small>
        </footer>
      </section>
    </main>
  );
}
