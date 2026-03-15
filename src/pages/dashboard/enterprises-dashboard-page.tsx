import { AdminShell } from '../../components/layout/admin-shell';
import {
  FiltersInline,
  KpiCard,
  KpiGrid,
  KpiHead,
  KpiValue,
  PanelCard,
  PanelHeader,
  StatusChip,
  TableFooter,
  TableFooterMeta,
  TablePagination,
  TableWrap,
} from './enterprises-dashboard-page.styles';

const rows = [
  {
    name: 'Floripa Digital Hub',
    city: 'Florianopolis',
    segment: 'Tecnologia',
    status: 'Ativo',
  },
  {
    name: 'Vale Industria SC',
    city: 'Joinville',
    segment: 'Industria',
    status: 'Inativo',
  },
  {
    name: 'Comercio Forte Sul',
    city: 'Criciuma',
    segment: 'Comercio',
    status: 'Ativo',
  },
];

export function EnterprisesDashboardPage() {
  return (
    <AdminShell>
      <KpiGrid>
        <KpiCard>
          <KpiHead>
            <p>Total</p>
          </KpiHead>
          <KpiValue>128</KpiValue>
        </KpiCard>

        <KpiCard>
          <KpiHead>
            <p>Ativos</p>
          </KpiHead>
          <KpiValue>97</KpiValue>
        </KpiCard>

        <KpiCard>
          <KpiHead>
            <p>Inativos</p>
          </KpiHead>
          <KpiValue>31</KpiValue>
        </KpiCard>

        <KpiCard>
          <KpiHead>
            <p>Municipios</p>
          </KpiHead>
          <KpiValue>22</KpiValue>
        </KpiCard>
      </KpiGrid>

      <PanelCard>
        <PanelHeader>
          <h2>Empresas</h2>

          <FiltersInline>
            <input type="search" placeholder="Buscar por nome" />

            <select defaultValue="">
              <option value="">Todos os municipios</option>
              <option value="Florianopolis">Florianopolis</option>
              <option value="Joinville">Joinville</option>
              <option value="Criciuma">Criciuma</option>
            </select>

            <select defaultValue="">
              <option value="">Todos os segmentos</option>
              <option value="Tecnologia">Tecnologia</option>
              <option value="Industria">Industria</option>
              <option value="Comercio">Comercio</option>
            </select>

            <select defaultValue="">
              <option value="">Todos os status</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </FiltersInline>
        </PanelHeader>

        <TableWrap>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Municipio</th>
                <th>Segmento</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{row.city}</td>
                  <td>{row.segment}</td>
                  <td>
                    <StatusChip $active={row.status === 'Ativo'}>
                      {row.status}
                    </StatusChip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>

        <TableFooter>
          <TableFooterMeta>
            <label htmlFor="page-size">Itens por pagina</label>
            <select id="page-size" defaultValue="10">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <p>Mostrando 1-3 de 128 empresas</p>
          </TableFooterMeta>

          <TablePagination>
            <button type="button">Anterior</button>
            <button type="button" className="active">
              1
            </button>
            <button type="button">2</button>
            <button type="button">3</button>
            <button type="button">Proxima</button>
          </TablePagination>
        </TableFooter>
      </PanelCard>
    </AdminShell>
  );
}
