import styled from 'styled-components';

export const LoginPageContainer = styled.main`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;

  @media (max-width: 520px) {
    padding: 16px;
  }
`;

export const LoginCard = styled.section`
  width: 100%;
  max-width: 460px;
  border: 1px solid #d8dee8;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 14px 34px rgba(69, 42, 124, 0.1);
  overflow: hidden;

  @media (max-width: 520px) {
    border-radius: 12px;
  }
`;

export const LoginCardHeader = styled.header`
  padding: 24px 24px 16px;
  border-bottom: 1px solid #e5ebf3;
  background: linear-gradient(120deg, #ffffff 0%, #f7fbff 100%);

  @media (max-width: 520px) {
    padding-left: 16px;
    padding-right: 16px;
  }
`;

export const Brand = styled.p`
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #303030;
  font-size: 0.8rem;
  font-weight: 700;
`;

export const Title = styled.h2`
  margin: 10px 0 4px;
  font-family: var(--font-heading);
  font-size: 1.56rem;
  line-height: 1.1;

  @media (max-width: 520px) {
    font-size: 1.34rem;
  }
`;

export const Subtitle = styled.p`
  margin: 0;
  color: rgba(0, 0, 0, 0.7);
  font-size: 0.95rem;
`;

export const SuccessText = styled.p`
  margin: 8px 24px 12px;
  color: #166534;
  font-weight: 600;
  font-size: 0.9rem;

  @media (max-width: 520px) {
    padding-left: 16px;
    padding-right: 16px;
  }
`;

export const LoginCardFooter = styled.footer`
  padding: 12px 24px 18px;
  border-top: 1px solid #e5ebf3;

  small {
    color: #6b7d96;
    font-size: 0.78rem;
  }

  @media (max-width: 520px) {
    padding-left: 16px;
    padding-right: 16px;
  }
`;
