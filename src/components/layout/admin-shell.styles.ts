import styled, { css } from 'styled-components';

export const Shell = styled.div<{ $sidebarOpen: boolean }>`
  min-height: 100vh;
  display: grid;
  grid-template-columns: ${({ $sidebarOpen }) =>
    $sidebarOpen ? '250px minmax(0, 1fr)' : '78px minmax(0, 1fr)'};
  background: ${({ theme }) => theme.colors.surfaceApp};
  transition: grid-template-columns 180ms ease;
  position: relative;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const SidebarBackdrop = styled.button<{ $visible: boolean }>`
  display: none;

  @media (max-width: 980px) {
    ${({ $visible }) =>
      $visible &&
      css`
        display: block;
        position: fixed;
        inset: 0;
        z-index: 10;
        border: none;
        background: rgba(17, 34, 58, 0.38);
      `}
  }
`;

export const Sidebar = styled.aside<{ $sidebarOpen: boolean }>`
  background: ${({ theme }) => theme.colors.sidebarBg};
  color: ${({ theme }) => theme.colors.textSidebarStrong};
  padding: ${({ $sidebarOpen }) => ($sidebarOpen ? '26px 18px' : '26px 10px')};
  border-right: 1px solid ${({ theme }) => theme.colors.sidebarBorder};
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  @media (max-width: 980px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: min(280px, 82vw);
    border-bottom: none;
    z-index: 20;
    transform: ${({ $sidebarOpen }) =>
      $sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform 180ms ease;
    padding: 26px 18px;
  }
`;

export const BrandBlock = styled.div<{ $sidebarOpen: boolean }>`
  padding: ${({ $sidebarOpen }) => ($sidebarOpen ? '6px 10px 16px' : '6px')};
  border-bottom: 1px solid rgba(231, 238, 248, 0.2);
  margin-bottom: 20px;
`;

export const BrandKicker = styled.p`
  margin: 0;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #90b5e6;
  font-weight: 700;
`;

export const SidebarTitle = styled.h1<{ $hidden: boolean }>`
  margin: 6px 0 0;
  font-size: 1.4rem;
  color: #ffffff;
  white-space: nowrap;
  display: ${({ $hidden }) => ($hidden ? 'none' : 'block')};

  @media (max-width: 980px) {
    display: block;
  }
`;

export const Nav = styled.nav`
  display: grid;
  gap: 6px;
`;

export const SidebarFooter = styled.footer<{ $sidebarOpen: boolean }>`
  margin-top: auto;
  border-top: 1px solid rgba(231, 238, 248, 0.2);
  padding: ${({ $sidebarOpen }) => ($sidebarOpen ? '12px 8px 0' : '12px 2px 0')};
  display: grid;
  gap: 10px;

  @media (max-width: 980px) {
    padding: 12px 8px 0;
  }
`;

export const UserIdentity = styled.div<{ $sidebarOpen: boolean }>`
  display: ${({ $sidebarOpen }) => ($sidebarOpen ? 'grid' : 'none')};
  gap: 2px;

  strong {
    color: #ffffff;
    font-size: 0.88rem;
    line-height: 1.2;
  }

  span {
    color: #bcd2f1;
    font-size: 0.76rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 700;
  }

  @media (max-width: 980px) {
    display: grid;
  }
`;

export const LogoutButton = styled.button<{ $collapsed: boolean }>`
  width: 100%;
  height: 34px;
  border: 1px solid #35557f;
  border-radius: 8px;
  background: rgba(17, 34, 58, 0.36);
  color: #d8e6fb;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  svg {
    width: 15px;
    height: 15px;
  }

  span {
    display: ${({ $collapsed }) => ($collapsed ? 'none' : 'inline')};
  }

  @media (max-width: 980px) {
    span {
      display: inline;
    }
  }
`;

export const NavItem = styled.button<{ $active?: boolean; $collapsed?: boolean }>`
  color: ${({ theme }) => theme.colors.textSidebar};
  border: none;
  border-radius: 8px;
  background: ${({ $active }) =>
    $active ? 'linear-gradient(110deg, #2ca942 10%, #52b934 90%)' : 'transparent'};
  padding: ${({ $collapsed }) => ($collapsed ? '10px 8px' : '10px 12px')};
  font-size: 0.93rem;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  gap: 10px;
  position: relative;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  text-align: left;
  cursor: pointer;

  &:hover {
    background: ${({ $active }) =>
      $active ? 'linear-gradient(110deg, #2ca942 10%, #52b934 90%)' : 'rgba(148, 188, 241, 0.12)'};
  }

  ${({ $collapsed }) =>
    $collapsed &&
    css`
      &::after {
        content: attr(data-label);
        position: absolute;
        left: calc(100% + 10px);
        top: 50%;
        transform: translateY(-50%);
        background: #1f3658;
        color: #ffffff;
        font-size: 0.76rem;
        font-weight: 600;
        border-radius: 6px;
        padding: 6px 8px;
        opacity: 0;
        pointer-events: none;
        white-space: nowrap;
        transition: opacity 110ms ease;
        z-index: 12;
      }

      &:hover::after {
        opacity: 1;
      }
    `}

  @media (max-width: 980px) {
    justify-content: flex-start;
    padding: 10px 12px;

    &::after {
      display: none;
    }
  }
`;

export const NavIcon = styled.span`
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const NavLabel = styled.span<{ $hidden: boolean }>`
  display: ${({ $hidden }) => ($hidden ? 'none' : 'inline')};

  @media (max-width: 980px) {
    display: inline;
  }
`;

export const ContentArea = styled.section`
  display: grid;
  grid-template-rows: auto 1fr;
`;

export const Topbar = styled.header`
  background: #ffffff;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderSoft};
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const TopbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const SidebarToggle = styled.button`
  width: 34px;
  height: 34px;
  border: 1px solid #ccdae9;
  border-radius: 8px;
  background: #ffffff;
  display: grid;
  place-content: center;
  gap: 3px;
  cursor: pointer;

  span {
    width: 14px;
    height: 2px;
    border-radius: 999px;
    background: #4d6588;
  }
`;

export const TopbarOverline = styled.p`
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.7rem;
  color: #6680a8;
`;

export const TopbarAction = styled.button`
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
  background: linear-gradient(110deg, #2ca942 10%, #52b934 90%);

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

export const Content = styled.main`
  padding: 20px 24px;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 16px;
  min-height: calc(100vh - 73px);

  @media (max-width: 620px) {
    padding-left: 14px;
    padding-right: 14px;
    min-height: calc(100vh - 69px);
  }
`;
