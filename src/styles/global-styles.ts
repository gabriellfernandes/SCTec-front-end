import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&family=Roboto:wght@400;500;700&display=swap');

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: 'Roboto', 'Segoe UI', sans-serif;
    background:
      radial-gradient(circle at 18% 16%, rgba(6, 182, 109, 0.18), transparent 42%),
      radial-gradient(circle at 85% 22%, rgba(0, 176, 251, 0.18), transparent 39%),
      linear-gradient(135deg, #f5f7fb 0%, #edf2f8 100%);
    color: #22272a;
  }

  #root {
    min-height: 100vh;
  }
`;
