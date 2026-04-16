"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ConsistencyFlag, InvestorUpdateResponse } from "@/lib/types";

const DEFAULT_METRICS = `API signups: 6,200 (cumulative)
Active developers (weekly): 1,580
Inference volume: 18.4M frames rendered
Monthly burn: $790K
Runway: 16 months at current burn`;

const DEFAULT_WINS = `Odyssey-3 developer preview announced, 2,400 waitlist signups in 48 hours
Enterprise pipeline converted: 2 new paid contracts ($32K MRR total)
Hired VP of Engineering (ex-Stripe infrastructure lead)
Published Odyssey-3 technical paper, accepted at ICML 2026`;

const DEFAULT_CHALLENGES = `GPU capacity constraints limiting onboarding of new enterprise customers
Odyssey-3 inference cost still 2x target, optimization work ongoing`;

const DEFAULT_ASKS = `Introductions to large game publishers for Odyssey-3 early access partnerships
Feedback on Series B deck draft (sharing next week)`;

const FLAG_CONFIG: Record<
  ConsistencyFlag["type"],
  { label: string; accent: string; border: string; bg: string; text: string }
> = {
  silence: {
    label: "Dropped Thread",
    accent: "text-amber-400/80",
    border: "border-amber-500/15",
    bg: "bg-amber-500/[0.04]",
    text: "text-amber-400/50",
  },
  contradiction: {
    label: "Contradiction",
    accent: "text-red-400/80",
    border: "border-red-500/15",
    bg: "bg-red-500/[0.04]",
    text: "text-red-400/50",
  },
  softened_language: {
    label: "Softened",
    accent: "text-orange-400/80",
    border: "border-orange-500/15",
    bg: "bg-orange-500/[0.04]",
    text: "text-orange-400/50",
  },
};

