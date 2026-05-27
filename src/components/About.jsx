import { useEffect } from 'react';
import React from 'react';
import hi from '../assets/hi2.png'
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate()
  useEffect(() => {
    document.title = "About"
  }, [])

  const handleContact = () => {
    navigate('/contact');
  };

  return (
    <div className='bg-[#14121F] font-serif h-screen w-screen pt-20 flex items-center justify-center text-[#fefffb] overflow-hidden px-6 gap-6'>

      {/* Left: Image */}
      <div className='hidden sm:flex w-2/5 h-full items-end justify-center relative'>
        <img src={hi} className='absolute bottom-0 left-1/2 -translate-x-1/2 max-h-[90%] object-contain select-none' alt="Laxman" />
      </div>

      {/* Right: Card */}
      <div className='w-full sm:w-3/5 lg:w-2/5 bg-neutral-100 text-[#14121F] rounded-2xl px-7 py-7 flex flex-col justify-between shadow-[0_0_40px_rgba(166,230,45,0.08)] h-[82vh]'>

        {/* Header */}
        <div className='flex flex-col gap-3'>
          <span className='text-xs font-bold uppercase tracking-widest text-[#a6e62d] bg-[#14121F] w-fit px-3 py-1 rounded-full'>
            Founder & Mentor
          </span>
          <h1 className='text-4xl lg:text-5xl font-bold leading-tight'>Hi, I'm Laxman</h1>
        </div>

        {/* Body */}
        <div className='flex flex-col gap-4 text-[15px] lg:text-[17px] font-medium text-neutral-700 leading-relaxed'>
          <p>
            B.Tech graduate from one of India's top private universities, founder of a performance-driven marketing agency, and mentor to thousands of students.
          </p>
          <p>
            We started with curated daily articles to boost your prep — and we're evolving fast into your <span className='text-[#14121F] font-bold'>all-in-one smart growth partner.</span>
          </p>
        </div>

        {/* Coming Soon */}
        <div className='bg-[#14121F] text-[#fefffb] rounded-xl px-5 py-4 flex flex-col gap-2 text-[14px] lg:text-[15px]'>
          <span className='text-[#a6e62d] font-bold text-sm uppercase tracking-widest mb-1'>Coming Soon</span>
          <div className='flex flex-col gap-1 font-medium'>
            <span>👉 1-on-1 mentorship</span>
            <span>👉 Smart courses & prep tools</span>
            <span>👉 And much more…</span>
          </div>
        </div>

        {/* CTA */}
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-200 pt-5'>
          <p className='text-neutral-500 text-sm text-center sm:text-left'>
            Ready to grow? We'd love to hear from you.
          </p>
          <button
            onClick={handleContact}
            className='cursor-pointer px-6 py-2.5 rounded-lg bg-[#a6e62d] text-[#14121F] font-bold text-sm hover:scale-95 hover:bg-[#baf040] transition-all duration-200 ease-in-out whitespace-nowrap shadow-md'
          >
            Contact Us →
          </button>
        </div>

      </div>
    </div>
  );
};

export default About;