import React, { use } from 'react'
import { useNavigate } from "react-router";
import { useState, useEffect } from 'react'
import './home.css'
import boy from '../assets/boy.png'
import loader from '../assets/loader.svg';
const Home = () => {
    useEffect(() => {
        document.title = "Home"
    }, [])

    const [Info, setInfo] = useState({});
    const [loading, setloading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(import.meta.env.VITE_API_URL+'/auth/getAccess', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await res.json();
                setInfo(data);
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setloading(false)
            }
        };

        fetchData();
    }, []);

    const navigate = useNavigate();
    const handelButton = () => {
        if (Info.premium == true) {
            navigate('/content')
        } else {
            navigate('/plan')
        }
    }

    let customHeading
    if (Info.loginStatus == "true" && Info.premium == true) {
        customHeading = "Start Reading Now and Enjoy a Seamless News Experience!"
    } else if (Info.loginStatus == "true" && Info.premium == false) {
        customHeading = "Read Without Limits — Choose Premium and Access It All!"
    }
    let customJustify = (Info.loginStatus == "true") ? "justify-normal mt-50" : "justify-center mt-30";

    return (
        <div className='bg-[#14121F] h-screen flex justify-end font-serif'>
            <img src={boy} alt="" className='select-none max-[640px]:left-0 max-[770px]:h-1/2 max-[770px]:bottom-15 max-[1130px]:h-2/3 max-[1200px]:h-full h-5/4 fixed left-20 bottom-0' />
            <div className={`text-5xl text-[#a6e62d] max-md:w-full max-md:text-3xl max-md:p-4  h-1/2 w-1/2 flex flex-col items-center  gap-10 min-[768px]:mr-20 max-[459px]:mt-43 ${customJustify}`} >
                <p>
                    {
                        (Info.loginStatus == "true") ? customHeading :
                            " Log In and Explore a World of Exclusive Articles Just for You!"
                    }
                </p>
                {
                    (Info.loginStatus == "true") && <button className=' text-xl max-[877px]:w-2/3 w-1/2 font-medium px-8 py-2 rounded-md bg-[#a6e62d] text-[#14121F]  hover:scale-95 cursor-pointer transition-all ease-in' onClick={handelButton} >
                        {
                            (Info.premium == false) ? ("Explore premium") : ("Explore content")
                        }
                    </button>
                }
            </div>
            {
                (loading == true) && <div className='h-screen w-screen fixed top-0 left-0 flex items-center justify-center bg-[#] '>
                    <img src={loader} className='h-30' alt="" />
                </div>
            }
        </div>
    )
}

export default Home 