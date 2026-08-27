import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx' 
import { BrowserRouter } from 'react-router-dom'  

// 1. We import the tools for the Control Center
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from './store.js'
import { ThemeProvider } from 'next-themes'
import ErrorBoundary from './components/ui/ErrorBoundary.jsx'

// 2. We create the "Brain" of the assistant
const queryClient = new QueryClient()



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </ThemeProvider>
        </Provider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
