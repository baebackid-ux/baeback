import React from 'react';
 import { createRoot, hydrateRoot } from 'react-dom/client';
 import { HelmetProvider } from 'react-helmet-async';
 import { BrowserRouter } from 'react-router-dom';
 import App from './App.jsx';
 import { AuthProvider } from './contexts/AuthContext.jsx';
 import './styles.css';

// UJI KONEKSI SUPABASE PRODUCTION
console.log('DEBUG SUPABASE:', {
  URL: import.meta.env.VITE_SUPABASE_URL,
  KEY_EXISTS: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  KEY_LENGTH: import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0
});

const container = document.getElementById('root');
 
 const app = (
   <React.StrictMode>
     <HelmetProvider>
       <BrowserRouter>
         <AuthProvider>
           <App />
         </AuthProvider>
       </BrowserRouter>
     </HelmetProvider>
   </React.StrictMode>
 );
 
 if (container.innerHTML.trim()) {
   hydrateRoot(container, app);
 } else {
   createRoot(container).render(app);
 }
