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
`;

export const StatusChip = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
  background: ${({ $active }) => ($active ? '#e7f7ec' : '#f2f4f7')};
  color: ${({ $active }) => ($active ? '#1f7f35' : '#5b6a7f')};
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
`;
