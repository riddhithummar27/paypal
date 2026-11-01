'use client';

import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  MapPin,
  Clock,
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
      details: 'Dispatched to PayPal Agent Toolkit & Rescue Reasoning Model',
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
      await new Promise((r) => setTimeout(r, 700));
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
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="max-w-2xl space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              PayPal Agent Toolkit & AI SDK
            </span>
            <span className="text-xs text-slate-400 font-mono">Agentic Commerce Engine</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            The Autonomous FOODLOOP Rescue Agent
          </h2>
          <p className="text-xs text-slate-300">
            Autonomous multi-agent triage: Detects expiring surplus, splits bulk quantities across nearby shelters, schedules courier dispatch, and triggers PayPal Sandbox orders without human bottlenecks.
          </p>
        </div>

        {/* 30-Minute Challenge Live Button */}
        <button
          disabled={isChallengeRunning}
          onClick={handleSimulateChallenge}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all disabled:opacity-50"
        >
          {isChallengeRunning ? (
            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Play className="w-4 h-4 fill-slate-950" />
          )}
          <span>Run 30-Minute Rescue Challenge (80 Meals)</span>
        </button>
      </div>

      {/* Main Console Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Terminal Output / Agent Logs */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col h-[520px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-mono text-xs text-slate-400 ml-2">
                agent.foodloop.ai / live-telemetry
              </span>
            </div>
            <button
              onClick={() => setLogs([])}
              className="text-slate-500 hover:text-slate-300 text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
          </div>

          {/* Logs stream */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 font-mono text-xs">
            {logs.length === 0 ? (
              <div className="text-slate-600 text-center py-20">
                Agent listening for surplus events or user commands...
              </div>
            ) : (
              logs.map((log) => {
                const isUser = log.summary.startsWith('User Prompt:');
                const isPayPal = log.stage === 'PayPal Settlement';

                return (
                  <div
                    key={log.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isUser
                        ? 'bg-slate-900 border-slate-700 text-slate-200'
                        : isPayPal
                        ? 'bg-blue-950/40 border-blue-500/40 text-blue-200'
                        : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-bold uppercase tracking-wider text-emerald-400">
                        [{log.stage}]
                      </span>
                      <span>{log.timestamp}</span>
                    </div>

                    <div className="font-semibold text-white whitespace-pre-line">
                      {log.summary}
                    </div>

                    <div className="text-[11px] text-slate-300 mt-1 whitespace-pre-line leading-relaxed">
                      {log.details}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Prompt input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="pt-3 border-t border-slate-800 flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask agent: 'Sponsor 10 meals via PayPal' or 'Run rescue challenge'..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>

        {/* Right: Quick Prompts & Architecture Explainer */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>One-Click Agent Commands</span>
            </div>

            <div className="space-y-2">
              <button
                onClick={() =>
                  handleSendMessage('Sponsor 10 meals for the night shelter using PayPal Sandbox')
                }
                className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs text-slate-200 hover:border-blue-500/50 transition-all space-y-1"
              >
                <div className="font-bold text-blue-300 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" /> Sponsor 10 Meals ($25)
                </div>
                <div className="text-[11px] text-slate-400">
                  Executes PayPal Agent Toolkit function to create and authorize order.
                </div>
              </button>

              <button
                onClick={() =>
                  handleSendMessage('Run the 30-minute emergency rescue challenge for campus mess')
                }
                className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs text-slate-200 hover:border-emerald-500/50 transition-all space-y-1"
              >
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Triage 80 Hostel Meals
                </div>
                <div className="text-[11px] text-slate-400">
                  Splits batches and schedules multi-drop couriers.
                </div>
              </button>

              <button
                onClick={() =>
                  handleSendMessage('Generate a PayPal sustainability tax invoice for Golden Crust Boulangerie')
                }
                className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs text-slate-200 hover:border-purple-500/50 transition-all space-y-1"
              >
                <div className="font-bold text-purple-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Draft PayPal Invoice
                </div>
                <div className="text-[11px] text-slate-400">
                  Generates official tax-deductible surplus redistribution receipt.
                </div>
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 space-y-2">
            <span className="font-bold text-white text-[11px] uppercase tracking-wider block">
              Autonomous Commerce Architecture:
            </span>
            <div className="space-y-1 text-[11px] text-slate-400">
              <p>• <strong>Perception:</strong> Real-time expiry countdown telemetry.</p>
              <p>• <strong>Reasoning:</strong> Geo-clustering & shelter dietary rules.</p>
              <p>• <strong>Action Rail:</strong> PayPal Orders v2 & Invoicing APIs.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
