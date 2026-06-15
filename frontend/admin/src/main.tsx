import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { AdminQueryProvider } from './components/AdminQueryProvider'
import './styles/index.css'

if (import.meta.env.DEV) {
  void import('react-grab')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AdminQueryProvider>
      <App />
    </AdminQueryProvider>
  </React.StrictMode>,
)
