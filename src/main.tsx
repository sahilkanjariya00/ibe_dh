import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, LoaderProvider } from './contexts/index.ts'
import { LoaderBackdrop } from './stories/index.ts'
import './styles/globalStyles.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <LoaderProvider>
        <BrowserRouter>
          <LoaderBackdrop/>
          <App />
        </BrowserRouter>
      </LoaderProvider>
    </AuthProvider>
  </StrictMode>,
)
