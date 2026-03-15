import styled from 'styled-components';

export const KpiGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(120px, 1fr));
  gap: 12px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(120px, 1fr));
  }
`;

export const KpiCard = styled.article`
  background: #ffffff;
  border: 1px solid #dce5f2;
  border-radius: 12px;
  padding: 8px 10px;
  min-height: 66px;
  max-height: 66px;
  display: grid;
  align-content: center;
`;

export const KpiHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;

  p {
    margin: 0;
    color: #5a6f90;
    font-size: 0.78rem;
  }
`;

export const KpiValue = styled.strong`
  display: block;
  margin-top: 2px;
  font-size: 1rem;
  color: #1f3658;
`;

export const PanelCard = styled.section`
  background: #ffffff;
  border: 1px solid #dce5f2;
  border-radius: 12px;
  min-height: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
`;

export const PanelHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #e8eef7;

  h2 {
    margin: 0;
    font-size: 1.08rem;
    color: #1f3658;
  }

  @media (max-width: 620px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const FiltersInline = styled.div`
  display: flex;
  gap: 8px;

  input,
  select {
    height: 34px;
    border: 1px solid #cfd9e8;
    border-radius: 8px;
    padding: 0 10px;
    background: #f9fbff;
  }

  input {
    min-width: 190px;
  }

  input:focus,
  select:focus {
    outline: 2px solid rgba(0, 176, 251, 0.2);
    border-color: #7fb5ea;
  }

  @media (max-width: 620px) {
    flex-direction: column;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 620px) {
    flex-direction: column;
    align-items: stretch;
  }
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
`;

export const TableWrap = styled.div`
  overflow-x: auto;
  overflow-y: auto;
  min-height: 0;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    text-align: left;
    padding: 12px 16px;
    border-bottom: 1px solid #edf2f8;
    font-size: 0.93rem;
  }

  th {
    background: #f7faff;
    color: #4e668a;
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  th[data-sortable='true'] {
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
  }

  th[data-sortable='true']:hover {
    background: #ecf3fd;
  }

  .sort-indicator {
    display: inline-block;
    min-width: 24px;
    margin-left: 6px;
    color: #2e5f93;
    font-weight: 800;
    font-size: 1.22rem;
    line-height: 1;
  }
`;

export const ActionsCell = styled.td`
  width: 96px;
`;

export const RowActions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const IconActionButton = styled.button<{ $danger?: boolean }>`
  width: 28px;
  height: 28px;
  border: 1px solid ${({ $danger }) => ($danger ? '#f5c3c8' : '#cfd9e8')};
  border-radius: 7px;
  background: ${({ $danger }) => ($danger ? '#fff5f6' : '#f8fbff')};
  color: ${({ $danger }) => ($danger ? '#b4232e' : '#3e5f86')};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;

  svg {
    width: 15px;
    height: 15px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
`;

export const StatusBadgeButton = styled.button<{ $active: boolean }>`
  height: 26px;
  border-radius: 999px;
  padding: 0 10px;
  border: 1px solid ${({ $active }) => ($active ? '#9cd7a8' : '#f6c2c9')};
  background: ${({ $active }) => ($active ? '#eaf8ed' : '#fff4f6')};
  color: ${({ $active }) => ($active ? '#1f7f35' : '#b4232e')};
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const ContactsSummaryButton = styled.button`
  height: 28px;
  border: 1px solid #c9dbf1;
  border-radius: 999px;
  padding: 0 10px;
  background: #f3f8ff;
  color: #2f5f94;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const ContactsList = styled.ul`
  margin: 0;
  padding-left: 16px;
  display: grid;
  gap: 10px;

  li {
    color: #47658c;
    font-size: 0.84rem;
    line-height: 1.35;
  }

  strong {
    color: #1f3658;
    font-size: 0.88rem;
  }

  small {
    display: block;
    margin-top: 2px;
    color: #5f789b;
    font-size: 0.78rem;
  }
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(13, 27, 48, 0.5);
`;

export const ModalCard = styled.div`
  width: 100%;
  max-width: 420px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #dce5f2;
  box-shadow: 0 20px 40px rgba(24, 44, 75, 0.2);
`;

export const ModalHeader = styled.header`
  padding: 14px 16px;
  border-bottom: 1px solid #e8eef7;

  h3 {
    margin: 0;
    font-size: 1rem;
    color: #1f3658;
  }
`;

export const ModalBody = styled.div`
  padding: 14px 16px;
  display: grid;
  gap: 8px;

  label {
    font-size: 0.82rem;
    font-weight: 700;
    color: #496285;
  }

  input {
    height: 36px;
    border: 1px solid #cfd9e8;
    border-radius: 8px;
    padding: 0 10px;
    background: #f9fbff;
  }

  select {
    height: 36px;
    border: 1px solid #cfd9e8;
    border-radius: 8px;
    padding: 0 10px;
    background: #f9fbff;
    color: #1f3658;
  }

  p {
    margin: 0;
    color: #405d83;
    font-size: 0.9rem;
  }
`;

export const ModalFooter = styled.footer`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px 16px;
`;

export const ModalError = styled.p`
  margin: 0;
  border: 1px solid #fecaca;
  background: #fff1f2;
  color: #b91c1c;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 0.82rem;
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

export const DangerButton = styled.button`
  height: 34px;
  border: none;
  border-radius: 8px;
  padding: 0 12px;
  color: #ffffff;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  background: linear-gradient(110deg, #d64251 10%, #bf3344 90%);
`;

export const TableState = styled.p`
  margin: 0;
  padding: 18px 16px;
  font-size: 0.9rem;
  color: #5b6f8f;
`;

export const TableFooter = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 16px;
  border-top: 1px solid #e8eef7;

  @media (max-width: 620px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const TableFooterMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  label {
    font-size: 0.78rem;
    color: #5b6f8f;
    font-weight: 600;
  }

  select {
    height: 30px;
    border: 1px solid #cfdae8;
    border-radius: 8px;
    background: #ffffff;
    color: #456189;
    padding: 0 10px;
    font-size: 0.78rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: #5b6f8f;
    font-size: 0.82rem;
  }

  p:first-child {
    font-weight: 700;
    color: #425f86;
  }

  @media (max-width: 620px) {
    width: 100%;
  }
`;

export const TablePagination = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  button {
    height: 30px;
    border: 1px solid #cfdae8;
    border-radius: 8px;
    background: #ffffff;
    color: #456189;
    padding: 0 10px;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
  }

  button.active {
    border-color: #2ca942;
    background: #eaf8ed;
    color: #1f7f35;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

export const Toast = styled.div<{ $type: 'success' | 'error' }>`
  position: fixed;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 60;
  border-radius: 10px;
  border: 1px solid
    ${({ $type }) => ($type === 'success' ? '#98e2ab' : '#fecaca')};
  background: ${({ $type }) => ($type === 'success' ? '#ecfdf3' : '#fff1f2')};
  color: ${({ $type }) => ($type === 'success' ? '#1f7f35' : '#b91c1c')};
  box-shadow: 0 8px 24px rgba(17, 34, 58, 0.14);
  padding: 10px 12px;
  min-width: 230px;
  max-width: 320px;
  font-size: 0.84rem;
  font-weight: 600;
  text-align: center;
`;
