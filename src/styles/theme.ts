export const theme = {
  colors: {
    surfaceApp: '#f3f6fb',
    surfaceCard: '#ffffff',
    borderSoft: '#dce5f2',
    borderLighter: '#e8eef7',
    sidebarBg: '#1f3658',
    sidebarBorder: '#29456f',
    textPrimary: '#1f3658',
    textMuted: '#5a6f90',
    textSidebar: '#d4e2f6',
    textSidebarStrong: '#e7eef8',
    blueSoft: '#f7faff',
    chipActiveBg: '#e7f7ec',
    chipActiveText: '#1f7f35',
    chipInactiveBg: '#f2f4f7',
    chipInactiveText: '#5b6a7f',
    gradientStart: '#2ca942',
    gradientEnd: '#52b934',
  },
  radius: {
    sm: '8px',
    md: '12px',
  },
} as const;

export type AppTheme = typeof theme;
