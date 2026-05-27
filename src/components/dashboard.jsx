import React from 'react'
import { useState, useEffect, useRef } from 'react'
import ContentManage from './contentManage.jsx';
import upload from '../assets/upload.webm'

const Dashboard = () => {
    const [addAdmin, setaddAdmin] = useState('')
    const [editStatus, seteditStatus] = useState('')
    const [addPremium, setaddPremium] = useState('')
    const [selected, setSelected] = useState('')
    const [selectedPaper, setSelectedPaper] = useState('')
    const [premiumStatus, setpremiumStatus] = useState(null)
    const [Check, setCheck] = useState(false)
    const [ContentType, setContentType] = useState(null)
    const [uploadPannel, setuploadPannel] = useState(false)
    const fileInputRef = useRef(null)
    const [file, setfile] = useState(null)
    const [uploaded, setuploaded] = useState(false)
    const [err, seterr] = useState(false)
    const [percentage, setpercentage] = useState(0)

    const handelpannel = () => {
        if (uploaded) setuploaded(false)
        setContentType(null)
        setuploadPannel(false)
    }

    useEffect(() => { document.title = 'Dashboard' }, [])

    const handelPost = async () => {
        if (!file) {
            seterr(true)
            setTimeout(() => seterr(false), 5000)
            return
        }
        const res = await fetch(import.meta.env.VITE_API_URL + `/editContent/upload?folder=${ContentType}`, {
            method: 'GET', credentials: 'include',
        })
        const data = await res.json()
        try {
            const xhr = new XMLHttpRequest()
            xhr.open('PUT', data.Url, true)
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) setpercentage(((event.loaded / event.total) * 100).toFixed(2))
            }
            xhr.onload = () => { setuploaded(true); setfile(null) }
            xhr.send(file)
        } catch (error) { console.error('Upload error:', error) }
    }

    const handleClick = () => fileInputRef.current.click()

    const handelFilechange = (e) => setfile(e.target.files[0])

    useEffect(() => {
        (async () => {
            const res = await fetch(import.meta.env.VITE_API_URL + '/admin/check', { method: 'GET', credentials: 'include' })
            const data = await res.text()
            setCheck(data === 'true')
        })()
    }, [])

    const handelAdd = async () => {
        const res = await fetch(import.meta.env.VITE_API_URL + '/admin/newmember', {
            method: 'POST',
            body: JSON.stringify({ email: addAdmin }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
            credentials: 'include'
        })
        setaddAdmin('')
        const data = await res.json()
        seteditStatus(data.status)
        setTimeout(() => seteditStatus(''), 10000)
    }

    const handelRemove = async () => {
        const res = await fetch(import.meta.env.VITE_API_URL + '/admin/remove', {
            method: 'POST',
            body: JSON.stringify({ email: addAdmin }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
            credentials: 'include'
        })
        setaddAdmin('')
        const data = await res.json()
        seteditStatus(data.status)
        setTimeout(() => seteditStatus(''), 10000)
    }

    const handelProceed = async () => {
        if (!selected || !addPremium || !selectedPaper) {
            setpremiumStatus('Fill all fields')
            setTimeout(() => setpremiumStatus(''), 5000)
            setaddPremium('')
            return
        }
        const res = await fetch(import.meta.env.VITE_API_URL + '/admin/premium', {
            method: 'POST',
            body: JSON.stringify({ email: addPremium, Type: selected, PaperType: selectedPaper }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
            credentials: 'include'
        })
        setaddPremium('')
        const data = await res.json()
        setpremiumStatus(data.status)
        setTimeout(() => setpremiumStatus(''), 5000)
    }

    if (!Check) {
        return (
            <div className="min-h-screen w-full bg-[#14121F] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-zinc-400 text-lg">Access denied</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full bg-[#14121F] pt-25 px-6 pb-8 font-serif">

            {/* Upload Modal */}
            {uploadPannel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="px-6 pt-6 pb-4 border-b border-zinc-100">
                            <h2 className="text-xl font-semibold text-zinc-900">Upload file</h2>
                            <p className="text-sm text-zinc-500 mt-0.5">Uploading to <span className="font-medium text-zinc-700">{ContentType}</span></p>
                        </div>

                        <div className="px-6 py-5 min-h-[140px] flex flex-col gap-3">
                            {uploaded && (
                                <div className="flex flex-col items-center gap-2 py-2">
                                    <video src={upload} autoPlay muted onEnded={(e) => e.target.pause()} playsInline className="h-24" />
                                    <p className="text-sm font-medium text-emerald-600">Upload complete!</p>
                                </div>
                            )}

                            {err && (
                                <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100">
                                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Please select a file before uploading
                                </div>
                            )}

                            {file && (
                                <div className="relative h-11 rounded-lg border border-zinc-200 bg-zinc-50 overflow-hidden flex items-center px-4">
                                    <div
                                        className="absolute inset-y-0 left-0 bg-amber-200 transition-all duration-300"
                                        style={{ width: `${percentage}%` }}
                                    />
                                    <span className="relative z-10 text-sm font-medium text-zinc-700 truncate">{file.name}</span>
                                    <span className="relative z-10 ml-auto text-xs text-zinc-500 shrink-0 pl-2">{percentage}%</span>
                                </div>
                            )}

                            {!uploaded && !file && (
                                <div
                                    onClick={handleClick}
                                    className="border-2 border-dashed border-zinc-200 rounded-xl h-24 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-amber-300 hover:bg-amber-50/50 transition-colors"
                                >
                                    <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <span className="text-sm text-zinc-500">Click to select a file</span>
                                </div>
                            )}
                        </div>

                        <div className="px-6 pb-6 flex items-center justify-end gap-2">
                            {!uploaded && (
                                <>
                                    <button onClick={handleClick} className="px-4 py-2 text-sm rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-medium transition-colors">
                                        {file ? 'Change file' : 'Select file'}
                                    </button>
                                    <input type="file" ref={fileInputRef} className="hidden" onChange={handelFilechange} />
                                    <button onClick={handelPost} className="px-4 py-2 text-sm rounded-lg bg-amber-300 hover:bg-amber-400 text-amber-900 font-medium transition-colors">
                                        Upload
                                    </button>
                                </>
                            )}
                            <button onClick={handelpannel} className="px-4 py-2 text-sm rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-600 font-medium transition-colors">
                                {uploaded ? 'Close' : 'Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Page header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className=" text-sm mt-0.5">Manage admins, subscriptions, and content</p>
            </div>

            {/* Top cards row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                {/* Admin Editor */}
                <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-zinc-900">Admin editor</h2>
                        <p className="text-sm text-zinc-500">Add or remove admin accounts</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <input
                            type="text"
                            className="flex-1 min-w-0 h-10 border border-zinc-200 rounded-lg px-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                            placeholder="Email address"
                            value={addAdmin}
                            onChange={(e) => setaddAdmin(e.target.value)}
                        />
                        <button onClick={handelAdd} className="h-10 px-4 rounded-lg bg-amber-300 hover:bg-amber-400 text-amber-900 text-sm font-medium transition-colors whitespace-nowrap">
                            Add
                        </button>
                        <button onClick={handelRemove} className="h-10 px-4 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-sm font-medium transition-colors whitespace-nowrap">
                            Remove
                        </button>
                    </div>
                    <div className="rounded-lg bg-zinc-50 border border-zinc-100 px-4 py-3 min-h-[52px] flex items-center">
                        {editStatus
                            ? <p className="text-sm text-zinc-700">{editStatus}</p>
                            : <p className="text-sm text-zinc-400">Result will appear here</p>
                        }
                    </div>
                </div>

                {/* Premium Editor */}
                <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-zinc-900">Premium editor</h2>
                        <p className="text-sm text-zinc-500">Manage user subscription tiers</p>
                    </div>
                    <div className="flex gap-2 items-center flex-wrap">
                        <input
                            type="text"
                            className="flex-1 min-w-[140px] h-10 border border-zinc-200 rounded-lg px-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                            placeholder="Email address"
                            value={addPremium}
                            onChange={(e) => setaddPremium(e.target.value)}
                        />
                        <select
                            value={selected}
                            onChange={(e) => setSelected(e.target.value)}
                            className="h-10 border border-zinc-200 rounded-lg px-3 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent bg-white"
                        >
                            <option value="">Type</option>
                            <option value="Basic">Basic</option>
                            <option value="Medium">Medium</option>
                            <option value="Advance">Advance</option>
                        </select>
                        <select
                            value={selectedPaper}
                            onChange={(e) => setSelectedPaper(e.target.value)}
                            className="h-10 border border-zinc-200 rounded-lg px-3 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent bg-white"
                        >
                            <option value="">Paper</option>
                            <option value="Paper1">Paper 1</option>
                            <option value="Paper2">Paper 2</option>
                            <option value="Full Access">Full Access</option>
                        </select>
                        <button onClick={handelProceed} className="h-10 px-4 rounded-lg bg-amber-300 hover:bg-amber-400 text-amber-900 text-sm font-medium transition-colors whitespace-nowrap">
                            Proceed
                        </button>
                    </div>
                    <div className="rounded-lg bg-zinc-50 border border-zinc-100 px-4 py-3 min-h-[52px] flex items-center">
                        {premiumStatus
                            ? <p className="text-sm text-zinc-700">{premiumStatus}</p>
                            : <p className="text-sm text-zinc-400">Result will appear here</p>
                        }
                    </div>
                </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-zinc-900">Content editor</h2>
                    <p className="text-sm text-zinc-500">Select a paper to manage its content</p>
                </div>
                <div className="flex gap-4 h-[420px]">

                    {/* Sidebar */}
                    <div className="w-44 shrink-0 flex flex-col gap-2">
                        {['Paper1', 'Paper2'].map((paper) => (
                            <button
                                key={paper}
                                onClick={() => setContentType(paper)}
                                className={
                                    'w-full h-16 rounded-xl border text-sm font-medium transition-all duration-200 flex items-center justify-center ' +
                                    (ContentType === paper
                                        ? 'border-amber-300 bg-amber-50 text-amber-800 shadow-sm'
                                        : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50')
                                }
                            >
                                {paper}
                            </button>
                        ))}
                    </div>

                    {/* Content panel */}
                    <div className="flex-1 rounded-xl border border-zinc-200 overflow-hidden">
                        {ContentType
                            ? <ContentManage ct={ContentType} sct={setContentType} up={uploadPannel} sup={setuploadPannel} />
                            : (
                                <div className="h-full flex flex-col items-center justify-center gap-2 text-center px-8">
                                    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center mb-1">
                                        <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-zinc-500">Select a paper to get started</p>
                                    <p className="text-xs text-zinc-400">Choose Paper 1 or Paper 2 from the left</p>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard