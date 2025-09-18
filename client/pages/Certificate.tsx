
import React, { useRef, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { db } from "../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { QRCodeCanvas } from "qrcode.react";
const Watermark: React.FC = () => (
  <svg
    viewBox="0 0 48 24"
    className="w-full h-full"
    preserveAspectRatio="xMidYMid meet"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 12c0-4 3-7 7-7 3 0 5 2 7 4s4 4 7 4 7-3 7-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <path
      d="M36 12c0 4-3 7-7 7-3 0-5-2-7-4s-4-4-7-4-7 3-7 7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
);


const Certificate: React.FC = () => {
  const mainCertRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();
  const location = useLocation();

  // Get course name from path param or query param
  const { coursename } = useParams();
  const params = new URLSearchParams(location.search);
  let courseLine1 = "Full Stack Development in Java";
  if (coursename) {
    courseLine1 = decodeURIComponent(coursename.replace(/\+/g, ' '));
  } else if (params.get("course")) {
    courseLine1 = params.get("course")!;
  }


  // Get user name from auth
  const [studentName, setStudentName] = useState<string>("Name of Student");
  const [certificateNumber, setCertificateNumber] = useState<string>("");
  useEffect(() => {
    const fetchCertNumber = async () => {
      if (user) {
        // Try to use displayName, else fallback to email prefix
        const name = user.displayName || (user.email ? user.email.split("@")[0] : "Name of Student");
        setStudentName(name);
        // Fetch certificate_number from Firestore progress or progress_ml map
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        let certNum = "";
        // Determine which field to use based on course name
        const courseName = courseLine1.toLowerCase();
        let progressField = "progress";
        if (courseName.includes("ml") || courseName.includes("machine learning")) {
          progressField = "progress_ml";
        }else if (courseName.includes("cloud") || courseName.includes("cloud computing fundamentals")) {
          progressField = "progress_cc";
        }
        const progressData = userDoc.exists() ? (userDoc.data()[progressField] || {}) : {};
        if (progressData && progressData.certificate_number) {
          certNum = progressData.certificate_number;
        }
        // If no certificate number, generate and store it inside the correct progress map
        if (!certNum) {
          certNum = `ASCEND-${user.uid.slice(-6).toUpperCase()}-${Date.now().toString().slice(-6)}`;
          if (userDoc.exists()) {
            await updateDoc(userRef, { [progressField]: { ...progressData, certificate_number: certNum } });
          }
        }
        setCertificateNumber(certNum);
      }
    };
    fetchCertNumber();
    // eslint-disable-next-line
  }, [user]);

  // Current date in readable format
  const date = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Download certificate as PNG
  const handleDownload = async () => {
    if (!mainCertRef.current) return;

    const canvas = await html2canvas(mainCertRef.current, {
      scale: 2, // better quality
    });

    const link = document.createElement("a");
    link.download = "certificate.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="dark min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground space-y-6">
      <div className="w-[1056px] h-[616px] mx-auto">
        {/* Certificate */}
        <div
          ref={mainCertRef}
          className="relative w-full h-full bg-gradient-to-br from-[#0c1222] via-[#0b162e] to-[#0a0f1f] 
          rounded-2xl border border-sky-500/20 shadow-neon overflow-hidden p-12 
          flex flex-col items-center justify-center text-center"
        >
          {/* Watermark */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-[520px] h-[320px]">
                <Watermark />
              </div>
            </div>
          </div>

          {/* Certificate Content */}
          <div className="relative z-10 flex flex-col items-center text-center"style={{ fontFamily: "'Times New Roman', Times, serif" }}>
            {/* Logo + Brand */}
            <div className="flex flex-col items-center">
              <svg
                aria-hidden
                viewBox="0 0 48 24"
                className="h-10 w-20 text-sky-400 fill-current mb-2"
              >
                <path
                  d="M12 12c0-4 3-7 7-7 3 0 5 2 7 4s4 4 7 4 7-3 7-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M36 12c0 4-3 7-7 7-3 0-5-2-7-4s-4-4-7-4-7 3-7 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <h1
                className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-sky-400 drop-shadow-[0_0_18px_rgba(56,189,248,0.45)]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Ascendify
              </h1>
            </div>

            {/* Title */}
            <h2
              className="mt-8 text-12xl sm:text-5xl drop-shadow-lg text-white"
              style={{ fontFamily: "'UnifrakturCook', cursive" }}
            >
              Certificate of Completion
            </h2>

            {/* Student */}
            <p className="mt-6 text-lg text-muted-foreground">This certifies that</p>
            <h1 className="mt-4 text-5xl sm:text-6xl font-extrabold text-white drop-shadow-md">
              {studentName}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">has successfully completed the Ascendify's course on the topic</p>
            {/* Course */}
            <p className="mt-6 text-lg sm:text-xl text-sky-200/90 max-w-3xl mx-auto leading-relaxed">
              <span className="block font-semibold">{courseLine1}</span>
            </p>

            {/* Date */}
            <p className="mt-4 text-md text-white font-medium">{date}</p>
          </div>

          {/* Stamp bottom-left */}
          <div className="absolute bottom-8 left-8">
            <div className="w-28 h-28 rounded-full flex items-center justify-center text-center text-sm font-bold text-yellow-50 bg-gradient-to-br from-yellow-600/30 to-yellow-900/20 border-2 border-yellow-400/50 shadow-inner">
              <div>
                <img src="/assets/stamp.png" alt="stmp" />
                {/* <div className="text-xs">Official</div>
                <div className="text-sm">Ascendify</div>
                <div className="text-xs">Stamp</div> */}
              </div>
            </div>
          </div>

          {/* QR bottom-right */}
          <div className="absolute bottom-8 right-8 flex flex-col items-center">
            <div className="w-24 h-24 bg-[#0e1627] rounded-lg flex items-center justify-center text-sm text-sky-400 border-2 border-sky-500/30 shadow-md">
              {certificateNumber ? (
                <QRCodeCanvas
                  value={`http://localhost:8081/certificate/verified?cert=${encodeURIComponent(certificateNumber)}`}
                  size={80}
                  bgColor="#0e1627"
                  fgColor="#38bdf8"
                  level="H"
                  includeMargin={false}
                />
              ) : (
                <span>QR</span>
              )}
            </div>
            <span className="text-xs text-muted-foreground mt-1">Scan to verify</span>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="mt-6 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg transition"
      >
        Download Certificate
      </button>
    </div>
  );
};

export default Certificate;
