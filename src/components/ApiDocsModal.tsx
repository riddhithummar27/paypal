'use client';

import React, { useState } from 'react';
import {
  FileCode,
  X,
  Copy,
  Check,
  Download,
  ExternalLink,
  Code2,
} from 'lucide-react';

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('create-order');

  if (!isOpen) return null;

  const endpoints = [
    {
      id: 'create-order',
      method: 'POST',
      path: '/api/paypal/create-order',
      summary: 'Generate PayPal Sandbox Order',
      sampleCurl: `curl -X POST http://localhost:3000/api/paypal/create-order \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 12.50,
    "currency": "USD",
    "description": "Sponsored 5 Meals",
    "referenceId": "FL-SPON-101"
  }'`,
    },
    {
      id: 'capture-order',
      method: 'POST',
      path: '/api/paypal/capture-order',
      summary: 'Capture Authorized PayPal Order',
      sampleCurl: `curl -X POST http://localhost:3000/api/paypal/capture-order \\
  -H "Content-Type: application/json" \\
  -d '{
    "orderId": "SANDBOX-ORD-12345"
  }'`,
    },
    {
      id: 'pricing-engine',
      method: 'POST',
      path: '/api/ai/pricing-engine',
      summary: 'AI Dynamic Shelf-Life Decay Pricing',
      sampleCurl: `curl -X POST http://localhost:3000/api/ai/pricing-engine \\
  -H "Content-Type: application/json" \\
  -d '{
    "originalPrice": 8.00,
    "minutesRemaining": 45,
    "category": "Meals",
    "storageTemp": "Hot (>60°C)",
    "portions": 20
  }'`,
    },
    {
      id: 'rescue-agent',
      method: 'POST',
      path: '/api/ai/rescue-agent',
      summary: 'Autonomous Batch Allocation & Dispatch',
      sampleCurl: `curl -X POST http://localhost:3000/api/ai/rescue-agent \\
  -H "Content-Type: application/json" \\
  -d '{
    "portions": 80,
    "foodTitle": "Campus Mess Surplus",
    "donorName": "State Campus Mess",
    "category": "Meals",
    "pickupDeadlineMinutes": 35
  }'`,
    },
  ];

  const current = endpoints.find((e) => e.id === selectedEndpoint) || endpoints[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.sampleCurl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-blue-500/30 w-full max-w-2xl rounded-3xl p-6 shadow-2xl relative text-white space-y-5 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <FileCode className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">APIMatic & OpenAPI Specs</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                OpenAPI 3.1
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Structured API contracts for third-party donor integrations, POS sync, and NGO registries.
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          {endpoints.map((ep) => (
            <button
              key={ep.id}
              onClick={() => setSelectedEndpoint(ep.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedEndpoint === ep.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="font-mono text-emerald-400 mr-1.5">{ep.method}</span>
              {ep.path.replace('/api/', '')}
            </button>
          ))}
        </div>

        {/* Code Sample Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold">{current.summary}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-mono"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied cURL</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy cURL</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed">
            {current.sampleCurl}
          </pre>
        </div>

        {/* Raw OpenAPI Link */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-300">
            <div className="font-bold text-white">Full OpenAPI Specification</div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Available live at <code className="text-blue-400 font-mono">/api/openapi.json</code> for APIMatic context plugin import.
            </p>
          </div>

          <a
            href="/api/openapi.json"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-700 hover:bg-slate-600 text-white transition-all"
          >
            <span>Open JSON</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-all"
        >
          Close Specs
        </button>
      </div>
    </div>
  );
};
