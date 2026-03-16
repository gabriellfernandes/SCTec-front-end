import styled from 'styled-components';

export const Form = styled.form`
  padding: 16px 24px 10px;
  display: grid;
  gap: 14px;

  @media (max-width: 520px) {
    padding-left: 16px;
    padding-right: 16px;
  }
`;

export const FieldBlock = styled.div`
  display: grid;
  gap: 8px;

  label {
    font-weight: 700;
    font-size: 0.86rem;
    letter-spacing: 0.01em;
    color: #344863;
  }

  input {
    border: 1px solid #d8dee8;
    border-radius: 8px;
    height: 42px;
    padding: 0 12px;
    font: inherit;
    background: #fbfdff;
  }

  input:focus {
    outline: 2px solid rgba(15, 118, 110, 0.2);
    border-color: #0f766e;
  }
`;

export const PasswordField = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  input {
    width: 100%;
    padding-right: 42px;
  }
`;

export const TogglePasswordButton = styled.button`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 0;
  background: transparent;
  color: #3a5f87;
  display: grid;
  place-items: center;
  cursor: pointer;
  padding: 0;
  line-height: 0;
  transition: color 120ms ease;

  svg {
    width: 22px;
    height: 22px;
  }

  &:hover {
    color: #2b4c70;
  }
`;

export const ErrorToast = styled.div`
  margin: -2px 0 0;
  border: 1px solid #fecaca;
  background: #fff1f2;
  color: #b91c1c;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 0.86rem;
  font-weight: 500;
`;

export const SubmitButton = styled.button`
  margin-top: 2px;
  height: 42px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(110deg, #2ca942 15.84%, #55b13a 54.76%, #52b934 86.61%);
  color: #ffffff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 120ms ease;

  &:hover {
    background: linear-gradient(110deg, #1f8832 15.84%, #27993b 54.76%, #2ca942 86.61%);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;
