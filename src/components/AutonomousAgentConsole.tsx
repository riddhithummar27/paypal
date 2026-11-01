'use client';

import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  Bot,
  Flame,
} from 'lucide-react';
import { AgentLog } from '@/types/foodloop';

interface AutonomousAgentConsoleProps {
  initialLogs: AgentLog[];
  onTriggerRescueChallenge: () => void;
  onAgentAction: (action: any) => void;
}

export const AutonomousAgentConsole: React.FC<AutonomousAgentConsoleProps> = ({
  initialLogs,
  onTriggerRescueChallenge,
  onAgentAction,
}) => {
  const [logs, setLogs] = useState<AgentLog[]>(initialLogs);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChallengeRunning, setIsChallengeRunning] = useState(false);

  const quickChips = [
    { label: 'Sponsor 10 Meals ($25)', prompt: 'Sponsor 10 meals for the night shelter using PayPal Sandbox' },
    { label: 'Run 30-Min Rescue Challenge', prompt: 'Run the 30-minute emergency rescue challenge for campus mess' },
    { label: 'Draft PayPal Tax Receipt', prompt: 'Generate a PayPal sustainability tax invoice for Golden Crust Boulangerie' },
    { label: 'Check Perishable Decay', prompt: 'Check dynamic pricing decay for expiring bakery items' },
  ];

  const handleSendMessage = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputMessage;
    if (!promptToSend.trim() || isProcessing) return;

    setInputMessage('');
    setIsProcessing(true);

    const userLog: AgentLog = {
      id: `usr-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      stage: 'Detection',
      summary: `User Prompt: "${promptToSend}"`,
      details: 'Handled by PayPal Agent Toolkit & Rescue Reasoning Engine',
      confidence: 1.0,
    };
    setLogs((prev) => [userLog, ...prev]);

    try {
      const res = await fetch('/api/ai/agent-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: promptToSend }),
      });
      const data = await res.json();

      const agentLog: AgentLog = {
        id: `agt-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        stage: data.action?.type?.includes('PAYPAL') ? 'PayPal Settlement' : 'Allocation',
        summary: data.reply.split('\n')[0] || 'Autonomous Agent Response',
        details: data.reply,
        confidence: 0.98,
        metadata: data.action,
      };

      setLogs((prev) => [agentLog, ...prev]);

      if (data.action) {
        onAgentAction(data.action);
      }
    } catch (err) {
      console.error('Agent chat error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSimulateChallenge = async () => {
    setIsChallengeRunning(true);
    onTriggerRescueChallenge();

    const steps = [
      {
        stage: 'Detection' as const,
        summary: 'CRITICAL EVENT: State Campus Main Mess logged 80 hot dinner portions (Cutoff: 35 mins).',
        details: 'FSSAI thermal limit active (>60°C). AI Rescue Agent engaged autonomously.',
      },
      {
        stage: 'Pricing' as const,
        summary: 'Surplus classified as 100% Free Emergency Community Donation ($0).',
        details: 'Bypassing consumer checkout. Directing to maximum-need regional shelter facilities.',
      },
      {
        stage: 'Allocation' as const,
        summary: 'Geo-spatial routing solved: Batch split into 2 drops (Hope Mission: 50, Harbor Youth: 30).',
        details: 'Vehicle constraints checked: 1 Cargo Bike dispatched for 1.4km; 1 EV Van dispatched for 2.4km.',
      },
      {
        stage: 'Dispatch' as const,
        summary: 'Automated push notifications sent to volunteers Alex & Elena. Both accepted.',
        details: 'ETA to donor: 11 mins. Predicted collection time: 20:25 PM (10 mins ahead of safety deadline).',
      },
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 650));
      const step = steps[i];
      setLogs((prev) => [
        {
          id: `sim-${Date.now()}-${i}`,
          timestamp: new Date().toLocaleTimeString(),
          stage: step.stage,
          summary: step.summary,
          details: step.details,
          confidence: 0.99,
        },
        ...prev,
      ]);
    }

    setIsChallengeRunning(false);
  };

  return (
    <section className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#001c48] via-[#003087] to-[#071326] border border-[#0070ba]/40 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="max-w-2xl space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ffc439] text-[#001435] flex items-center gap-1 shadow-md">
              <Zap className="w-3.5 h-3.5 fill-[#001435]" />
              PayPal AI Copilot
            </span>
            <span className="text-xs text-[#009cde] font-bold">@paypal/agent-toolkit</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Autonomous Rescue & Commerce Agent
          </h2>
          <p className="text-xs text-slate-300">
            A simple, intuitive copilot that takes real action: creates PayPal orders, splits food surplus batches, coordinates volunteer pickups, and generates tax-deductible impact receipts.
          </p>
        </div>

        {/* 30-Minute Challenge Live Button */}
        <button
          disabled={isChallengeRunning}
          onClick={handleSimulateChallenge}
          className="paypal-btn-gold px-5 py-3 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isChallengeRunning ? (
            <div className="w-4 h-4 border-2 border-[#001435] border-t-transparent rounded-full animate-spin" />
          ) : (
            <Play className="w-4 h-4 fill-[#001435]" />
          )}
          <span>Run 30-Min Challenge (80 Meals)</span>
        </button>
      </div>

      {/* Main Console Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Chat / Telemetry Stream */}
        <div className="lg:col-span-2 bg-[#0a1830] border border-[#1b3866] rounded-2xl p-5 flex flex-col h-[520px] shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#1b3866] pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0070ba] flex items-center justify-center">
                <span className="font-black italic text-sm text-white">P</span>
              </div>
              <span className="font-bold text-xs text-white">
                PayPal AI Agent Telemetry
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
            </div>
            <button
              onClick={() => setLogs([])}
              className="text-slate-400 hover:text-white text-xs flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
          </div>

          {/* Logs stream */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs">
            {logs.length === 0 ? (
              <div className="text-slate-500 text-center py-20">
                Agent listening for surplus triggers or commands. Try clicking one of the quick chips below!
              </div>
            ) : (
              logs.map((log) => {
                const isUser = log.summary.startsWith('User Prompt:');
                const isPayPal = log.stage === 'PayPal Settlement';

                return (
                  <div
                    key={log.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isUser
                        ? 'bg-[#0f2242] border-[#1b3866] text-white ml-8'
                        : isPayPal
                        ? 'bg-[#002255] border-[#0070ba] text-white mr-8 shadow-lg shadow-[#0070ba]/20'
                        : 'bg-[#071326] border-[#1b3866] text-slate-200 mr-8'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-extrabold uppercase tracking-wider text-[#009cde]">
                        [{log.stage}]
                      </span>
                      <span>{log.timestamp}</span>
                    </div>

                    <div className="font-bold text-white whitespace-pre-line text-sm">
                      {log.summary}
                    </div>

                    <div className="text-xs text-slate-300 mt-1.5 whitespace-pre-line leading-relaxed">
                      {log.details}
                    </div>

                    {/* Action card if PayPal order was created */}
                    {log.metadata?.type === 'PAYPAL_ORDER_CREATED' && (
                      <div className="mt-3 p-3 rounded-lg bg-[#001c48] border border-[#ffc439]/40 flex items-center justify-between">
                        <div>
                          <div className="text-[11px] font-bold text-[#ffc439]">
                            PayPal Order ID: {log.metadata.orderId}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Amount: ${log.metadata.amount.toFixed(2)} USD • Sandbox Rail
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-[#ffc439] text-[#001435]">
                          Authorized
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Action Chips */}
          <div className="py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip.prompt)}
                className="flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#0e2142] hover:bg-[#0070ba] text-slate-300 hover:text-white border border-[#1b3866] transition-all cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Prompt input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="pt-2 border-t border-[#1b3866] flex gap-2"
          >
            <input
              type="text"
              placeholder="Type instructions for the agent (e.g. 'Sponsor 5 meals via PayPal')..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-[#071326] border border-[#1b3866] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#0070ba]"
            />
            <button
              type="submit"
              disabled={isProcessing}
              className="paypal-btn-gold px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-[#001435]" />
              <span>Send</span>
            </button>
          </form>
        </div>

        {/* Right: Agent Architecture & Features */}
        <div className="bg-[#0c1c38] border border-[#19355e] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#009cde] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#ffc439]" />
              <span>Agent Capabilities</span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3.5 rounded-xl bg-[#071326] border border-[#1b3866] space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#ffc439]" />
                  <span>Agentic PayPal Checkout</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Direct function calling to PayPal Orders v2 for automated meal sponsorships.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#071326] border border-[#1b3866] space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Smart Multi-Node Allocation</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Splits massive batches (e.g. 80 mess meals) across shelters within a 4km radius based on real-time bed capacity.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#071326] border border-[#1b3866] space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#009cde]" />
                  <span>Automated Invoicing & Receipts</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Generates verified tax-deductible donor invoices via `@paypal/agent-toolkit`.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#001c48] border border-[#0070ba]/40 text-xs text-slate-200 space-y-1">
            <span className="font-extrabold text-[#ffc439] text-[11px] uppercase tracking-wide block">
              Official PayPal Agent Toolkit SDK:
            </span>
            <p className="text-[11px] text-slate-300">
              Native TypeScript integration running function calling against sandbox endpoints with zero third-party latency.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
