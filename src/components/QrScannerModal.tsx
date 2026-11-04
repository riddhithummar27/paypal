'use client';

import React, { useState } from 'react';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationSuccess?: (result: any) => void;
  defaultToken?: string;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onVerificationSuccess,
  defaultToken = 'FLP-8842-7721',
}) => {
  const [tokenInput, setTokenInput] = useState(defaultToken);
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusResult, setStatusResult] = useState<{
    success: boolean;
    message: string;
    points?: number;
    hash?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;

    setIsVerifying(true);
    setStatusResult(null);

    try {
      const res = await fetch('/api/custody/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectionToken: tokenInput.trim(),
          verifierId: 'usr-donor-01',
          notes: 'Handover confirmed via merchant terminal verification.',
        }),
      });

      const data = await res.json();
      setIsVerifying(false);

      if (data.success) {
        setStatusResult({
          success: true,
          message: data.message || 'Collection verified successfully!',
          points: data.pointsAwarded || 50,
          hash: data.fintechVerification?.signatureHash || '0x892a7f33d02b9e1a88c3f4e5a91b82736154c3',
        });
        if (onVerificationSuccess) onVerificationSuccess(data);
      } else {
        setStatusResult({
          success: false,
          message: data.error || 'Verification failed. Please check the token.',
        });
      }
    } catch (err: any) {
      setIsVerifying(false);
      setStatusResult({
        success: false,
        message: err.message || 'Network connection error during verification.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#001d59] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">QR Collection Terminal</h3>
              <p className="text-xs text-white/70">Scan or enter recipient collection token</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4">
          
          {/* Simulated Scanner Viewfinder */}
          <div className="relative w-full h-44 rounded-2xl bg-[#040e1b] border-2 border-dashed border-[#005ab6] flex flex-col items-center justify-center text-white overflow-hidden shadow-inner">
            <div className="w-28 h-28 rounded-xl border-2 border-emerald-400 relative flex items-center justify-center animate-pulse">
              <span className="material-symbols-outlined text-emerald-400 text-[42px]">qr_code_2</span>
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-400"></div>
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-400"></div>
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-400"></div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-400"></div>
            </div>
            <span className="text-[11px] font-mono text-emerald-300 mt-2">
              Optical Terminal Ready • Awaiting QR Token
            </span>
          </div>

          {/* Result Alert */}
          {statusResult && (
            <div
              className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-start gap-2.5 ${
                statusResult.success
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
                {statusResult.success ? 'check_circle' : 'cancel'}
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-bold">{statusResult.message}</span>
                {statusResult.points && (
                  <span className="text-emerald-700 font-extrabold mt-1">
                    +{statusResult.points} Reward Points Credited to Donor Account! 🌟
                  </span>
                )}
                {statusResult.hash && (
                  <span className="font-mono text-[10px] text-slate-500 mt-0.5 truncate">
                    Hash: {statusResult.hash}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Form to submit token */}
          <form onSubmit={handleVerify} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#001d59]">Recipient Collection Token</label>
              <div className="relative">
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="e.g., FLP-8842-7721"
                  required
                  className="w-full h-11 pl-9 pr-3.5 bg-[#f2f4f7] rounded-xl text-sm font-mono font-bold text-[#001d59] uppercase focus:bg-white focus:ring-2 focus:ring-[#005ab6] outline-none"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#005ab6] text-[18px]">
                  key
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="h-11 rounded-xl bg-[#001d59] hover:bg-[#003087] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span className={`material-symbols-outlined text-[18px] ${isVerifying ? 'animate-spin' : ''}`}>
                {isVerifying ? 'refresh' : 'verified'}
              </span>
              <span>{isVerifying ? 'Verifying Collection...' : 'Authenticate Handover'}</span>
            </button>
          </form>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-[#747683]">
          <span>Cryptographic Custody Handshake</span>
          <button
            onClick={onClose}
            className="text-xs font-bold text-[#005ab6] hover:underline cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
