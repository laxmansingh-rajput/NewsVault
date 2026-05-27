import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import cup from '../assets/cup.png';
import l from '../assets/lock4.png';
import cross from '../assets/ucross2.svg';
import loading from '../assets/loading.webm';
import bp from '../assets/boyPaper.png';
import loader from '../assets/loader.svg';

const Content = () => {
    const [Info, setInfo] = useState({ loginStatus: "false", premium: false });
    const [lock, setlock] = useState(null);
    const [listType, setListType] = useState(null);
    const [list, setlist] = useState([]);
    const navigate = useNavigate();
    const [loadingPage, setloading] = useState(true);
    const [animatePopup, setAnimatePopup] = useState(false);
    const [animatePopDown, setAnimatePopDown] = useState(false);

    useEffect(() => {
        document.title = "Content";
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(import.meta.env.VITE_API_URL + '/auth/getAccess', {
                    method: 'GET',
                    credentials: 'include',
                });

                const data = await res.json();

                setInfo(data);

                if (data.loginStatus == "true" && data.premiumType != "Full Access") {
                    if (data.premiumType == "Paper1") {
                        setlock("Paper2");
                    } else if (data.premiumType == "Paper2") {
                        setlock("Paper1");
                    }
                }
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setloading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (listType !== null) {
            setTimeout(() => setAnimatePopup(true), 10);
        } else {
            setAnimatePopup(false);
        }
    }, [listType]);

    const handelPaper1 = async () => {
        if (lock != "Paper1") {
            const type = "Paper1";

            setListType("Paper1");

            const res = await fetch(
                import.meta.env.VITE_API_URL + `/content/list?type=${type}`,
                {
                    method: 'GET',
                    credentials: 'include',
                }
            );

            let data = await res.json();

            if (data.success) {
                setlist(data.keys);
            } else {
                console.log('server error');
            }
        }
    };

    const handelPaper2 = async () => {
        if (lock != "Paper2") {
            const type = "Paper2";

            setListType("Paper2");

            const res = await fetch(
                import.meta.env.VITE_API_URL + `/content/list?type=${type}`,
                {
                    method: 'GET',
                    credentials: 'include',
                }
            );

            let data = await res.json();

            if (data.success) {
                setlist(data.keys);
            } else {
                console.log('server error');
            }
        }
    };

    const handelCancel = () => {
        setAnimatePopDown(true);
        setAnimatePopup(false);

        setTimeout(() => {
            setListType(null);
            setlist([]);
            setAnimatePopDown(false);
        }, 100);
    };

    const helper = (key) => {
        let arr = key.split("/");
        let arr2 = arr[arr.length - 1].split(".");
        return arr2[0];
    };

    const handelPdf = (key) => {
        navigate('/pdf', { state: { Key: key, ct: listType } });
    };

    return (
        <>
            {(Info.loginStatus == "false" || Info.premium == false) ? (
                <div className='h-screen bg-[#14121F] w-screen pt-25 text-2xl font-bold text-white flex items-center justify-center'>
                    Something went wrong
                </div>
            ) : (
                <div className="min-h-screen w-full bg-[#14121F] pt-28 pb-16 px-6 flex flex-col items-center font-serif">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <span className="text-xl font-bold uppercase tracking-widest text-[#a6e62d] bg-[#1e1c2e] px-4 py-2 rounded-full">
                            Daily Newspapers
                        </span>
                    </div>

                    {/* Popup */}
                    {(listType != null) && (
                        <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 px-4'>

                            <div
                                className={
                                    "bg-neutral-100 rounded-2xl w-full max-w-2xl h-[600px] overflow-auto relative p-6 flex flex-col gap-4 transition-all duration-300 " +
                                    (animatePopup ? "opacity-100 scale-100" : "opacity-0 scale-95") +
                                    (animatePopDown ? " opacity-0 scale-95" : "")
                                }
                            >

                                <div className='sticky top-0 bg-neutral-100 py-3 text-center text-4xl font-bold text-[#14121F] font-serif z-10'>
                                    {listType}
                                </div>

                                {(list.length == 0) && (
                                    <div className='flex justify-center py-10'>
                                        <video
                                            src={loading}
                                            autoPlay
                                            loop
                                            className='h-20'
                                        />
                                    </div>
                                )}

                                {
                                    list.map((key, ind) =>
                                        ind !== 0 ? (
                                            <div
                                                key={ind}
                                                onClick={() => handelPdf(key)}
                                                className='w-full min-h-14 bg-white border border-zinc-200 rounded-xl flex items-center justify-center text-lg font-semibold text-[#14121F] hover:bg-[#a6e62d] transition-all duration-200 cursor-pointer'
                                            >
                                                {helper(key)}
                                            </div>
                                        ) : null
                                    )
                                }

                                <button
                                    onClick={handelCancel}
                                    className='absolute top-5 left-5 z-30 cursor-pointer hover:scale-95 transition-all'
                                >
                                    <img
                                        src={cross}
                                        className='h-8 select-none'
                                        alt=""
                                    />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Cards */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full max-w-5xl">

                        {/* Paper 1 */}
                        <div
                            onClick={handelPaper1}
                            className={
                                "relative bg-neutral-100 text-[#14121F] rounded-2xl p-6 flex flex-col gap-3 w-full sm:w-[320px] transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-[0_0_20px_#a6e62d] " +
                                ((lock == "Paper1") ? "opacity-80" : "")
                            }
                        >

                            {(lock == "Paper1") && (
                                <div className='absolute inset-0 backdrop-blur-[2px] bg-black/10 rounded-2xl flex items-center justify-center z-10'>
                                    <img src={l} className='h-24' alt="" />
                                </div>
                            )}

                            <div className="text-center">
                                <div className="text-2xl font-bold">
                                    The Hindu
                                </div>

                                <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                                    Daily Editorial
                                </div>
                            </div>

                            <div className="w-full flex justify-center">
                                <img
                                    src={bp}
                                    className='h-[200px] rounded-2xl object-cover border'
                                    alt=""
                                />
                            </div>

                            <p className="text-sm text-gray-500 leading-relaxed text-center">
                                Start your day with sharp headlines and in-depth morning reads.
                            </p>

                            <div className="border-t border-gray-200" />


                            <button
                                className="mt-2 w-full py-3 rounded-xl bg-[#a6e62d] text-[#14121F] font-bold text-sm hover:bg-[#14121F] hover:text-white transition-all duration-200 cursor-pointer"
                            >
                                Read Now →
                            </button>
                        </div>

                        {/* Paper 2 */}
                        <div
                            onClick={handelPaper2}
                            className={
                                "relative bg-neutral-100 text-[#14121F] rounded-2xl p-6 flex flex-col gap-3 w-full sm:w-[320px] transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-[0_0_20px_#a6e62d] " +
                                ((lock == "Paper2") ? "opacity-80" : "")
                            }
                        >

                            {(lock == "Paper2") && (
                                <div className='absolute inset-0 backdrop-blur-[2px] bg-black/10 rounded-2xl flex items-center justify-center z-10'>
                                    <img src={l} className='h-24' alt="" />
                                </div>
                            )}

                            <div className="text-center">
                                <div className="text-2xl font-bold">
                                    Times Of India
                                </div>

                                <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                                    Smart Briefings
                                </div>
                            </div>

                            <div className="w-full flex justify-center">
                                <img
                                    src={bp}
                                    className='h-[200px] rounded-2xl object-cover border'
                                    alt=""
                                />
                            </div>

                            <p className="text-sm text-gray-500 leading-relaxed text-center">
                                Kick off your day with smart news and complete briefings.
                            </p>

                            <div className="border-t border-gray-200" />

                            <button
                                className="mt-2 w-full py-3 rounded-xl bg-[#a6e62d] text-[#14121F] font-bold text-sm hover:bg-[#14121F] hover:text-white transition-all duration-200 cursor-pointer"
                            >
                                Read Now →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {(loadingPage == true) && (
                <div className='h-screen w-screen fixed top-0 left-0 flex items-center justify-center bg-[#14121F] z-50'>
                    <img
                        src={loader}
                        className='select-none h-30'
                        alt=""
                    />
                </div>
            )}
        </>
    );
};

export default Content;