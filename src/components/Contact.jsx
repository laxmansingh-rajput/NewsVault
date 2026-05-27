import React from 'react'
import locationIcon from '../assets/location.svg';
import emailIcon from '../assets/email.svg';
import instaIcon from '../assets/insta.svg';
import fbIcon from '../assets/facebook.svg';
import linkedinIcon from '../assets/linkedin.svg';
import { useEffect } from 'react';

const Contact = () => {
    useEffect(() => {
        document.title = "Contact"
    }, [])

    return (
        <div className=' bg-[#14121F] min-h-screen font-serif  px-5 box-border  pt-30'>
            <div className="info bg-[#14121F]  display flex max-[935px]:flex-col max-[935px]:gap-12 max-[935px]:w-full items-center min-[1640px]:h-screen min-h-full justify-around  pb-20 text-xl box-border min-[900px]:pb-0">
                <div className="address w-2/5  max-[935px]:w-full text-start display flex flex-col gap-12  box-border">
                    <div className="message text-5xl font-bold max-[400px]:text-3xl">
                        Get in Touch with Gyaan 👋
                    </div>
                    <div className="details max-[400px]:text-sm">
                        Feel free to connect with us for any of your needs regarding our services. Our support team is ready to solve any of your issues. Just push a text to us and we will get back to you immediately.
                    </div>
                    <div>
                        <p className="text-start font-bold text-2xl">India</p>
                        <div className='w-full border'></div>
                    </div>
                    <div className="location w-full  flex flex-col gap-4 max-[935px]:border-b-2 pb-8 max-[400px]:text-sm">
                        <a href="https://maps.app.goo.gl/PtoaAV1B53nQ4igV9" className='flex justify-baseline gap-2'><img src={locationIcon} alt="" className='select-none h-7 max-[400px]:h-5' />Indore, Madhya Pradesh 453331</a>
                        <a href="mailto:laxmansinghrajput5417@gmail.com" className='flex justify-baseline gap-2 text-wrap'>
                            <img src={emailIcon} alt="" className='select-none h-7 max-[400px]:h-5' />
                            laxmansinghrajput5417@gmail.com
                        </a>
                        <a href="tel:+91 88199 52678" className='flex justify-baseline gap-2'><img src={emailIcon} alt="" className='select-none h-7 max-[400px]:h-5' />+91 88199 52678</a>
                    </div>

                </div>
                <div className="socals w-2/5 max-[935px]:w-full h-1/2 flex flex-col ">
                    <div className="message text-5xl  font-bold ">
                        <div className='w-full items-cent justify-center max-[500px]:text-4xl max-[400px]:text-3xl'>
                            Our socials
                        </div>
                        <div className="icons flex w-full items-cent justify-center gap-4 h-70 ">
                            <a href="https://www.instagram.com/i_laxmansinghrajput/">
                                <img src={instaIcon} className='h-40 hover:h-50 select-none  transition-all duration-600 ease-in-out hover:drop-shadow-[0_0_10px_#a6e62d] ' alt="" />
                            </a>
                            <a href="">
                                <img src={fbIcon} className='h-40 hover:h-50 select-none transition-all duration-600 ease-in-out hover:drop-shadow-[0_0_10px_#a6e62d]' alt="" />
                            </a>
                            <a href="https://www.linkedin.com/in/laxman-singh-rajput-5a58352b7/">
                                <img src={linkedinIcon} className='h-40 hover:h-50 select-none transition-all duration-600 ease-in-out hover:drop-shadow-[0_0_10px_#a6e62d]' alt="" />
                            </a>

                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default Contact