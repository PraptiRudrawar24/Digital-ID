import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios'

// Set default base URL for axios
// In production (Vercel), we use relative path to trigger vercel.json rewrites
// In development, we use localhost:5000
axios.defaults.baseURL = import.meta.env.DEV ? 'http://localhost:5000' : '';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
