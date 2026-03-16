import styled from 'styled-components';

export const PageContainer = styled.section`
  display: grid;
  gap: 14px;
`;

export const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  h2 {
    margin: 0;
    color: #1f3658;
    font-size: 1.15rem;
  }

  p {
    margin: 4px 0 0;
    color: #5d7394;
    font-size: 0.88rem;
  }
`;

export const BackButton = styled.button`
  height: 34px;
  border: 1px solid #cfdae8;
  border-radius: 8px;
  padding: 0 12px;
  background: #ffffff;
  color: #3f5f85;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
`;

export const FormCard = styled.form`
  display: grid;
  gap: 14px;
  background: #ffffff;
  border: 1px solid #dce5f2;
  border-radius: 12px;
  padding: 16px;
`;

export const Grid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (max-width: 780px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div`
  display: grid;
  gap: 8px;

  label {
    font-size: 0.82rem;
    font-weight: 700;
    color: #496285;
  }

  input,
  select {
    height: 36px;
    border: 1px solid #cfd9e8;
    border-radius: 8px;
    padding: 0 10px;
    background: #f9fbff;
    color: #1f3658;
  }
`;

export const StatusToggle = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.86rem;
  color: #47658a;

  input {
    accent-color: #2ca942;
  }
`;

export const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

export const GhostButton = styled.button`
  height: 34px;
  border: 1px solid #cfdae8;
  border-radius: 8px;
  padding: 0 12px;
  color: #3f5f85;
  background: #ffffff;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
`;

export const PrimaryButton = styled.button`
  height: 34px;
  border: none;
  border-radius: 8px;
  padding: 0 12px;
  color: #ffffff;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  background: linear-gradient(110deg, #2ca942 10%, #52b934 90%);

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
    background: linear-gradient(110deg, #95a7b0 10%, #b3c0c7 90%);
    color: #f4f8fa;
  }
`;

export const ErrorText = styled.p`
  margin: 0;
  border: 1px solid #fecaca;
  background: #fff1f2;
  color: #b91c1c;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 0.82rem;
`;

export const ContactsSection = styled.section<{ $disabled?: boolean }>`
  display: grid;
  gap: 12px;
  border: 1px solid #d6e2f1;
  border-radius: 12px;
  background:
    linear-gradient(180deg, rgba(248, 252, 255, 0.95) 0%, rgba(241, 248, 255, 0.95) 100%);
  padding: 14px;
  opacity: ${({ $disabled }) => ($disabled ? 0.72 : 1)};
`;

export const ContactsNotice = styled.p`
  margin: 0;
  border: 1px dashed #c8d9ee;
  border-radius: 10px;
  background: #f7fbff;
  color: #4f6e95;
  padding: 10px 12px;
  font-size: 0.82rem;
  line-height: 1.35;
`;

export const ContactsHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  h3 {
    margin: 0;
    font-size: 1rem;
    color: #1f3658;
  }

  p {
    margin: 2px 0 0;
    font-size: 0.78rem;
    color: #5a7395;
  }
`;

export const ContactsActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const ContactCard = styled.article`
  display: grid;
  gap: 12px;
  border: 1px solid #cfdeef;
  border-radius: 12px;
  background: #ffffff;
  padding: 12px;
  box-shadow: 0 8px 20px rgba(30, 60, 98, 0.08);
`;

export const ContactIdentity = styled.div`
  display: grid;
  gap: 3px;

  strong {
    color: #27476f;
    font-size: 0.9rem;
  }

  span {
    color: #56759b;
    font-size: 0.78rem;
  }

  span::before {
    content: 'Departamento: ';
    font-weight: 600;
    color: #47658d;
  }

  strong::before {
    content: 'Nome: ';
    font-weight: 600;
    color: #47658d;
  }
`;

export const ContactSummary = styled.div`
  display: grid;
  gap: 6px;
  border: 1px dashed #c9d9ed;
  border-radius: 10px;
  padding: 10px;
  background: #f8fbff;

  p {
    margin: 0;
    color: #4b688e;
    font-size: 0.8rem;
    line-height: 1.35;
  }

  .summary-list-group {
    display: grid;
    gap: 4px;
  }

  .summary-list-group > strong {
    color: #355d8d;
    font-size: 0.8rem;
  }

  .summary-list-group ul {
    margin: 0;
    padding-left: 16px;
    display: grid;
    gap: 3px;
  }

  .summary-list-group li {
    color: #4b688e;
    font-size: 0.79rem;
    line-height: 1.3;
    word-break: break-word;
  }
`;

export const ContactCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  strong {
    color: #3e5f86;
    font-size: 0.88rem;
    letter-spacing: 0.02em;
  }
`;

export const InlineRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;

  input {
    min-width: 0;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const SmallButton = styled.button`
  height: 31px;
  border: 1px solid #cfdae8;
  border-radius: 8px;
  padding: 0 12px;
  color: #3f5f85;
  background: #ffffff;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    border-color: #b9cbdf;
    background: #f6fbff;
  }
`;

export const DangerSmallButton = styled(SmallButton)`
  border-color: #f6c2c9;
  color: #b4232e;
  background: #fff4f6;
`;

export const EditContactButton = styled(SmallButton)`
  border-color: #b9d0eb;
  color: #2a5f95;
  background: #eff6ff;
`;

export const DangerSmallGhostButton = styled(GhostButton)`
  border-color: #f6c2c9;
  color: #b4232e;
  background: #fff4f6;
`;

export const ContactConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(15, 31, 52, 0.3);
  display: grid;
  place-items: center;
  padding: 16px;
`;

export const ContactConfirmCard = styled.div`
  width: min(420px, 100%);
  border: 1px solid #dce5f2;
  border-radius: 12px;
  background: #ffffff;
  padding: 14px;
  display: grid;
  gap: 10px;

  h4 {
    margin: 0;
    color: #1f3658;
    font-size: 0.96rem;
  }

  p {
    margin: 0;
    color: #5b7396;
    font-size: 0.84rem;
  }
`;

export const ContactConfirmActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;
