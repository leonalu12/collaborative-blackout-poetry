import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { BlackoutProvider } from './context/BlackoutContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BlackoutProvider>
      <App />
    </BlackoutProvider>
  </StrictMode>,
)