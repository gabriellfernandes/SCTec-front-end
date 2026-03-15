import type { ReactNode } from 'react';
import { useState } from 'react';

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  function toggleSidebar(): void {
    setIsSidebarOpen((current) => !current);
  }

  return (
    <div
      className={`admin-shell ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
    >
      <button
        type="button"
        className="sidebar-backdrop"
        onClick={toggleSidebar}
        aria-label="Fechar menu lateral"
      />

      <aside className="admin-sidebar">
        <div className="brand-block">
          <p className="brand-kicker">SCTec</p>
          <h1 className="sidebar-title">Painel</h1>
        </div>

        <nav className="admin-nav" aria-label="Navegacao principal">
          <a
            className="admin-nav-item active"
            href="#"
            aria-current="page"
            data-label="Empresas"
          >
            <span className="nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 20V8l8-4 8 4v12H4z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 20v-5h6v5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="nav-label">Empresas</span>
          </a>
          <a className="admin-nav-item" href="#" data-label="Municipios">
            <span className="nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 20V9h6v11M10 20V5h10v15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 9h2M14 13h2M14 17h2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <span className="nav-label">Municipios</span>
          </a>
          <a className="admin-nav-item" href="#" data-label="Segmentos">
            <span className="nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <span className="nav-label">Segmentos</span>
          </a>
          <a className="admin-nav-item" href="#" data-label="Contatos">
            <span className="nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path d="M5 19c0-3.1 3.1-5 7-5s7 1.9 7 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <span className="nav-label">Contatos</span>
          </a>
        </nav>
      </aside>

      <section className="admin-content-area">
        <header className="admin-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="sidebar-toggle"
              onClick={toggleSidebar}
              aria-label={isSidebarOpen ? 'Recolher menu lateral' : 'Abrir menu lateral'}
            >
              <span />
              <span />
              <span />
            </button>

            <div>
              <p className="topbar-overline">Area administrativa</p>
              <strong>Gestao de empresas</strong>
            </div>
          </div>

          <div>
            <button type="button" className="topbar-action">
              Novo cadastro
            </button>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </section>
    </div>
  );
}
