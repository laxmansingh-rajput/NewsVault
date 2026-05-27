import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import next from '../assets/next.svg';
import { useLocation } from 'react-router-dom';
import date from "../assets/date.svg";
import pdf from "../assets/pdf.webm";
import loading from '../assets/loading.webm';
import prev from '../assets/prev.svg';
import badi from '../assets/zoomout.svg';
import choti from '../assets/zoomin.svg';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function Pdfviewer() {
    const location = useLocation();
    const [numPages, setNumPages] = useState(null);
    const [currPage, setcurrPage] = useState(1);
    const [input, setinput] = useState("1");
    const [width, setwidth] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    const url = location.state?.url || "";
    const key = location.state?.Key || "";

    // Initialize width based on device
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setwidth(mobile ? window.innerWidth - 20 : Math.min(window.innerWidth * 0.9, 1200));
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            blurHandel();
        }
    };

    const Loader = () => (
        <div className="flex justify-center items-center h-screen w-screen bg-[#14121F] flex-col gap-5 fixed top-0 left-0 z-50">
            <video src={loading} className="w-25 h-25" autoPlay loop muted playsInline></video>
        </div>
    );

    const handelChange = (e) => {
        setinput(e.target.value);
    };

    const blurHandel = () => {
        const parsed = parseInt(input);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= numPages) {
            setcurrPage(parsed);
        }
    };

    const handelbada = () => {
        const maxWidth = isMobile ? window.innerWidth + 200 : 1600;
        setwidth(prev => Math.min(prev + (isMobile ? 30 : 50), maxWidth));
    };

    const handelchota = () => {
        const minWidth = isMobile ? 250 : 300;
        setwidth(prev => Math.max(prev - (isMobile ? 30 : 50), minWidth));
    };

    const handelPrev = () => {
        if (currPage > 1) {
            const nextPage = currPage - 1;
            setcurrPage(nextPage);
            setinput(String(nextPage));
        }
    };

    const handelNext = () => {
        if (currPage < numPages) {
            const nextPage = currPage + 1;
            setcurrPage(nextPage);
            setinput(String(nextPage));
        }
    };

    const helper = (key) => {
        if (!key || typeof key !== 'string') {
            return { name: "Unknown", date: "Unknown" };
        }

        try {
            const fileName = key.split("/").pop();
            const [namePart, datePartWithBracket] = fileName.split("[");
            const date = datePartWithBracket?.split("]")[0];

            return {
                name: namePart || "Unknown",
                date: date || "Unknown"
            };
        } catch (err) {
            return { name: "Unknown", date: "Unknown" };
        }
    };

    const handelPdfView = () => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    // Handle swipe gestures for mobile
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && currPage < numPages) {
            handelNext();
        }
        if (isRightSwipe && currPage > 1) {
            handelPrev();
        }
    };

    if (!url) {
        return (
            <div className="w-screen h-screen flex justify-center items-center bg-[#14121F] text-white">
                <div className="text-center">
                    <h2 className="text-2xl mb-4">No PDF URL provided</h2>
                    <p>Please navigate to this page with a valid PDF URL</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-screen h-screen flex justify-center bg-[#14121F] overflow-auto p-2 pt-0">
            {/* Header */}
            <div className="fixed top-0 h-12 w-full max-w-full rounded-b-md bg-white z-30 shadow-xl flex items-center justify-between text-[#14121F] font-bold font-sans text-xl px-4 sm:px-8">
                <div className="flex items-center justify-center gap-4 sm:gap-10 flex-1">
                    <div className="text-sm sm:text-xl">
                        ePaper |<span className="font-normal"> Times Of India</span>
                    </div>
                    <button
                        className="border-2 h-7 rounded-md px-2 flex items-center justify-center gap-2 text-xs sm:text-sm border-[#a6e62d] text-[#a6e62d] font-medium cursor-pointer"
                        onClick={handelPdfView}
                    >
                        <video src={pdf} autoPlay loop muted playsInline className="h-4 sm:h-6 cursor-pointer"></video>
                        <span className="cursor-pointer whitespace-nowrap">pdf view</span>
                    </button>
                </div>
                <div className="hidden sm:flex items-center justify-around gap-2">
                    <img src={date} className="h-8" alt="" />
                    <span className="font-medium text-sm">
                        {helper(key).date}
                    </span>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-5 left-2 right-2 sm:left-auto sm:right-auto sm:w-[93%] max-w-4xl mx-auto rounded-full bg-neutral-100 text-amber-50 z-20 flex justify-center items-center gap-2 sm:gap-10 opacity-95 box-border text-xl border-1 border-[#14121F] p-2 sm:p-4">
                {/* Previous Button */}
                <div className="h-10 w-10 sm:h-14 sm:w-14 flex justify-center items-center">
                    <img 
                        src={prev} 
                        className={`h-6 sm:h-10 cursor-pointer ${currPage === 1 ? "opacity-30" : ""}`} 
                        onClick={handelPrev} 
                        alt="" 
                    />
                </div>

                {/* Zoom Controls - Hidden on small mobile */}
                <div className="hidden sm:flex justify-center items-center gap-2">
                    <img src={badi} className="h-8 cursor-pointer" alt="" onClick={handelbada} />
                    <div className="h-8 border-1 border-[#14121F]"></div>
                    <img src={choti} className="h-8 cursor-pointer" alt="" onClick={handelchota} />
                </div>

                {/* Page Counter */}
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <div className="bg-white w-8 h-8 sm:w-10 sm:h-10 rounded-md text-black flex items-center justify-center">
                        <input
                            type="number"
                            className="bg-white w-6 h-6 sm:w-8 sm:h-8 text-black text-center text-sm sm:text-base"
                            value={input}
                            onChange={handelChange}
                            onBlur={blurHandel}
                            onKeyDown={handleKeyDown}
                            min="1"
                            max={numPages}
                        />
                    </div>
                    <p className="text-sm sm:text-2xl text-black">of</p>
                    <div className="bg-white w-8 h-8 sm:w-10 sm:h-10 rounded-md text-black flex items-center justify-center">
                        <div className="bg-white w-6 h-6 sm:w-8 sm:h-8 text-black flex justify-center items-center text-sm sm:text-base">
                            {numPages}
                        </div>
                    </div>
                </div>

                {/* Next Button */}
                <div className="h-10 w-10 sm:h-14 sm:w-14 flex justify-center items-center">
                    <img 
                        src={next} 
                        className={`h-6 sm:h-10 cursor-pointer ${currPage === numPages ? "opacity-30" : ""}`} 
                        onClick={handelNext} 
                        alt="" 
                    />
                </div>
            </div>

            {/* PDF Document */}
            <div 
                className="shadow mt-10 overflow-auto flex justify-center pb-20"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <Document 
                    file={"https://laxmatest1.s3.ap-south-1.amazonaws.com/Paper2/Paper2%5B05-07-2025%5D.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAYGOBSAUARELIDKCE%2F20250713%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250713T072937Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmFwLXNvdXRoLTEiSDBGAiEA3GA0%2B1NztaEHGCPBXyKCpRUSmyDqtIwPLYVMNNwfuP4CIQDPyZooC5Hvoa5NdLEy8y5rpmbsn3uW7887br6d%2BKC9DirWAggREAAaDDU2MzU4MzUxNzk1MyIM6BjvBaJ2FYMCuko%2FKrMCIKS%2Frr0OfhAdCvxfn8QA1H3dXpcFIo5f2tyFt1kQ8UegsW%2FCuUOE577znLiYDxVUJOnWwRzjPj3E9Wewjwou2weyaCtKd1k8nlFsGY8bhtVd4yXLozKraB4PjjSSEY8jAd1tFm6HbIFojKrLeDxqXtaP3lV1sEyyLveUUPqnsAkhmey9xpVKDJxUIbVYj0NLrZU2GzWSFbLl42fi3lkMtnlby4dZxrLc2FJlPjQEWb45RLFUU4ie%2FOnrf7raO7DekY%2BNXTQ%2FWahP8EhnAYbr2sKO2fMdBa5C37elBI25Hw183Hri8SvmRoxpFInhvOCqH%2B6f8XVhAfu1V9NapJATLB%2Bio74Y2fblyOL6y58Qnw%2BrMt4SKLbqPDFg%2FKreBzn3W1DbgNsFMluglw0K%2FS5lNdkdgDC%2FwM3DBjqsAqXflVgweUKkxKnHKsE8I%2FvIx82aCtPgGm1T6MmwppNHugYiAMf%2B%2BJ7e3hpO46K3vo8sEigRPrDBTkNeB0AU1mkyp25FHuNL3S8pPiFWhMsg17IQWlbUkmd5w%2BQoeg0l%2B8VWQ1qRPcuZBnRQ8PPYu8IVpyFmJPRoz09Rk0z789XQO64jftikuJxBo9xK93DkM4qULATZJ4MzG70fx%2FVQf1qIIDy0V9BDrA4a9hAyt%2Fi0odOX5PEoHcwdR58iAlaeQW%2FZm01x0ZtsX93iLmL7P86IiWNXDW3FbZulbRU6QCzEdspK%2BMI3P5PKq5O1uw7zUD%2FFX1k0PQVxdZZOIU0FyBGBD2s4Xx4DRPSq3xN1b4fft2fb%2BxtCCLGE0TW3B44lNvlG3dm1%2FWWicStafA%3D%3D&X-Amz-Signature=71ba3a8ff52627c4501d2d27f53a6537e70bed72b6310e671ed3f35f79cf040d&X-Amz-SignedHeaders=host&response-content-disposition=inline"} 
                    onLoadSuccess={onDocumentLoadSuccess} 
                    loading={Loader}
                    error={
                        <div className="flex justify-center items-center h-64 text-white">
                            <div className="text-center">
                                <h3 className="text-xl mb-2">Failed to load PDF</h3>
                                <p className="text-sm">Please check the URL or try again</p>
                            </div>
                        </div>
                    }
                >
                    <Page 
                        pageNumber={currPage} 
                        width={width} 
                        renderTextLayer={!isMobile} // Disable text layer on mobile for better performance
                        renderAnnotationLayer={!isMobile} // Disable annotation layer on mobile
                    />
                </Document>
            </div>
        </div>
    );
}

export default Pdfviewer;