import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css' // <-- IMPORT TAILWIND STYLES HERE
import { Theme } from '@radix-ui/themes';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/features/authentication/context/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Theme>
          <App />
        </Theme>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)