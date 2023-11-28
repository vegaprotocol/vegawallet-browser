/* istanbul ignore file */
import './index.css'

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import App from './app'

TimeAgo.addDefaultLocale(en)

const root = ReactDOM.createRoot(document.querySelector('#root') as HTMLElement)
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
