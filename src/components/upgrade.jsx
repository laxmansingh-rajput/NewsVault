import React from 'react'
import cross from '../assets/ucross.svg'
import { useState, useEffect } from 'react'

const Upgrade = ({ updgrade, setupgrade }) => {
    const [pop, setpop] = useState(false)

    useEffect(() => {
        setTimeout(() => setpop(true), 10)
    }, [])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 font-serif px-4">
            <div className={`relative bg-neutral-100 text-[#14121F] rounded-2xl p-8 w-full max-w-sm flex flex-col gap-5
                shadow-[0_0_40px_rgba(166,230,45,0.15)] border border-neutral-200
                transition-all duration-300 ease-out
                ${pop ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            >
                {/* Close button */}
                <button
                    onClick={() => setupgrade(null)}
                    className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-200 transition-all duration-150 cursor-pointer"
                >
                    <img src={cross} className="h-4 w-4" alt="close" />
                </button>

                {/* Icon + Header */}
                <div className="flex items-center justify-center  gap-3 pr-6">
                    <h2 className="text-xl font-bold">Alert</h2>
                </div>

                {/* Divider */}
                <div className="border-t border-neutral-200" />

                {/* Message */}
                <p className="text-sm text-gray-600 leading-relaxed">
                    {updgrade}
                </p>

                {/* Dismiss */}
                <button
                    onClick={() => setupgrade(null)}
                    className="w-full py-3 rounded-xl bg-[#14121F] text-white font-bold text-sm
                        hover:bg-[#a6e62d] hover:text-[#14121F] transition-all duration-200 cursor-pointer"
                >
                    Got it
                </button>
            </div>
        </div>
    )
}

export default Upgrade