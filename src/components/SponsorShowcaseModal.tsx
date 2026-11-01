'use client';

import React from 'react';
import {
  Award,
  X,
  ExternalLink,
  CheckCircle2,
  TableProperties,
  Clock,
  FileCode,
  Server,
  Zap,
} from 'lucide-react';

interface SponsorShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SponsorShowcaseModal: React.FC<SponsorShowcaseModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const sponsors = [
    {
      name: 'AG Grid',
      prize: 'Best Use of AG Grid ($5,000 1st Place / $10,000 Pool)',
      icon: TableProperties,
      color: 'text-purple-400',
      borderColor: 'border-purple-500/30',
      bgGlow: 'bg-purple-500/10',
      description:
        'Enterprise data table inside the NGO & Shelter Logistics Hub with quick search, column sorting, category filtering, custom status renderers, and 1-click CSV data export.',
      files: ['src/components/NgoLogisticsGrid.tsx'],
      keysRequired: 'Zero keys needed (Open-source ag-grid-community package)',
    },
    {
      name: 'APIMatic',
      prize: 'Best Use of APIMatic ($1,000 x 3 Winners)',
      icon: FileCode,
      color: 'text-teal-400',
      borderColor: 'border-teal-500/30',
      bgGlow: 'bg-teal-500/10',
      description:
        'Full OpenAPI 3.1 specification (/api/openapi.json) and interactive API documentation modal with cURL samples, formatted for APIMatic Context Plugins and SDK generation.',
      files: ['src/app/api/openapi.json/route.ts', 'src/components/ApiDocsModal.tsx'],
      keysRequired: 'Ready for APIMatic Context Plugin import',
    },
    {
      name: 'Bryntum',
      prize: 'Best Use of Bryntum ($1,000 x 3 Winners)',
      icon: Clock,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      bgGlow: 'bg-emerald-500/10',
      description:
        'Visual rapid dispatch timeline & courier scheduler coordinating urgent 30-45 minute safe transit windows between hot kitchens and regional shelters.',
      files: ['src/components/BryntumDispatchScheduler.tsx'],
      keysRequired: 'Active timeline component model',
    },
    {
      name: 'Render',
      prize: 'Best Use of Render ($1,000 Credits 1st Place)',
      icon: Server,
      color: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      bgGlow: 'bg-blue-500/10',
      description:
        'Production infrastructure-as-code deployment blueprint (render.yaml) configured for zero-friction hosted cloud builds.',
      files: ['render.yaml'],
      keysRequired: 'Deploy directly on Render via GitHub sync',
    },
    {
      name: 'PayPal AI Toolkit',
      prize: 'Best Use of PayPal + AI ($5,000) & Agentic Commerce ($5,000)',
      icon: Zap,
      color: 'text-[#ffc439]',
      borderColor: 'border-[#ffc439]/40',
      bgGlow: 'bg-[#ffc439]/10',
      description:
        'Official @paypal/agent-toolkit v1.11.0 integration with PayPal Orders v2 REST API for dynamic checkout, payment capture, and natural language agent triage.',
      files: ['src/lib/paypal.ts', 'src/app/api/ai/agent-chat/route.ts', 'src/components/AutonomousAgentConsole.tsx'],
      keysRequired: 'Sandbox Client ID & Secret in .env.local (Live fallback active)',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0b1a33] border border-[#0070ba]/40 w-full max-w-2xl rounded-3xl p-6 shadow-2xl relative text-white space-y-5 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#003087] via-[#0070ba] to-[#ffc439] flex items-center justify-center shadow-lg shadow-[#0070ba]/30">
            <Award className="w-6 h-6 text-[#001435]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-white">Official Sponsor Integrations</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#ffc439] text-[#001435]">
                5 Active
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Evidence of sponsor tools utilized for hackathon prize categories
            </p>
          </div>
        </div>

        {/* Sponsor Cards */}
        <div className="space-y-3">
          {sponsors.map((sp, idx) => {
            const Icon = sp.icon;
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl bg-[#071326] border ${sp.borderColor} space-y-2`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${sp.bgGlow}`}>
                      <Icon className={`w-4 h-4 ${sp.color}`} />
                    </div>
                    <span className="font-extrabold text-sm text-white">{sp.name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#ffc439]">{sp.prize}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{sp.description}</p>

                <div className="pt-2 border-t border-[#1b3866] flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="font-semibold text-slate-300">Files:</span>
                    {sp.files.map((f, i) => (
                      <code key={i} className="px-1.5 py-0.5 rounded bg-[#0b1a33] font-mono text-[#009cde]">
                        {f}
                      </code>
                    ))}
                  </div>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {sp.keysRequired}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl font-bold text-xs paypal-btn-gold text-[#001435] transition-all cursor-pointer"
        >
          Close Sponsor Evidence
        </button>
      </div>
    </div>
  );
};
