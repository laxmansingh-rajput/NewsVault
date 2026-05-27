import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import next from '../assets/next.svg'
import { redirect, useLocation } from 'react-router-dom';
import date from "../assets/date.svg"
import pdf from "../assets/pdf.webm"
import loading from '../assets/loading.webm'
import prev from '../assets/prev.svg'
import badi from '../assets/zoomout.svg'
import choti from '../assets/zoomin.svg'
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function Pdfviewer() {
    useEffect(() => {
        document.title = "Read"
    }, [])

    const location = useLocation();
    const [numPages, setNumPages] = useState(null);
    const [currPage, setcurrPage] = useState(1)
    const [input, setinput] = useState("1")
    const [width, setwidth] = useState(Math.min(window.innerWidth, 1600));
    const [url, seturl] = useState("")
    let key = location.state?.Key
    let type = location.state?.ct
    useEffect(() => {
        (async () => {
            const res = await fetch(import.meta.env.VITE_API_URL+`/content/pdfAccess?type=${type}&key=${key}`, {
                method: 'GET',
                credentials: 'include',
            });
            let data = await res.json()
            if (data.status) {
                seturl(data.url)
            }
        })()
    }, [])

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            blurHandel();
        }
    };
    const Loader = () => (
        <div className="flex justify-center items-center h-screen w-screen bg-[#14121F]  flex-col gap-5 fixed top-0 left-0 z-50  ">
            <video src={loading} className="w-25 h-25" autoPlay loop></video>
        </div>
    );

    const handelChange = (e) => {
        setinput(e.target.value);
    }
    const blurHandel = () => {
        const parsed = parseInt(input);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= numPages) {
            setcurrPage(parsed);
        }
    }
    const handelbada = () => setwidth(prev => Math.min(prev + 50, 1600));
    const handelchota = () => setwidth(prev => Math.max(prev - 50, 300));

    const handelPrev = () => {
        let nextPage = currPage - 1
        setcurrPage(currPage - 1)
        setinput(String(nextPage));
    }
    const handelNext = () => {
        let nextPage = currPage + 1
        setcurrPage(currPage + 1)
        setinput(String(nextPage));
    }
    const helper = (key) => {
        let arr = key.split("/")
        let a = arr[arr.length - 1]
        let arr2 = a.split("[")
        let b = arr2[0]
        let arr3 = arr2[1].split("]")
        return { name: b, date: arr3[0] }
    }
    const handelPdfView = () => {
        (async () => {
            const res = await fetch(import.meta.env.VITE_API_URL+`/content/pdfAccess?type=${type}&key=${key}`, {
                method: 'GET',
                credentials: 'include',
            });
            let data = await res.json()
            if (data.status) {
                window.open(data.url, '_blank', 'noopener,noreferrer');
            }
        })()
    }
    return (
        <div className=" w-screen h-screen flex justify-center bg-[#14121F] overflow-auto p-2 pt-0 ">
            <div className=" fixed top-0 h-12  w-[101vw] rounded-b-md bg-white  z-30   shadow-xl flex items-center justify-between text-[#14121F]  font-bold
             font-sans text-xl p-8 max-[580px]:p-5">
                <div className="flex items-center justify-center gap-10 max-[580px]:gap-0 max-[580px]:w-full max-[580px]:justify-between ">
                    <div>
                        ePaper |<span className="font-normal"> {helper(key).name}</span>
                    </div>
                    <button className=" border-2 h-7 rounded-md w-25 flex items-center justify-around text-sm p-2 pt-1 pb-1 border-[#a6e62d] text-[#a6e62d] font-medium 
                    cursor-pointer " onClick={handelPdfView}>
                        <video src={pdf} autoPlay loop className="h-6 cursor-pointer"></video>
                        <span className="cursor-pointer">pdf view</span>
                    </button>
                </div>
                <div className="flex items-center justify-around max-[580px]:hidden">
                    <img src={date} className="h-8" alt="" />
                    <span className="font-medium">
                        {helper(key).date}
                    </span>
                </div>
            </div>
            <div className="h-15 w-[93%] rounded-full bg-neutral-100 fixed bottom-5 text-amber-50 z-20 flex justify-center  items-center 
      gap-10 opacity-95 box-border  text-xl border-1 border-[#14121F] pl-5 pr-5 pt-4 pb-4">
                <div className="h-14  w-14  flex justify-center items-center mr-auto">
                    <img src={prev} className={"h-10 " + (currPage == 1 ? "hidden" : "")} onClick={handelPrev} alt="" />
                </div>
                <div className="flex justify-center item-center gap-2 max-[550px]:hidden">
                    <img src={badi} className="h-8" alt="" onClick={handelbada} />
                    <div className="h-8 border-1  border-[#14121F]"></div>
                    <img src={choti} className="h-8" alt="" onClick={handelchota} />
                </div>
                <div className="flex items-center justify-center gap-3">
                    <div className="bg-white w-10 h-10 rounded-md text-black flex items-center justify-center ">
                        <input type="text" className="bg-white w-8 h-8 text-black text-center" value={input} onChange={(e) => handelChange(e)}
                            onBlur={blurHandel} onKeyDown={handleKeyDown} />
                    </div>
                    <p className=" text-2xl text-black">
                        of
                    </p>
                    <div className="bg-white w-10 h-10 rounded-md text-black flex items-center justify-center">
                        <div className="bg-white w-8 h-8 text-black flex justify-center items-center" >{numPages}</div>
                    </div>
                </div>
                <div className="h-14  w-14  flex justify-center items-center ml-auto" >
                    <img src={next} className={"h-10 " + (currPage == numPages ? "hidden" : "")} alt="" onClick={handelNext} />
                </div>
            </div>

            <div className=" shadow   mt-10  overflow-autoflex    justify-center">
                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess} loading={Loader}
                >
                    <Page pageNumber={currPage} width={width} />
                </Document>
                <div className="h-20">
                </div>
            </div>
        </div>
    );
}

export default Pdfviewer;
