import './App.css'
import Home from './components/Home.jsx'
import About from './components/About.jsx'
import Plan from './components/Plan.jsx'
import Contact from './components/Contact.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from './components/Navbar.jsx'
import Login from './components/login.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import Form from './components/form.jsx'
import Profile from './components/profile.jsx'
import { useEffect, useState } from 'react'
import Dashboard from './components/dashboard.jsx'
import Content from './components/content.jsx'
import Pdfviewer from './components/Pdfviewer.jsx'
function App() {
  const [LoginCheck, setLoginCheck] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL+'/check/login', {
          method: 'GET',
          credentials: 'include',
        })
        const data = await res.json();
        setLoginCheck(data.check);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    }
    fetchData()
  }, [])

  const router = createBrowserRouter([
    { path: "/", element: <><Navbar ul="home" lc={LoginCheck} /><Home /></> },
    { path: "/about", element: <><Navbar ul="about" /><About /></> },
    { path: "/contact", element: <><Navbar ul="contact" /><Contact /></> },
    { path: "/plan", element: <><Navbar ul="plan" /><Plan /></> },
    { path: "/login", element: <><Navbar ul="hide" /><Login /></> },
    { path: "/form", element: <><Navbar ul="hide" /><Form /></> },
    { path: "/dashboard", element: <> <Navbar /> <Dashboard /> </> },
    { path: "/content", element: <><Navbar /><Content /></> }, 
    { path: "/pdf", element: <><Pdfviewer /></> }
    
  ]);
return (
  <>
    <RouterProvider router={router} />
  </>
)
}

export default App
