import React from 'react'
import Select from './select.jsx'
import { useState, useEffect } from 'react'
import Upgrade from './upgrade.jsx'

const plans = [
    {
        name: "PrepLite",
        price: "49",
        period: "/month",
        tagline: "Single Paper",
        description: "Perfect for focused aspirants who want to stay consistent with one paper.",
        features: ["Daily paper for 30 days", "Single paper of your choice"],
        badge: null,
        onClick: "select",
    },
    {
        name: "PrepPlus",
        price: "89",
        period: "/month",
        tagline: "Dual Paper",
        description: "Perfect for aspirants who want to stay consistent with a multi-exam strategy.",
        features: ["Daily paper for 30 days", "2 curated papers daily"],
        badge: "Popular",
        onClick: "order2",
    },
    {
        name: "PrepPro",
        price: "250",
        period: "/3 months",
        tagline: "Full Access",
        description: "Stay three steps ahead without burning your pocket. Long-term consistency with full dual-paper access.",
        features: ["Daily paper for 3 months", "2 curated papers daily"],
        badge: "Best Value",
        onClick: "order3",
    },
]

const Plan = () => {
    const [select, setselect] = useState(false)
    const [upgradeIssue, setupgradeIssue] = useState(null)

    const handelSelect = () => setselect(!select)

    useEffect(() => {
        document.title = "Plans"
    }, [])

    const pay = (id, amount, o_id) => {
        var options = {
            key: id,
            amount: amount,
            currency: "INR",
            name: "newsVault",
            description: "Test Transaction",
            image: "https://example.com/your_logo",
            order_id: o_id,
            callback_url: import.meta.env.VITE_API_URL + "/pay/verify",
            prefill: { name: "Gaurav Kumar", email: "gaurav.kumar@example.com", contact: "9000090000" },
            theme: { color: "#a6e62d" }
        };
        var rzp1 = new Razorpay(options);
        rzp1.open();
    }

    const handelOrder3 = async () => {
        let res = await fetch(import.meta.env.VITE_API_URL + '/pay/order?type=Order3&paper=Full-Access', { method: "GET", credentials: "include" })
        let data = await res.json()
        if (data.order && data.key) pay(data.key, data.order.amount, data.order.id)
        if (data.upgrade) setupgradeIssue(data.upgrade)
    }

    const handelOrder2 = async () => {
        let res = await fetch(import.meta.env.VITE_API_URL + '/pay/order?type=Order2&paper=Full-Access', { method: "GET", credentials: "include" })
        let data = await res.json()
        if (data.order && data.key) pay(data.key, data.order.amount, data.order.id)
        if (data.upgrade) setupgradeIssue(data.upgrade)
    }

    const getHandler = (type) => {
        if (type === "select") return handelSelect
        if (type === "order2") return handelOrder2
        if (type === "order3") return handelOrder3
    }

    return (
        <>
            {select && <Select handelSelect={handelSelect} pay={pay} setselect={setselect} upgradeIssue={upgradeIssue} setupgradeIssue={setupgradeIssue} />}
            {upgradeIssue && <Upgrade updgrade={upgradeIssue} setupgrade={setupgradeIssue} />}

            <div className="bg-[#14121F] min-h-screen w-full font-serif flex flex-col items-center justify-center px-6 pt-24 pb-16 gap-6">

                {/* Header */}
                <div className="text-center mb-4">
                    <span className="text-xl font-bold uppercase tracking-widest text-[#a6e62d] bg-[#1e1c2e] px-3 py-1 rounded-full">
                        Choose your plan
                    </span>              
                </div>

                {/* Cards */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-5xl">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative bg-neutral-100 text-[#14121F] rounded-2xl p-6 flex flex-col gap-4 w-full sm:w-[280px] lg:w-[300px]
                                transition-all duration-500 ease-in-out
                                hover:drop-shadow-[0_0_18px_#a6e62d] hover:-translate-y-2
                                ${plan.badge === "Popular" ? "ring-2 ring-[#a6e62d]" : ""}
                            `}
                        >
                            {/* Badge */}
                            {plan.badge && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#a6e62d] text-[#14121F] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">
                                    {plan.badge}
                                </span>
                            )}

                            {/* Plan name + tagline */}
                            <div className="text-center">
                                <div className="text-xl font-bold">{plan.name}</div>
                                <div className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-1">{plan.tagline}</div>
                            </div>

                            {/* Price */}
                            <div className="flex items-end gap-1">
                                <span className="text-5xl font-bold font-mono">₹{plan.price}</span>
                                <span className="text-sm text-gray-500 mb-1">{plan.period}</span>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-500 leading-relaxed min-h-[56px]">
                                {plan.description}
                            </p>

                            {/* Divider */}
                            <div className="border-t border-gray-200" />

                            {/* Features */}
                            <ul className="flex flex-col gap-2 text-sm font-medium">
                                {plan.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <span className="text-[#a6e62d] bg-[#14121F] rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0">✓</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <button
                                onClick={getHandler(plan.onClick)}
                                className="mt-2 w-full py-3 rounded-xl bg-[#a6e62d] text-[#14121F] font-bold text-sm
                                    hover:bg-[#14121F] hover:text-white transition-all duration-200 ease-in cursor-pointer hover:scale-95"
                            >
                                Get started →
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Plan