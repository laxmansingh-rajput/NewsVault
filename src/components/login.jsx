import React from 'react'
import './login.css'
import { useForm } from "react-hook-form"
import { useState,useEffect } from 'react'
import hide from '../assets/hide.svg'
import show from '../assets/show.svg'
import boy from '../assets/boy.png'
import google from '../assets/google.svg'
import lock from '../assets/lock2.svg'
import profile from '../assets/profile2.svg'

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    document.title = "Login"
  }, [])


  const [pass, setpass] = useState(true);

  function handelShow() {
    setpass(!pass)
  }

  const [showError, setshowError] = useState(false)

  const onSubmit = async (data) => {
    const res = await fetch(import.meta.env.VITE_API_URL+'/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });

    let responce = await res.json()

    if (responce.redirect) {
      window.location.href = responce.redirect;
    } else {
      setshowError(true)
      setTimeout(() => setshowError(false), 5000);
    }
  }

  const loginWithGoogle = () => {
    window.location.href = import.meta.env.VITE_API_URL+'/auth/google';
  }

  return (
    <>
      <div className="outer bg-[#14121F] h-screen w-screen flex flex-col items-center justify-center text-2xl pt-21 max-[770px]:justify-start max-[770px]:pt-25 px-5">
        <div className='h-7/8 w-1/4 py-5 flex flex-col items-center justify-center gap-8 bg-neutral-100 text-gray-900 rounded-xl relative p-5 max-[770px]:h-7/8 max-[1000px]:w-1/2 max-[550px]:w-full pt-12'>
          <div className='font-bold text-xl absolute top-[25px]'>Sign in</div>

          <form onSubmit={handleSubmit(onSubmit)} className="relative outer w-full flex flex-col items-center justify-center gap-8 max-[770px]:gap-7 text-sm font-semibold">

            {/* Username Field */}
            <div className='rounded-xl w-full relative flex flex-col gap-2'>
              <div className='w-full text-sm font-semibold text-start'>Username</div>
              <input
                {...register("Email", { required: { value: true, message: "Please enter email" } })}
                className='border-b-2 border-b-[#9CA3AF] h-full w-full pl-9  pr-5 py-3'
                placeholder='Username'
              />
              <img src={profile} alt="" className='absolute h-[25px] left-1 bottom-2' />
              {errors.Email && <span className='absolute bottom-[-20px] text-red-700 left-1'>{errors.Email.message}</span>}
            </div>

            {/* Password Field */}
            <div className='rounded-xl w-full relative flex flex-col gap-2'>
              <div className='w-full text-sm font-semibold text-start'>Password</div>
              <input
                type={pass ? 'password' : 'text'}
                {...register("password", { required: { value: true, message: "Please enter password" }, minLength: { value: 8, message: "minimum 8 characters required" } })}
                className='border-b-2 border-b-[#9CA3AF] h-full w-full pl-9  pr-12 py-3'
                placeholder='Password'
              />
              <img src={lock} alt="" className='absolute h-[25px] left-1 bottom-2' />
              <img src={pass ? show : hide} alt="" className='absolute h-1/3 right-2 bottom-2.5 cursor-pointer' onClick={handelShow} />
              {errors.password && <span className='absolute bottom-[-20px] text-red-700 left-1'>{errors.password.message}</span>}
            </div>

            {showError && <div className='absolute bottom-[50px] text-red-600'>some thing went wrong</div>}

            <input type="submit" className='rounded-xl bg-[#bcb609] w-full px-5 py-3 hover:scale-95 transition-all ease-in cursor-pointer' value="Sign in" />
          </form>

          <div className='underline cursor-pointer w-full text-sm font-semibold text-center' onClick={loginWithGoogle}>
            Never here? Create new account
          </div>

          <button className='px-5 py-3 rounded-xl bg-[#14121F] text-neutral-100 w-full hover:scale-98 transition-all ease-in cursor-pointer' onClick={loginWithGoogle}>
            <div className="flex items-center justify-center gap-2 text-sm font-semibold">
              <img src={google} className='h-[25px]' alt="" />
              <div>Sign in with Google</div>
            </div>
          </button>

        </div>

        <img src={boy} alt="" className='h-full fixed left-20 bottom-0 max-[1000px]:hidden max-[1100px]:h-4/5' />
      </div>
    </>
  )
}

export default Login
