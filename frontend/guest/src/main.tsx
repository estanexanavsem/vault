import React from 'react'
import ReactDOM from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import App from './App'
import { ErrorFallback } from './components/common/ErrorFallback'
import { GuestQueryProvider } from './providers/GuestQueryProvider'
import './styles/index.css'
import { logBoundaryError } from './utils/errorBoundary'

if (import.meta.env.DEV) {
  void import('react-grab')
}

const preloadReloadKey = 'vault:preload-reload'
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element #root was not found.')
}

window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()

  if (sessionStorage.getItem(preloadReloadKey) === '1') {
    return
  }

  sessionStorage.setItem(preloadReloadKey, '1')
  window.location.reload()
})

window.addEventListener('load', () => sessionStorage.removeItem(preloadReloadKey), { once: true })

ReactDOM.createRoot(rootElement, {
  onCaughtError: logBoundaryError,
  onUncaughtError: logBoundaryError,
}).render(
  <React.StrictMode>
    <GuestQueryProvider>
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={logBoundaryError}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <Toaster closeButton position="top-right" richColors />
      </ErrorBoundary>
    </GuestQueryProvider>
  </React.StrictMode>,
)
