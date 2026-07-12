import React from 'react';
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';

export function render(url) {
  const helmetContext = {};

  const html = renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </StaticRouter>
      </HelmetProvider>
    </React.StrictMode>,
  );

  const { helmet } = helmetContext;

  return {
    html,
    head: [
      helmet?.title?.toString() || '',
      helmet?.meta?.toString() || '',
      helmet?.link?.toString() || '',
      helmet?.script?.toString() || '',
    ]
      .filter(Boolean)
      .join('\n'),
  };
}
