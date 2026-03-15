import type { ReactNode } from 'react';
import { useState } from 'react';
import {
  BrandBlock,
  BrandKicker,
  Content,
  ContentArea,
  LogoutButton,
  Nav,
  NavIcon,
  NavItem,
  NavLabel,
  Shell,
  Sidebar,
  SidebarBackdrop,
  SidebarFooter,
  SidebarTitle,
  SidebarToggle,
  Topbar,
  TopbarAction,
  TopbarLeft,
  TopbarOverline,
  UserIdentity,
} from './admin-shell.styles';

type AdminShellProps = {
  activeModule: 'companies' | 'segments';
  onChangeModule: (module: 'companies' | 'segments') => void;
  onCreateClick?: () => void;
  canCreate?: boolean;
  userName?: string;
  userRole?: 'admin' | 'editor' | 'viewer' | null;
  onLogout?: () => void;
  children: ReactNode;
};

export function AdminShell({
  activeModule,
  onChangeModule,
  onCreateClick,
  canCreate = true,
  userName,
  userRole,
  onLogout,
  children,
}: AdminShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  function toggleSidebar(): void {
    setIsSidebarOpen((current) => !current);
  }

  return (
    <Shell $sidebarOpen={isSidebarOpen}>
      <SidebarBackdrop
        type="button"
        $visible={isSidebarOpen}
        onClick={toggleSidebar}
        aria-label="Fechar menu lateral"
      />

      <Sidebar $sidebarOpen={isSidebarOpen}>
        <BrandBlock $sidebarOpen={isSidebarOpen}>
          <BrandKicker>SCTec</BrandKicker>
          <SidebarTitle $hidden={!isSidebarOpen}>Painel</SidebarTitle>
        </BrandBlock>

        <Nav aria-label="Navegacao principal">
          <NavItem
            type="button"
            $active={activeModule === 'companies'}
            $collapsed={!isSidebarOpen}
            aria-current={activeModule === 'companies' ? 'page' : undefined}
            data-label="Empresas"
            onClick={() => onChangeModule('companies')}
          >
            <NavIcon aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 20V8l8-4 8 4v12H4z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 20v-5h6v5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </NavIcon>
            <NavLabel $hidden={!isSidebarOpen}>Empresas</NavLabel>
          </NavItem>

          <NavItem type="button" $collapsed={!isSidebarOpen} data-label="Municipios">
            <NavIcon aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 20V9h6v11M10 20V5h10v15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 9h2M14 13h2M14 17h2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </NavIcon>
            <NavLabel $hidden={!isSidebarOpen}>Municipios</NavLabel>
          </NavItem>

          <NavItem
            type="button"
            $active={activeModule === 'segments'}
            $collapsed={!isSidebarOpen}
            aria-current={activeModule === 'segments' ? 'page' : undefined}
            data-label="Segmentos"
            onClick={() => onChangeModule('segments')}
          >
            <NavIcon aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </NavIcon>
            <NavLabel $hidden={!isSidebarOpen}>Segmentos</NavLabel>
          </NavItem>

          <NavItem type="button" $collapsed={!isSidebarOpen} data-label="Contatos">
            <NavIcon aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path d="M5 19c0-3.1 3.1-5 7-5s7 1.9 7 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </NavIcon>
            <NavLabel $hidden={!isSidebarOpen}>Contatos</NavLabel>
          </NavItem>
        </Nav>

        <SidebarFooter $sidebarOpen={isSidebarOpen}>
          <UserIdentity $sidebarOpen={isSidebarOpen}>
            <strong>{userName ?? 'Usuario'}</strong>
            <span>{userRole ?? 'perfil'}</span>
          </UserIdentity>

          <LogoutButton
            type="button"
            $collapsed={!isSidebarOpen}
            onClick={onLogout}
            aria-label="Sair da conta"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M15 4h4a1 1 0 011 1v14a1 1 0 01-1 1h-4M10 17l5-5-5-5M15 12H4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Sair</span>
          </LogoutButton>
        </SidebarFooter>
      </Sidebar>

      <ContentArea>
        <Topbar>
          <TopbarLeft>
            <SidebarToggle
              type="button"
              onClick={toggleSidebar}
              aria-label={isSidebarOpen ? 'Recolher menu lateral' : 'Abrir menu lateral'}
            >
              <span />
              <span />
              <span />
            </SidebarToggle>

            <div>
              <TopbarOverline>Area administrativa</TopbarOverline>
              <strong>
                {activeModule === 'segments'
                  ? 'Gestao de segmentos'
                  : 'Gestao de empresas'}
              </strong>
            </div>
          </TopbarLeft>

          <div>
            <TopbarAction type="button" onClick={onCreateClick} disabled={!canCreate}>
              Novo cadastro
            </TopbarAction>
          </div>
        </Topbar>

        <Content>{children}</Content>
      </ContentArea>
    </Shell>
  );
}
