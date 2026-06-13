import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx' 
import { BrowserRouter } from 'react-router-dom'  

// 1. We import the tools for the Control Center
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 2. We create the "Brain" of the assistant
const queryClient = new QueryClient()


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
