import { AdminShell } from '../../components/layout/admin-shell';

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
      <section className="kpi-grid">
        <article className="kpi-card">
          <div className="kpi-head">
            <p>Total</p>
          </div>
          <strong>128</strong>
        </article>
        <article className="kpi-card">
          <div className="kpi-head">
            <p>Ativos</p>
          </div>
          <strong>97</strong>
        </article>
        <article className="kpi-card">
          <div className="kpi-head">
            <p>Inativos</p>
          </div>
          <strong>31</strong>
        </article>
        <article className="kpi-card">
          <div className="kpi-head">
            <p>Municipios</p>
          </div>
          <strong>22</strong>
        </article>
      </section>

      <section className="panel-card">
        <header className="panel-header">
          <h2>Empresas</h2>
          <div className="filters-inline">
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
          </div>
        </header>

        <div className="table-wrap">
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
                    <span
                      className={`status-chip ${
                        row.status === 'Ativo' ? 'active' : 'inactive'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="table-footer">
          <div className="table-footer-meta">
            <label htmlFor="page-size">Itens por pagina</label>
            <select id="page-size" defaultValue="10">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <p>Mostrando 1-3 de 128 empresas</p>
          </div>

          <div className="table-pagination">
            <button type="button">Anterior</button>
            <button type="button" className="active">
              1
            </button>
            <button type="button">2</button>
            <button type="button">3</button>
            <button type="button">Proxima</button>
          </div>
        </footer>
      </section>
    </AdminShell>
  );
}
