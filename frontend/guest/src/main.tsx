if (import.meta.env.DEV) {
  void import('react-grab')
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'

const queryClient = new QueryClient()
const preloadReloadKey = 'vault:preload-reload'

window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()

  if (sessionStorage.getItem(preloadReloadKey) === '1') {
    return
  }

  sessionStorage.setItem(preloadReloadKey, '1')
  window.location.reload()
})

window.addEventListener('load', () => sessionStorage.removeItem(preloadReloadKey), { once: true })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
