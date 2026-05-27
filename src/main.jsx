import React from 'react'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import './index.css'
import App from './App.jsx'
import faviconUrl from "./assets/newsVault.png";

document.getElementById("favicon").href = faviconUrl;

createRoot(document.getElementById('root')).render(
    <App />
)
