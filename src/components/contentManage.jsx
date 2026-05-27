import React, { useState, useEffect } from 'react'

const ContentManage = ({ ct, sct, up, sup }) => {
    const [objects, setObjects] = useState([])
    const [size, setsize] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!ct) return
        setLoading(true);

        (async () => {
            try {
                const res = await fetch(
                    import.meta.env.VITE_API_URL + `/editContent/get?type=${ct}/`,
                    {
                        method: 'GET',
                        credentials: 'include',
                    }
                )

                const data = await res.json()

                if (data.keys) {
                    setObjects(data.keys)
                    setsize(Math.max(data.size, 0))
                }
            } catch (err) {
                console.error('Fetch error:', err)
            } finally {
                setLoading(false)
            }
        })()
    }, [ct])

    const helper = (str) => str.split('/').pop()

    const handelDelete = async (key) => {
        const ok = window.confirm(
            `Are you sure you want to delete "${helper(key)}" ?`
        )

        if (!ok) return

        try {
            const res = await fetch(
                import.meta.env.VITE_API_URL + `/editContent/delete?key=${key}`,
                {
                    method: 'GET',
                    credentials: 'include',
                }
            )

            const data = await res.json()

            if (data.keys) {
                setObjects(data.keys)
                setsize(Math.max(data.size, 0))
            }
        } catch (err) {
            console.error('Fetch error:', err)
        }
    }

    const items = objects.filter((_, i) => i !== 0)

    if (!ct) return null

    return (
        <div className="h-full w-full flex flex-col overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-900">{ct}</span>

                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {size} file{size !== 1 ? 's' : ''}
                    </span>
                </div>

                <button
                    onClick={() => sct(null)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-600"
                    aria-label="Close"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            {/* File list */}
            <div className="flex-1 overflow-y-auto px-3 py-3">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                        <div className="w-6 h-6 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />

                        <p className="text-xs text-zinc-400">
                            Loading files…
                        </p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-zinc-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>

                        <p className="text-sm font-medium text-zinc-500">
                            No files yet
                        </p>

                        <p className="text-xs text-zinc-400">
                            Upload a file using the button below
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1.5">
                        {items.map((key, ind) => (
                            <div
                                key={ind}
                                className="group flex items-center gap-3 px-3 py-2.5 rounded-lg border border-zinc-100 hover:border-amber-200 hover:bg-amber-50/60 transition-all"
                            >
                                <div className="w-8 h-8 rounded-lg bg-zinc-100 group-hover:bg-amber-100 flex items-center justify-center shrink-0 transition-colors">
                                    <svg
                                        className="w-4 h-4 text-zinc-400 group-hover:text-amber-600 transition-colors"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>

                                <span className="flex-1 min-w-0 text-sm text-zinc-700 font-medium truncate">
                                    {helper(key)}
                                </span>

                                <button
                                    onClick={() => handelDelete(key)}
                                    className="w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-all shrink-0"
                                    aria-label="Delete file"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer upload button */}
            <div className="px-3 py-3 border-t border-zinc-100 shrink-0">
                <button
                    onClick={() => sup(!up)}
                    className="w-full h-10 flex items-center justify-center gap-2 rounded-lg bg-amber-300 hover:bg-amber-400 text-amber-900 text-sm font-medium transition-colors"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>

                    Upload file
                </button>
            </div>
        </div>
    )
}

export default ContentManage