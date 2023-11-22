/* istanbul ignore file */
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './app'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)

const root = ReactDOM.createRoot(document.querySelector('#root') as HTMLElement)
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
