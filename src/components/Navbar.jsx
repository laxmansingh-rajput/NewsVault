import React from 'react'
import './nav.css'
import newsVault from '../assets/newsVault1.png';
import arrow from '../assets/arrow.svg'
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router";
import { useState, useEffect, useRef } from 'react';
import aboutsvg from '../assets/about.svg'
import premsvg from '../assets/premium.svg'
import contactsvg from '../assets/contact.svg'
import homesvg from '../assets/home.svg'
import Profile from './profile.jsx';
import yaboutsvg from '../assets/yabout.svg'
import ypremsvg from '../assets/yplans.svg'
import ycontactsvg from '../assets/ycontact.svg'
import yhomesvg from '../assets/yhome.svg'
const Navbar = ({ ul }) => {
    const [LoginCheck, setLoginCheck] = useState(false)
    const [picture, setpicture] = useState(null)
    const [pop, setPop] = useState(false)
    const [down, setDown] = useState(false)
    const profileRef = useRef()
    const [show, setshow] = useState(false)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(import.meta.env.VITE_API_URL + '/check/login', {
                    method: 'GET',
                    credentials: 'include',
                })
                const data = await res.json();
                setLoginCheck(data.check);
                setpicture(data.picture)
            } catch (err) {
                console.error('Fetch error:', err);
            }
        }
        fetchData()
    }, [])
    useEffect(() => {
        const block = document.querySelector('.profile');

        const check = (event) => {
            if (!block.contains(event.target)) {
                setPop(false)
                setTimeout(() => {
                    setshow(false)
                }, 300);
            }
        };

        if (show) {
            document.addEventListener("click", check);
        }

        return () => {
            document.removeEventListener("click", check);
        };

    }, [show]);



    const navigate = useNavigate();
    function handelLogin() {
        navigate("/login");
    }
    let ul_home, ul_about, ul_contact, ul_plan, hide_button;
    let hideArrow = "hidden"
    if (ul === "home") {
        ul_home = "min-[771px]:underline text-[#a6e62d]";
        ul_about = ""
        ul_contact = ""
        ul_plan = ""
        hideArrow = ""
    }
    if (ul === "about") {
        ul_home = ""
        ul_about = "min-[771px]:underline text-[#a6e62d]"
        ul_contact = ""
        ul_plan = ""
    }
    if (ul === "contact") {
        ul_home = "";
        ul_about = ""
        ul_contact = "min-[771px]:underline text-[#a6e62d]"
        ul_plan = ""
    }
    if (ul === "plan") {
        ul_home = ""
        ul_about = ""
        ul_contact = ""
        ul_plan = "min-[771px]:underline text-[#a6e62d]"
    }
    if (ul === "hide") {
        hide_button = "hidden"
    }
    function profile_handeler() {
        if (show) {
            setPop(false)
            setTimeout(() => {
                setshow(false)
            }, 300);
        } else {
            setshow(true)
            setTimeout(() => {
                setPop(true)
            }, 10);
        }
    }
    return (

        <>
            <div
                className={`Navigation font-serif fixed top-0 bg-[#14121F] w-screen z-40 h-20 p-5 pr-9 ${ul === 'about' ? 'shadow-md' : 'shadow-md'}`}
                style={ul !== '' ? { boxShadow: '0 4px 6px -1px #a6e62d' } : {}}
            >

                <div className={`NavBar flex  gap-25 max-[850px]:gap-15  items-center h-full w-full  justify-center `}>
                    <div className="emtpy w-1/2 ">
                        <img className={`logo h-15 ${hide_button} select-none cursor-pointer`} onClick={() => { navigate("/"); }} src={newsVault} alt="" />
                    </div>
                    <div className="icons flex gap-8 max-[770px]:hidden ">
                        <Link className={`hover:scale-103 hover:text-yellow-100 transition-all ease-in duration-200 font-medium text-xl ${ul_home}`} to="/">Home</Link>
                        <Link className={`hover:scale-103 hover:text-yellow-100 transition-all ease-in duration-200 font-medium text-xl ${ul_plan}`} to="/plan">Plans</Link>
                        <Link className={`hover:scale-103 hover:text-yellow-100 transition-all ease-in duration-200 font-medium text-xl ${ul_about}`} to="/about">About</Link>
                        <Link className={`hover:scale-103 hover:text-yellow-100 transition-all ease-in duration-200 font-medium text-xl ${ul_contact}`} to="/contact">Contacts</Link>
                    </div>
                    {
                        (LoginCheck == false) ? <div className="Login relative">
                            <button className={`log w-30 h-10 rounded-md bg-[#a6e62d] text-xl font-medium  ${hide_button} cursor-pointer hover:scale-95 transition-all ease-in`}
                                onClick={handelLogin}>Login</button>
                            <h1 className={`font-great  text-[#a6e62d] w-3/2 absolute top-25 right-35 text-5xl ${hideArrow} `}>Click me</h1>
                            <img src={arrow} className={`h-15 select-none  absolute right-30 top-10 ${hideArrow} `} alt="" />
                        </div> : <div className={`profile h-12 w-12 relative ${hide_button} shrink-0`}>
                            <div className={' h-full w-full rounded-full  ' + (' overflow-hidden border-2')} onClick={profile_handeler}>
                                {
                                    <img src={picture}
                                        className='object-fill cursor-pointer select-none' referrerpolicy="no-referrer" alt="" />
                                }
                            </div>
                            <div className='absolute  top-[70px] right-[12px] max-[500px]:right-[-30px] p-0'>
                                <div ref={profileRef} className={`profile profile-dropdown  h-auto w-auto ${show ? 'show' : 'hidden'}`}>
                                    <Profile lc={LoginCheck} setshow={setshow} show={show} pop={pop} down={down} setLoginCheck={setLoginCheck} />
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div >
            <div className="bottom fixed bottom-0 border-t-2 rounded-t-xl h-15 w-full display flex gap-5 min-[770px]:hidden items-center justify-around bg-[#14121F] z-20">
                <Link className={` hover:text-yellow-100  ${ul_home} flex flex-col items-center justify-center`} to="/"><img src={(ul === "home") ? yhomesvg : homesvg} className='select-none' alt="" /><p>Home
                </p></Link>
                <Link className={` hover:text-yellow-100  ${ul_plan} flex flex-col items-center justify-center`} to="/plan">
                    <img src={(ul === "plan") ? ypremsvg : premsvg} className='select-none' alt="" />
                    <p>plans</p>
                </Link>
                <Link className={` hover:text-yellow-100  ${ul_about} flex flex-col items-center justify-center`} to="/about">
                    <img src={(ul === "about") ? yaboutsvg : aboutsvg} className='select-none' alt="" />
                    <p>about</p>
                </Link>
                <Link className={` hover:text-yellow-100  ${ul_contact} flex flex-col items-center justify-center`} to="/contact">
                    <img src={(ul === "contact") ? ycontactsvg : contactsvg} className='select-none' alt="" />
                    <p>contacts</p>
                </Link>

            </div>
        </>

    )
}

export default Navbar