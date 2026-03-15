import { LoginForm } from '../../components/auth/login-form';
import { useLoginForm } from '../../hooks/use-login-form';
import {
  Brand,
  LoginCard,
  LoginCardFooter,
  LoginCardHeader,
  LoginPageContainer,
  Subtitle,
  SuccessText,
  Title,
} from './login-page.styles';

type LoginPageProps = {
  onSuccess: () => void;
};

export function LoginPage({ onSuccess }: LoginPageProps) {
  const {
    form,
    user,
    isLoading,
    errorMessage,
    updateField,
    handleSubmit,
  } = useLoginForm(onSuccess);

  return (
    <LoginPageContainer>
      <LoginCard>
        <LoginCardHeader>
          <Brand>SCTec</Brand>
          <Title>Entrar na plataforma</Title>
          <Subtitle>
            Use suas credenciais para acessar o painel de gestao.
          </Subtitle>
        </LoginCardHeader>

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
          <SuccessText>
            Login realizado como {user.name} ({user.role})
          </SuccessText>
        ) : null}

        <LoginCardFooter>
          <small>Ambiente protegido para usuarios autorizados.</small>
        </LoginCardFooter>
      </LoginCard>
    </LoginPageContainer>
  );
}