export default function InvestorUpdate() {
  const [month] = useState("April 2026");
  const [wins, setWins] = useState(DEFAULT_WINS);
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);
  const [challenges, setChallenges] = useState(DEFAULT_CHALLENGES);
  const [asks, setAsks] = useState(DEFAULT_ASKS);
  const [draft, setDraft] = useState("");
  const [flags, setFlags] = useState<ConsistencyFlag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<
    "draft" | "evaluate" | null
  >(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setLoadingPhase("draft");
    setDraft("");
    setFlags([]);

    try {
      const response = await fetch("/api/investor-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, wins, metrics, challenges, asks }),
      });

      if (!response.ok) throw new Error("Failed to generate update");

      setLoadingPhase("evaluate");
      const data: InvestorUpdateResponse = await response.json();
      setDraft(data.draft);
      setFlags(data.flags);
    } catch {
      setDraft("Error generating update. Please try again.");
    } finally {
      setIsLoading(false);
      setLoadingPhase(null);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-7 space-y-7">
        {/* Month Badge */}
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-[12px] border border-[var(--accent)]/20 bg-[var(--accent-glow)] text-[var(--accent)]">
            {month}
          </span>
          <span className="text-[11px] text-white/15 tracking-wide">
            New draft. Jan through Mar prefilled as demo data.
          </span>
        </div>

        {/* Input Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-2.5">
            <label className="text-[11px] font-medium text-white/40 uppercase tracking-[0.12em]">
              Wins This Month
            </label>
            <textarea
              value={wins}
              onChange={(e) => setWins(e.target.value)}
              rows={5}
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-5 py-3.5 text-[13px] text-white/70 focus:outline-none focus:border-[var(--accent)]/30 resize-none leading-relaxed"
            />
          </div>

          <div className="space-y-2.5">
            <label className="text-[11px] font-medium text-white/40 uppercase tracking-[0.12em]">
              Key Metrics
            </label>
            <textarea
              value={metrics}
              onChange={(e) => setMetrics(e.target.value)}
              rows={5}
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-5 py-3.5 text-[13px] text-white/70 focus:outline-none focus:border-[var(--accent)]/30 resize-none font-[family-name:var(--font-geist-mono)] text-[12px] leading-relaxed"
            />
          </div>

          <div className="space-y-2.5">
            <label className="text-[11px] font-medium text-white/40 uppercase tracking-[0.12em]">
              Challenges / Risks
            </label>
            <textarea
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              rows={3}
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-5 py-3.5 text-[13px] text-white/70 focus:outline-none focus:border-[var(--accent)]/30 resize-none leading-relaxed"
            />
          </div>

          <div className="space-y-2.5">
            <label className="text-[11px] font-medium text-white/40 uppercase tracking-[0.12em]">
              Asks
            </label>
            <textarea
              value={asks}
              onChange={(e) => setAsks(e.target.value)}
              rows={3}
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-5 py-3.5 text-[13px] text-white/70 focus:outline-none focus:border-[var(--accent)]/30 resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl font-medium text-[14px] tracking-[-0.01em] transition-all disabled:opacity-20 disabled:cursor-not-allowed bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-[0_0_20px_rgba(75,123,245,0.15)] hover:shadow-[0_0_30px_rgba(75,123,245,0.25)]"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2.5">
              <span className="w-3.5 h-3.5 border-[1.5px] border-white/20 border-t-white rounded-full animate-spin" />
              {loadingPhase === "draft"
                ? "Drafting update..."
                : "Checking consistency against prior months..."}
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Generate Update + Consistency Check
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                className="opacity-60"
              >
                <path
                  d="M3 7.5H12M12 7.5L8 3.5M12 7.5L8 11.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
        </button>
      </div>

      {/* Output: Email + Flags */}
      {(draft || isLoading) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Email Template Panel */}
          <div className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden">
            {/* Email Header Bar */}
            <div className="flex items-center justify-between px-7 py-3.5 border-b border-white/[0.04]">
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white/25">
                  <rect x="1" y="3" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1" />
                  <path d="M1 4.5L7 8L13 4.5" stroke="currentColor" strokeWidth="1" />
                </svg>
                <span className="text-[11px] font-medium text-white/40 uppercase tracking-[0.12em]">
                  Email Preview
                </span>
              </div>
              {draft && (
                <button
                  onClick={handleCopy}
                  className={`text-[11px] px-3 py-1 rounded-full border transition-all ${
                    copied
                      ? "border-emerald-500/20 text-emerald-400/60"
                      : "border-white/[0.06] text-white/25 hover:border-white/[0.1] hover:text-white/40"
                  }`}
                >
                  {copied ? "Copied" : "Copy email"}
                </button>
              )}
            </div>

            {/* Email Metadata */}
            <div className="px-7 py-4 border-b border-white/[0.03] space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-[11px] text-white/20 w-12 shrink-0">From</span>
                <span className="text-[13px] text-white/60">
                  Oliver Cameron{" "}
                  <span className="text-white/20">&lt;oliver@odyssey.ml&gt;</span>
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-[11px] text-white/20 w-12 shrink-0">To</span>
                <span className="text-[13px] text-white/40">Investors</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-[11px] text-white/20 w-12 shrink-0">Subject</span>
                <span className="text-[13px] text-white/70 font-medium">
                  Odyssey {month} Update
                </span>
              </div>
            </div>

            {/* Email Body */}
            <div className="px-7 py-7">
              {draft ? (
                <div className="prose prose-invert prose-sm max-w-none prose-headings:font-[family-name:var(--font-playfair)] prose-headings:text-white/85 prose-headings:font-normal prose-p:text-white/60 prose-p:leading-[1.7] prose-li:text-white/60 prose-li:leading-[1.7] prose-strong:text-white/90 prose-strong:font-semibold prose-ul:space-y-1 prose-h2:text-[16px] prose-h2:mt-6 prose-h2:mb-2 prose-h3:text-[14px] prose-h3:mt-5 prose-h3:mb-2 prose-ul:marker:text-white/20 [&_strong]:text-white/85">
                  <ReactMarkdown>{draft}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex items-center justify-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <span className="w-5 h-5 border-[1.5px] border-white/[0.06] border-t-[var(--accent)] rounded-full animate-spin" />
                    <span className="text-[11px] text-white/15 tracking-wide">
                      Drafting email...
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Consistency Flags Panel */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.04]">
              <h3 className="text-[11px] font-medium text-white/40 uppercase tracking-[0.12em]">
                Consistency Flags
              </h3>
              <p className="text-[10px] text-white/15 mt-1 tracking-wide">
                Narrative drift vs. prior months
              </p>
            </div>
            <div className="p-4 space-y-3">
              {flags.length > 0 ? (
                flags.map((flag, i) => {
                  const config = FLAG_CONFIG[flag.type] || FLAG_CONFIG.silence;
                  return (
                    <div
                      key={i}
                      className={`rounded-xl border ${config.border} ${config.bg} p-4 space-y-2.5`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-[13px] font-medium ${config.accent}`}>
                          {flag.title}
                        </h4>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded ${config.border} ${config.text} border tracking-wide uppercase`}
                        >
                          {config.label}
                        </span>
                      </div>

                      <div className="text-[11px] text-white/20 border-l border-white/[0.06] pl-3 leading-relaxed">
                        <span className="text-white/12">
                          {flag.prior_month}:
                        </span>{" "}
                        &ldquo;{flag.prior_excerpt}&rdquo;
                      </div>

                      <p className="text-[11px] text-white/35 leading-relaxed">
                        {flag.explanation}
                      </p>

                      <div className="text-[11px] text-[var(--accent)]/60 bg-[var(--accent-glow)] rounded-lg px-3 py-2 border border-[var(--accent)]/10 leading-relaxed">
                        <span className="text-[var(--accent)]/30 font-medium text-[10px] uppercase tracking-wide">
                          Suggest:{" "}
                        </span>
                        {flag.suggested_addition}
                      </div>
                    </div>
                  );
                })
              ) : draft ? (
                <p className="text-[12px] text-white/15 text-center py-10">
                  No flags detected
                </p>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 gap-2.5">
                  <span className="w-4 h-4 border-[1.5px] border-white/[0.06] border-t-amber-400/60 rounded-full animate-spin" />
                  <span className="text-[10px] text-white/15 tracking-wide">
                    Analyzing consistency...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
