/**
 * Browser entry point for the tutor frontend.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'mathlive'

// Set initial theme from localStorage or system preference
const storedTheme = localStorage.getItem('darkMode')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const isDark = storedTheme !== null ? JSON.parse(storedTheme) : prefersDark
document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
