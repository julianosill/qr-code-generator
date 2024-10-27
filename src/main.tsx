import '@/index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { Generator } from './generator'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Generator />
  </StrictMode>,
)
