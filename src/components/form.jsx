import React from 'react'
import { useForm } from "react-hook-form"
import { useState, useEffect } from 'react'
import hide from '../assets/hide.svg'
import show from '../assets/show.svg'
import lock from '../assets/lock2.svg'
import profile from '../assets/profile2.svg'
import loader from '../assets/loader.svg';

const form = () => {
    const [Info, setInfo] = useState({ name: "", password: "" })
    const [error, seterror] = useState(false)
    const [loading, setloading] = useState(true)
    useEffect(async () => {
        async function dataFetch() {
            const res = await fetch(import.meta.env.VITE_API_URL + '/check/name', {
                method: 'GET',
                credentials: 'include',
            });
            if (res.status == 401) {
                seterror(true)
            } else {
                const data = await res.json();
                setInfo(data);
            }
        }
        await dataFetch();
        setloading(false)
    }, [])


    const [pass, setpass] = useState(true);
    function handelShow() {
        setpass(!pass)
    }
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        const res = await fetch(import.meta.env.VITE_API_URL + '/edit/password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        let responce = await res.json()
        if (responce.redirect) {
            window.location.href = responce.redirect;
        }
    }
    return (
        <>
            {(Info.password == "" && error == false) ? <form onSubmit={handleSubmit(onSubmit)} className="outer bg-[#14121F] h-screen w-screen flex flex-col items-center justify-center text-2xl gap-12 p-4 pt-30 max-[770px]:pt-20 ">
                <div className='w-[400px] max-[470px]:w-full h-8/10 bg-neutral-100 rounded-md  text-gray-900 p-4 flex flex-col itmes-center justify-center gap-5'>
                    <div className='font-semibold '>
                        Set a password
                    </div>
                    <div className=' w-full h-15 text-md rounded-md relative '>
                        <img src={profile} className='absolute h-8 top-1.5 left-0.5' alt="" />
                        <input name="Name" defaultValue={Info.name} {...register("Name", { required: { value: watch("Name") !== Info.name, message: "Please enter name" } })}
                            className='border-b-2 border-b-[#9CA3AF] box-border h-11 text-[17px] w-full p-2 pl-10 '
                            placeholder='Username' />
                        {errors.name && <span className='absolute bottom-[-10px] text-sm text-red-700 left-0'>{errors.name.message}</span>}
                    </div>

                    <div className='w-full h-15 text-md rounded-md relative'>
                        <img src={lock} className='absolute h-8 top-1.5 left-0.5' alt="" />
                        <input type={(pass) ? 'password' : 'text'} {...register("password", { required: { value: true, message: "Please enter password" }, minLength: { value: 8, message: "Minimum 8 characters required" } })}
                            className='border-b-2 border-b-[#9CA3AF] box-border h-11 text-[17px] w-full  p-2 pl-10'
                            placeholder='Password' />
                        <img src={(pass) ? show : hide} alt="" className='absolute h-[25px] right-2 top-3' onClick={handelShow} />
                        {errors.password && <span className='absolute bottom-[-10px] text-sm text-red-700 left-0'>{errors.password.message}</span>}
                    </div>
                    <div className='w-full h-auto flex items-center justify-center'>
                        <input type="submit" className='border box-border px-6 py-1  text-md rounded-xl text-[20px] bg-[#bcb609] transition-all ease-in duration-100 hover:scale-98 cursor-pointer ' value="Proceed" />
                    </div>
                </div>
            </form> : <div className="outer bg-[#14121F] h-screen w-screen flex flex-col items-center justify-center text-2xl gap-12">
                {error ? 'Something went wrong' : 'Your Password is all ready set'}
            </div>}
            {
                (loading == true) && <div className='h-screen w-screen fixed top-0 left-0 flex items-center justify-center bg-[#14121F] '>
                    <img src={loader} className='h-30' alt="" />
                </div>
            }
        </>
    )
}
export default form