import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import NotFound from "./NotFound";

const CertificateVerified: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verified, setVerified] = useState<null | boolean>(null);

  useEffect(() => {
    const verifyCertificate = async () => {
      // Get cert number from query param (?cert=...)
      const params = new URLSearchParams(location.search);
      const certNum = params.get("cert");
      if (!certNum) {
        setVerified(false);
        return;
      }
      // Query Firestore for user with this certificate_number in progress, progress_ml, or progress_cc
      const usersRef = collection(db, "users");
      // Check progress.certificate_number
      const q1 = query(usersRef, where("progress.certificate_number", "==", certNum));
      const snap1 = await getDocs(q1);
      if (!snap1.empty) {
        setVerified(true);
        return;
      }
      // Check progress_ml.certificate_number
      const q2 = query(usersRef, where("progress_ml.certificate_number", "==", certNum));
      const snap2 = await getDocs(q2);
      if (!snap2.empty) {
        setVerified(true);
        return;
      }
      // Check progress_cc.certificate_number (for cloud)
      const q3 = query(usersRef, where("progress_cc.certificate_number", "==", certNum));
      const snap3 = await getDocs(q3);
      if (!snap3.empty) {
        setVerified(true);
        return;
      }
      setVerified(false);
    };
    verifyCertificate();
  }, [location.search]);

  if (verified === null) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
        <div className="text-center">Verifying certificate...</div>
      </div>
    );
  }
  if (!verified) {
    return <NotFound />;
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
      <div className="w-full max-w-md bg-card rounded-2xl border-2 border-border shadow-lg p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="text-emerald-400">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="rgba(16,185,129,0.08)" />
            <path d="M7.5 12.5l2.5 2.5L16.5 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <h2 className="text-2xl font-bold text-foreground">Certificate Verified</h2>
          <p className="text-sm text-muted-foreground">This certificate has been verified successfully.</p>

        </div>
      </div>
    </div>
  );
};

export default CertificateVerified;
