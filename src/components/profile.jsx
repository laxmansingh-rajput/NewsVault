import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import logout from '../assets/logout.svg'
import connect from '../assets/connect.svg'
import read from '../assets/read.svg'
import premium2 from '../assets/premium2.svg'
const Profile = ({ setLoginCheck, setshow, show, pop, down }) => {
  const navigate = useNavigate();
  const [Info, setInfo] = useState({});
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
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
  }, [Info])

  async function handelLogout() {
    const res = await fetch(import.meta.env.VITE_API_URL+'/check/logout', {
      method: 'GET',
      credentials: 'include',
    });
    setLoginCheck(false)
    navigate(0)
  }

  async function handelContent() {
    setshow(false)
    navigate("/content")
  }
  async function handelConnect() {
    setshow(false)
    navigate("/contact")
  }
  async function handelPlan() {
    setshow(false)
    navigate("/plan")
  }

  return (
    <div className={' box-border h-full w-full z-50'}>
      {Info === null || Info.error ? (
        <div>Something went wrong</div>
      ) : (
        <div className={' box-border h-[400px] w-[300px]  flex flex-col transition-all duration-300 ease-out  z-50  bg-white text-black p-4  rounded-md gap-3 ' +
          (pop ? "opacity-100 scale-100 " : "opacity-0 scale-95 ")
        }>
          <div className=' box-border  flex flex-col w-full h-[170px]  items-center justify-center gap-1  bg-[#f0f0f0] p-2 rounded-md'>
            <div className="img  h-23 w-23 rounded-full overflow-hidden ">
              <img src={Info.picture} alt="" className=' box-border select-none w-full h-full object-fill shrink-0' />
            </div>
            <div className=' box-border w-full'>
              {Info.name}
            </div>
            <div className=' box-border  text-sm opacity-40 w-full overflow-hidden'>
              {Info.email}
            </div>
          </div>
          <div className="informataion flex flex-col gap-4 text-md  w-full h-1/2 font-medium">
            {
              (Info.premium === false) ? <div className=' box-border text-sm  text-start'>
                Premium: No active plan
              </div> : <div className=' box-border text-sm  text-start'>
                Premium: {Info.premiumType}
              </div>
            }
            <div className=' box-border w-full text-start' >
              {
                (!Info.premium) ? <div className="flex text-sm item-center p-1.5 gap-1 border border-black/30 cursor-pointer rounded-md  hover:scale-95 transition-all ease-out" onClick={handelPlan}>
                  <img src={premium2} className=' box-border select-none h-7' alt="" />
                  <div className=' box-border flex  items-center justify-center  mt-auto mb-auto cursor-pointer'>
                    Explore premium
                  </div>
                </div> :
                  <div className="flex text-sm item-center p-1.5 gap-1 border border-black/30 cursor-pointer rounded-md  hover:scale-95 transition-all ease-out" onClick={handelContent}>
                    <img src={read} className=' box-border select-none h-7' alt="" />
                    <div className=' box-border flex  items-center justify-center  mt-auto mb-auto cursor-pointer'>
                      Explore content
                    </div>
                  </div>
              }
            </div>
            <div className="flex text-sm item-center p-1.5 gap-1 border border-black/30 cursor-pointer rounded-md  hover:scale-95 transition-all ease-out" onClick={handelConnect}>
              <img src={connect} className=' box-border select-none h-7' alt="" />
              <div className=' box-border flex  items-center justify-center  mt-auto mb-auto cursor-pointer'>
                Connect us
              </div>
            </div>
            <div className="flex text-sm item-center p-1.5 gap-1 border border-black/30 cursor-pointer rounded-md  hover:scale-95 transition-all ease-out" onClick={handelLogout}>
              <img src={logout} className=' box-border select-none h-7' alt="" />
              <div className=' box-border flex  items-center justify-center  mt-auto mb-auto cursor-pointer'>
                Logout
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
