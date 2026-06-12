import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { AdminQueryProvider } from './components/AdminQueryProvider'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AdminQueryProvider>
      <App />
    </AdminQueryProvider>
  </React.StrictMode>,
)
