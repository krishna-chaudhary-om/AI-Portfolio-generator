import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { PortfolioProvider } from './context/PortfolioContext.jsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PortfolioProvider>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: 'var(--accent)', secondary: 'var(--bg)' },
            },
          }}
        />
      </PortfolioProvider>
    </BrowserRouter>
  </React.StrictMode>
)
