import React from 'react'
import cross from '../assets/ucross.svg'
import { useState, useEffect } from 'react'

const papers = [
    { label: "The Hindu", value: "Paper1" },
    { label: "Times of India", value: "Paper2" },
]

const Select = ({ handelSelect, pay, setselect, setupgradeIssue }) => {
    const [pop, setpop] = useState(false)

    useEffect(() => {
        setTimeout(() => setpop(true), 10)
    }, [])

    const handelOrder1 = async (paper) => {
        let res = await fetch(import.meta.env.VITE_API_URL + `/pay/order?type=Order1&paper=${paper}`, {
            method: "GET",
            credentials: "include"
        })
        let data = await res.json()
        if (data.order && data.key) pay(data.key, data.order.amount, data.order.id)
        if (data.upgrade) setupgradeIssue(data.upgrade)
        setselect(false)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 font-serif px-4">
            <div className={`relative bg-neutral-100 text-[#14121F] rounded-2xl p-8 w-full max-w-sm flex flex-col gap-6
                shadow-[0_0_40px_rgba(166,230,45,0.15)] border border-neutral-200
                transition-all duration-300 ease-out
                ${pop ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            >
                {/* Close button */}
                <button
                    onClick={handelSelect}
                    className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-200 transition-all duration-150 cursor-pointer"
                >
                    <img src={cross} className="h-4 w-4" alt="close" />
                </button>

                {/* Header */}
                <div className="flex flex-col gap-1 pr-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#a6e62d] bg-[#14121F] w-fit px-3 py-1 rounded-full">
                        PrepLite
                    </span>
                    <h2 className="text-xl font-bold mt-2">Choose your paper</h2>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Select the newspaper you'd like to receive daily for your PrepLite journey.
                    </p>
                </div>

                {/* Divider */}
                <div className="border-t border-neutral-200" />

                {/* Paper options */}
                <div className="flex flex-col gap-3">
                    {papers.map((p) => (
                        <button
                            key={p.value}
                            onClick={() => handelOrder1(p.value)}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-neutral-200
                                hover:border-[#a6e62d] hover:bg-[#f7fde8] transition-all duration-200 ease-in cursor-pointer group"
                        >
                            <span className="font-semibold text-sm">{p.label}</span>
                            <span className="text-[#a6e62d] opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-bold">
                                Select →
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Select