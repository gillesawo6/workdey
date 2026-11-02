'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTalent } from '@/lib/talent/talent-context';
import { CoachMode, CVAssistResult } from '@/lib/ai/types';
import {
  Sparkles,
  Send,
  Shield,
  BookOpen,
  Check,
  ArrowRight,
  MessageSquarePlus,
  AlertCircle,
  RefreshCw,
  Cpu,
  Lock,
  ExternalLink,
  ChevronRight,
  FileText,
  Briefcase,
  DollarSign,
  Copy,
  Download,
  Flame,
  Star,
  Layers,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
  actionChips?: string[];
  isAiPowered?: boolean;
}

export default function CareerCoachPage() {
  const { profile, applications } = useTalent();

  const [activeTab, setActiveTab] = useState<'chat' | 'cv_tool'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiStatus, setAiStatus] = useState<'live' | 'offline_fallback' | 'checking'>('checking');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<CoachMode>('career_strategy');

  // Privacy toggles
  const [useProfile, setUseProfile] = useState(true);
  const [saveTranscripts, setSaveTranscripts] = useState(true);
  const [shareWithEmployers, setShareWithEmployers] = useState(false);

  // CV & Cover Letter Tool state
  const [cvInputText, setCvInputText] = useState(
    `Aïcha Nkeng - Senior Data Analyst (Douala, Cameroon)\n\nEXPERIENCE:\nSenior Data Analyst at AgroCam S.A. (2022 - Present)\n- Built cooperative yield reporting in Power BI; cut monthly reporting turnaround by 60% with automated ETL pipelines.\n- Led geospatial data integration across 4 regional agricultural zones.\n\nData & Reporting Analyst at Kadji Retail Group (2020 - 2022)\n- Managed inventory tracking and sales forecasting across 8 regional branches.\n\nSKILLS: SQL, Power BI, Python, Data Modeling, GeoPandas, Financial Reporting, French (Fluent), English (Fluent).`
  );
  const [targetCompany, setTargetCompany] = useState('MTN Cameroon');
  const [targetJobRole, setTargetJobRole] = useState('Lead Analytics & Data Platform Specialist');
  const [cvToolAction, setCvToolAction] = useState<'analyze_and_improve' | 'generate_cover_letter'>('analyze_and_improve');
  const [isAnalyzingCV, setIsAnalyzingCV] = useState(false);
  const [cvAnalysisResult, setCvAnalysisResult] = useState<CVAssistResult | null>(null);
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatCounterRef = useRef(200);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initial gateway ping
  useEffect(() => {
    async function checkAiGateway() {
      try {
        const res = await fetch('/api/ai/health');
        if (res.ok) {
          const data = await res.json();
          if (data.hasCredentials) {
            setAiStatus('live');
          } else {
            setAiStatus('offline_fallback');
          }
        } else {
          setAiStatus('offline_fallback');
        }
      } catch {
        setAiStatus('offline_fallback');
      }

      setMessages([
        {
          id: 'init-msg',
          sender: 'coach',
          text: `Hello ${profile.full_name?.split(' ')[0] || 'there'}! I am your WorkDey AI Career Coach. I specialize in helping professionals in Cameroon and Central Africa navigate high-impact career growth, prepare for technical & executive interviews, optimize CVs, and benchmark competitive XAF compensation. How can I help you today?`,
          timestamp: 'Just now',
          actionChips: [
            'Simulate a mock interview for Senior Lead',
            'Critique my CV impact and action verbs',
            'Benchmark salary negotiation in Douala (XAF)',
            'Draft a freelance consulting proposal',
          ],
          isAiPowered: true,
        },
      ]);
    }

    checkAiGateway();
  }, [profile.full_name]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isTyping) return;

    chatCounterRef.current += 1;
    const userMsg: ChatMessage = {
      id: `usr-${chatCounterRef.current}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: selectedMode,
          user_message: text,
          candidate_context: useProfile
            ? {
                name: profile.full_name,
                city: profile.city,
                headline: profile.headline,
                skills: profile.skills_list.map((s) => s.skill_name),
                target_role: profile.target_role,
                salary_target_xaf: profile.expected_salary_min_xaf,
              }
            : undefined,
          privacy_settings: {
            ground_in_profile: useProfile,
            save_transcript: saveTranscripts,
            share_with_employers: shareWithEmployers,
          },
        }),
      });

      const data = await res.json();

      if (res.ok) {
        chatCounterRef.current += 1;
        const coachMsg: ChatMessage = {
          id: `cch-${chatCounterRef.current}`,
          sender: 'coach',
          text: data.text,
          timestamp: 'Just now',
          isAiPowered: data.is_ai_powered,
          actionChips:
            selectedMode === 'mock_interview'
              ? ['Evaluate my response with a score out of 10', 'Ask the next technical question', 'How can I make my answer more metric-driven?']
              : ['Explain further with a Cameroon business example', 'Give me next actionable step', 'Summarize this as a checklist'],
        };
        setMessages((prev) => [...prev, coachMsg]);
        setAiStatus(data.ai_status || (data.is_ai_powered ? 'live' : 'offline_fallback'));
      } else {
        setErrorMessage(data.error || 'AI Coach temporarily unavailable.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error communicating with AI service.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleRunCVTool = async () => {
    if (!cvInputText.trim() || isAnalyzingCV) return;
    setIsAnalyzingCV(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/ai/cv-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cv_text: cvInputText,
          target_job_title: targetJobRole,
          company_name: targetCompany,
          action: cvToolAction,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setCvAnalysisResult(data);
      } else {
        setErrorMessage(data.error || 'Failed to analyze CV.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error analyzing CV.');
    } finally {
      setIsAnalyzingCV(false);
    }
  };

  const handleCopyCoverLetter = () => {
    if (cvAnalysisResult?.cover_letter?.content) {
      navigator.clipboard.writeText(cvAnalysisResult.cover_letter.content);
      setCopiedCoverLetter(true);
      setTimeout(() => setCopiedCoverLetter(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Mode & Tool Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#0B7F7A] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Career Advisory & Intelligence Gateway
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                aiStatus === 'live'
                  ? 'bg-[#1A7F4B]/15 text-[#1A7F4B] border border-[#1A7F4B]/30'
                  : 'bg-[#B45309]/15 text-[#B45309] border border-[#B45309]/30'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  aiStatus === 'live' ? 'bg-[#1A7F4B] animate-pulse' : 'bg-[#B45309]'
                }`}
              />
              {aiStatus === 'live' ? 'Gemini 3.8 Flash · Active' : 'Standby / Deterministic Mode'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1C2F] font-display mt-1">
            AI Career Coach
          </h1>
          <p className="text-xs text-[#5A6779] mt-0.5">
            Bilingual mentorship, mock interview simulator, salary benchmarking (XAF), and CV optimization for Cameroon and regional roles.
          </p>
        </div>

        {/* Tab switch between Chat Coach and CV Optimizer */}
        <div className="flex items-center gap-1 p-1 bg-white rounded-lg border border-[#E2E7EE] shadow-sm self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
              activeTab === 'chat'
                ? 'bg-[#0B7F7A] text-white shadow-xs'
                : 'text-[#5A6779] hover:text-[#0B1C2F]'
            }`}
          >
            Interactive Coach
          </button>
          <button
            onClick={() => setActiveTab('cv_tool')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors flex items-center gap-1 ${
              activeTab === 'cv_tool'
                ? 'bg-[#0B7F7A] text-white shadow-xs'
                : 'text-[#5A6779] hover:text-[#0B1C2F]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            CV & Cover Letter Studio
          </button>
        </div>
      </div>

      {/* 2. TAB A: INTERACTIVE CHAT COACH */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Workspace (3 cols) */}
          <div className="lg:col-span-3 flex flex-col h-[640px] bg-white rounded-xl border border-[#E2E7EE] shadow-sm overflow-hidden">
            {/* Coach Mode Selector Header */}
            <div className="p-3 bg-[#F4F6F9] border-b border-[#E2E7EE] flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-[#5A6779] mr-1">Coaching Mode:</span>
                {[
                  { id: 'career_strategy', label: 'Career Strategy' },
                  { id: 'mock_interview', label: 'Mock Interview' },
                  { id: 'cv_critique', label: 'CV Critique' },
                  { id: 'salary_negotiation', label: 'Salary in XAF' },
                  { id: 'freelance_proposal', label: 'Freelance Pitch' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id as CoachMode)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
                      selectedMode === mode.id
                        ? 'bg-[#0B7F7A] text-white shadow-xs'
                        : 'bg-white border border-[#E2E7EE] text-[#5A6779] hover:text-[#0B1C2F] hover:bg-slate-50'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setMessages([
                    {
                      id: `rst-${Date.now()}`,
                      sender: 'coach',
                      text: `Conversation cleared. I am ready to practice ${selectedMode.replace('_', ' ')}. What would you like to explore?`,
                      timestamp: 'Just now',
                    },
                  ]);
                }}
                className="text-[11px] font-semibold text-[#5A6779] hover:text-[#0B7F7A] flex items-center gap-1"
                title="Restart Session"
              >
                <RefreshCw className="w-3 h-3" /> Clear chat
              </button>
            </div>

            {/* Offline/Standby Notice Banner */}
            {aiStatus === 'offline_fallback' && (
              <div className="p-3 bg-[#FEF3C7] border-b border-[#FDE68A] text-[#92400E] text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#B45309]" />
                  <span>
                    <strong>Standby Mode:</strong> No <code className="font-mono bg-white/70 px-1 rounded">GEMINI_API_KEY</code> detected in server secrets. The system provides structured deterministic advice. To activate full generative reasoning, configure your key.
                  </span>
                </div>
                <Link
                  href="/talent/settings"
                  className="px-2.5 py-1 rounded bg-[#B45309] text-white text-[11px] font-bold hover:bg-[#92400E] flex-shrink-0"
                >
                  Configure
                </Link>
              </div>
            )}

            {/* Messages Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl p-4 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#0B7F7A] text-white rounded-br-none'
                        : 'bg-[#F4F6F9] text-[#0B1C2F] border border-[#E2E7EE] rounded-bl-none'
                    }`}
                  >
                    {msg.sender === 'coach' && (
                      <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[#E2E7EE]/60 text-[11px] font-bold text-[#0B7F7A]">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" /> WorkDey Coach
                        </span>
                        <span className="text-[10px] text-[#5A6779] font-normal">
                          {msg.isAiPowered ? 'AI Verified' : 'Standard Advisory'}
                        </span>
                      </div>
                    )}

                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {msg.actionChips && msg.actionChips.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[#E2E7EE] flex flex-wrap gap-1.5">
                        {msg.actionChips.map((chip, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(chip)}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-[#E6F5F3] hover:text-[#0B7F7A] text-[#0B1C2F] rounded border border-[#E2E7EE] transition-colors text-left"
                          >
                            {chip} →
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-[#A0AEC0] mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start gap-2">
                  <div className="p-3 bg-[#F4F6F9] border border-[#E2E7EE] rounded-xl rounded-bl-none text-xs text-[#5A6779] flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#0B7F7A] animate-spin" />
                    <span>WorkDey Coach is thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-[#E2E7EE]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={
                    selectedMode === 'mock_interview'
                      ? 'Type your answer to the interview question...'
                      : selectedMode === 'salary_negotiation'
                      ? 'Ask about XAF compensation brackets, negotiation leverage...'
                      : 'Ask WorkDey AI Coach anything about your career progression...'
                  }
                  className="flex-1 px-3.5 py-2.5 text-xs bg-[#F4F6F9] border border-[#E2E7EE] rounded-lg focus:outline-none focus:border-[#0B7F7A] focus:bg-white text-[#0B1C2F]"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="px-4 py-2.5 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#14A89E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>

          {/* Privacy & Grounding Controls Panel (1 col) */}
          <div className="space-y-4">
            {/* Privacy Controls (PDF Page 15) */}
            <div className="bg-white rounded-xl border border-[#E2E7EE] p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E2E7EE]">
                <Shield className="w-4 h-4 text-[#0B7F7A]" />
                <h3 className="text-xs font-bold text-[#0B1C2F]">Candidate Privacy & Data</h3>
              </div>

              <div className="space-y-2.5 text-xs text-[#0B1C2F]">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useProfile}
                    onChange={(e) => setUseProfile(e.target.checked)}
                    className="mt-0.5 rounded text-[#0B7F7A] focus:ring-[#0B7F7A]"
                  />
                  <div>
                    <span className="font-semibold block">Ground in profile</span>
                    <span className="text-[11px] text-[#5A6779]">
                      Uses your verified skills and {profile.city} location for tailored advice.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveTranscripts}
                    onChange={(e) => setSaveTranscripts(e.target.checked)}
                    className="mt-0.5 rounded text-[#0B7F7A] focus:ring-[#0B7F7A]"
                  />
                  <div>
                    <span className="font-semibold block">Save conversation</span>
                    <span className="text-[11px] text-[#5A6779]">
                      Preserves coaching advice in your local profile history.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shareWithEmployers}
                    onChange={(e) => setShareWithEmployers(e.target.checked)}
                    className="mt-0.5 rounded text-[#0B7F7A] focus:ring-[#0B7F7A]"
                  />
                  <div>
                    <span className="font-semibold block">Private to talent</span>
                    <span className="text-[11px] text-[#5A6779]">
                      Employers and recruiters cannot view your coaching transcripts.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Quick Prompts Rail */}
            <div className="bg-white rounded-xl border border-[#E2E7EE] p-4 shadow-sm space-y-2.5">
              <h3 className="text-xs font-bold text-[#0B1C2F] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#0B7F7A]" />
                Cameroon Career Scenarios
              </h3>

              <div className="space-y-1.5">
                {[
                  {
                    title: 'Bilingual Telecom Lead',
                    prompt: 'What are the top 3 behavioral interview questions asked at Orange or MTN Cameroon for technical lead roles?',
                  },
                  {
                    title: 'XAF Salary Benchmarking',
                    prompt: 'What is the realistic salary bracket for a Senior Data Analyst in Douala with 5 years experience in XAF?',
                  },
                  {
                    title: 'Remote Global Contract',
                    prompt: 'How should a Cameroonian developer invoice international European clients for contract roles to optimize banking and tax?',
                  },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(item.prompt)}
                    className="w-full text-left p-2.5 rounded-lg border border-[#E2E7EE] hover:border-[#0B7F7A] hover:bg-[#E6F5F3]/50 transition-all text-xs"
                  >
                    <div className="font-bold text-[#0B1C2F]">{item.title}</div>
                    <div className="text-[11px] text-[#5A6779] line-clamp-2 mt-0.5">{item.prompt}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Ethical Disclaimer */}
            <div className="p-3 rounded-xl bg-[#F4F6F9] border border-[#E2E7EE] text-[11px] text-[#5A6779] leading-relaxed">
              <strong>Ethics & Governance:</strong> WorkDey AI Coach provides mentoring and advisory guidance. It does not guarantee employment or replace human evaluation.
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB B: CV & COVER LETTER STUDIO */}
      {activeTab === 'cv_tool' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Input Form */}
          <div className="bg-white rounded-xl border border-[#E2E7EE] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E7EE]">
              <div>
                <h3 className="text-sm font-bold text-[#0B1C2F] font-display">
                  CV Text & Target Position
                </h3>
                <p className="text-xs text-[#5A6779]">
                  Paste your CV draft or let WorkDey extract skills and generate tailored application materials.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E6F5F3] text-[#0B7F7A] border border-[#0B7F7A]/20">
                Editable & Reviewable
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0B1C2F] mb-1">
                  Target Role Title
                </label>
                <input
                  type="text"
                  value={targetJobRole}
                  onChange={(e) => setTargetJobRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F4F6F9] border border-[#E2E7EE] rounded-lg focus:outline-none focus:border-[#0B7F7A] text-[#0B1C2F]"
                  placeholder="e.g. Senior Data Analyst"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0B1C2F] mb-1">
                  Target Company / Client
                </label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F4F6F9] border border-[#E2E7EE] rounded-lg focus:outline-none focus:border-[#0B7F7A] text-[#0B1C2F]"
                  placeholder="e.g. MTN Cameroon / AgroCam"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#0B1C2F]">CV Raw Text</label>
                <button
                  type="button"
                  onClick={() => {
                    const compiled = `${profile.full_name} - ${profile.headline || profile.target_role} (${profile.city}, Cameroon)\n\nEXPERIENCE:\n${profile.experiences_list.map((e) => `${e.job_title} at ${e.company_name} (${e.start_date} - ${e.is_current ? 'Present' : e.end_date}): ${e.description}`).join('\n\n')}\n\nSKILLS: ${profile.skills_list.map((s) => s.skill_name).join(', ')}`;
                    setCvInputText(compiled);
                  }}
                  className="text-[11px] font-bold text-[#0B7F7A] hover:underline"
                >
                  Pull from profile →
                </button>
              </div>
              <textarea
                rows={10}
                value={cvInputText}
                onChange={(e) => setCvInputText(e.target.value)}
                className="w-full p-3 text-xs font-mono bg-[#F4F6F9] border border-[#E2E7EE] rounded-lg focus:outline-none focus:border-[#0B7F7A] text-[#0B1C2F]"
                placeholder="Paste your CV content here..."
              />
            </div>

            {/* Tool Action Radios */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-[#0B1C2F] cursor-pointer">
                <input
                  type="radio"
                  name="cv_action"
                  checked={cvToolAction === 'analyze_and_improve'}
                  onChange={() => setCvToolAction('analyze_and_improve')}
                  className="text-[#0B7F7A] focus:ring-[#0B7F7A]"
                />
                Analyze & Critique CV
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-[#0B1C2F] cursor-pointer">
                <input
                  type="radio"
                  name="cv_action"
                  checked={cvToolAction === 'generate_cover_letter'}
                  onChange={() => setCvToolAction('generate_cover_letter')}
                  className="text-[#0B7F7A] focus:ring-[#0B7F7A]"
                />
                Draft Tailored Cover Letter
              </label>
            </div>

            <button
              onClick={handleRunCVTool}
              disabled={isAnalyzingCV || !cvInputText.trim()}
              className="w-full py-2.5 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#14A89E] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {isAnalyzingCV ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Processing with WorkDey Intelligence...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {cvToolAction === 'analyze_and_improve'
                      ? 'Analyze CV & Extract Skills'
                      : 'Generate Tailored Cover Letter'}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Results & Interactive Output */}
          <div className="bg-white rounded-xl border border-[#E2E7EE] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E7EE]">
              <h3 className="text-sm font-bold text-[#0B1C2F] font-display flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0B7F7A]" />
                Analysis & Generated Drafts
              </h3>

              {cvAnalysisResult && (
                <span className="text-[11px] font-bold text-[#5A6779]">
                  Score: <strong className="text-[#0B7F7A] text-sm">{cvAnalysisResult.overall_score}/100</strong>
                </span>
              )}
            </div>

            {!cvAnalysisResult && !isAnalyzingCV && (
              <div className="h-80 flex flex-col items-center justify-center text-center p-6 text-[#5A6779] space-y-2">
                <FileText className="w-10 h-10 text-[#A0AEC0]" />
                <h4 className="text-xs font-bold text-[#0B1C2F]">No analysis run yet</h4>
                <p className="text-[11px] max-w-sm">
                  Click &quot;Analyze CV & Extract Skills&quot; or &quot;Generate Cover Letter&quot; to review suggestions, impact rewrites, and bilingual talking points.
                </p>
              </div>
            )}

            {isAnalyzingCV && (
              <div className="h-80 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <Sparkles className="w-8 h-8 text-[#0B7F7A] animate-spin" />
                <div className="text-xs font-bold text-[#0B1C2F]">Analyzing competencies & metric impact...</div>
                <div className="text-[11px] text-[#5A6779]">Comparing against Cameroonian enterprise standards</div>
              </div>
            )}

            {cvAnalysisResult && (
              <div className="space-y-4 text-xs">
                {/* Executive Critique */}
                <div className="p-3 rounded-lg bg-[#E6F5F3] border border-[#0B7F7A]/20 text-[#0B1C2F] space-y-1">
                  <div className="font-bold text-[#0B7F7A] flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Executive Summary Critique
                  </div>
                  <p className="text-[11px] leading-relaxed text-[#0B1C2F]">
                    {cvAnalysisResult.executive_critique}
                  </p>
                </div>

                {/* Cover letter view if requested */}
                {cvAnalysisResult.cover_letter && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0B1C2F]">Generated Cover Letter (Editable)</span>
                      <button
                        onClick={handleCopyCoverLetter}
                        className="px-2.5 py-1 text-[11px] font-bold rounded bg-[#F4F6F9] hover:bg-[#E2E7EE] text-[#0B7F7A] flex items-center gap-1 border border-[#E2E7EE]"
                      >
                        {copiedCoverLetter ? <Check className="w-3 h-3 text-[#1A7F4B]" /> : <Copy className="w-3 h-3" />}
                        {copiedCoverLetter ? 'Copied to clipboard!' : 'Copy letter'}
                      </button>
                    </div>
                    <textarea
                      rows={8}
                      defaultValue={cvAnalysisResult.cover_letter.content}
                      className="w-full p-3 text-xs bg-[#F4F6F9] border border-[#E2E7EE] rounded-lg font-sans focus:outline-none focus:border-[#0B7F7A] text-[#0B1C2F] leading-relaxed"
                    />
                    <div className="p-2.5 rounded bg-slate-50 border border-[#E2E7EE] text-[11px] text-[#5A6779]">
                      <strong>Cultural Alignment:</strong> {cvAnalysisResult.cover_letter.cultural_alignment}
                    </div>
                  </div>
                )}

                {/* Suggestions and Rewrites */}
                {cvAnalysisResult.suggestions && cvAnalysisResult.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-[#0B1C2F]">Actionable Rewrites & Suggestions</h4>
                    <div className="space-y-2">
                      {cvAnalysisResult.suggestions.map((sug, i) => (
                        <div key={i} className="p-3 rounded-lg border border-[#E2E7EE] space-y-1.5">
                          <div className="flex items-center justify-between font-bold text-[11px]">
                            <span className="text-[#0B7F7A]">{sug.section}</span>
                            <span className="text-[#B45309]">{sug.issue}</span>
                          </div>
                          <p className="text-[11px] text-[#5A6779]">{sug.recommendation}</p>
                          <div className="p-2 rounded bg-[#F4F6F9] text-[11px] text-[#0B1C2F] font-mono border-l-2 border-[#0B7F7A]">
                            <strong>Example Rewrite:</strong> {sug.example_rewrite}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extracted Skills */}
                {cvAnalysisResult.extracted_skills && (
                  <div className="pt-2 border-t border-[#E2E7EE] space-y-2">
                    <h4 className="font-bold text-[#0B1C2F]">Extracted Competencies</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {cvAnalysisResult.extracted_skills.hard_skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#E6F5F3] text-[#0B7F7A] border border-[#0B7F7A]/20"
                        >
                          {skill}
                        </span>
                      ))}
                      {cvAnalysisResult.extracted_skills.tools_and_platforms.map((tool, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-[#0B1C2F] border border-slate-200"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
