"use client";

import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Investor } from "@/lib/types";

interface MeetingPrepProps {
  investors: Investor[];
}

const MEETING_TYPES = [
  "First pitch",
  "Follow-on conversation",
  "Strategic update",
  "Quarterly check-in",
];

export default function MeetingPrep({ investors }: MeetingPrepProps) {
  const [selectedInvestor, setSelectedInvestor] = useState<string>("");
  const [customInvestor, setCustomInvestor] = useState("");
  const [meetingType, setMeetingType] = useState(MEETING_TYPES[0]);
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleGenerate = async () => {
    if (!selectedInvestor && !customInvestor) return;

    setIsLoading(true);
    setOutput("");

    abortRef.current = new AbortController();

    try {
      const investor = investors.find((i) => i.id === selectedInvestor);
      const response = await fetch("/api/meeting-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          investorId: isCustom ? null : selectedInvestor,
          investorName: isCustom
            ? customInvestor
            : investor?.name || selectedInvestor,
          meetingType,
          context,
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) throw new Error("Failed to generate brief");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let accumulated = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setOutput(accumulated);
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        setOutput("Error generating brief. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-7 space-y-7">
        {/* Investor Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-white/40 uppercase tracking-[0.12em]">
              Select Investor
            </label>
            <div className="flex gap-1.5">
              <button
                onClick={() => setIsCustom(false)}
                className={`px-3 py-1 rounded-full text-[11px] tracking-wide transition-all ${
                  !isCustom
                    ? "bg-white/[0.08] text-white/70"
                    : "text-white/25 hover:text-white/40"
                }`}
              >
                Preloaded
              </button>
              <button
                onClick={() => setIsCustom(true)}
                className={`px-3 py-1 rounded-full text-[11px] tracking-wide transition-all ${
                  isCustom
                    ? "bg-white/[0.08] text-white/70"
                    : "text-white/25 hover:text-white/40"
                }`}
              >
                Custom
              </button>
            </div>
          </div>

          {!isCustom ? (
            <div className="grid grid-cols-1 gap-1.5">
              {investors.map((inv) => {
                const isExisting =
                  inv.relationship_to_odyssey.includes("Existing");
                const isSelected = selectedInvestor === inv.id;
                return (
                  <button
                    key={inv.id}
                    onClick={() => setSelectedInvestor(inv.id)}
                    className={`card-glow text-left px-5 py-3.5 rounded-xl border transition-all group ${
                      isSelected
                        ? "border-[var(--accent)]/30 bg-[var(--accent-glow)]"
                        : "border-white/[0.04] hover:border-white/[0.08] bg-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span
                          className={`text-[15px] font-medium tracking-[-0.01em] ${isSelected ? "text-white" : "text-white/80"}`}
                        >
                          {inv.name}
                        </span>
                        <span className="text-[13px] text-white/25">
                          {inv.firm}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full tracking-wide ${
                          isExisting
                            ? "text-emerald-400/60 bg-emerald-500/[0.06] border border-emerald-500/15"
                            : "text-white/20 border border-white/[0.06]"
                        }`}
                      >
                        {isExisting ? "Cap table" : "Target"}
                      </span>
                    </div>
                    <p className="text-[12px] text-white/20 mt-0.5">
                      {inv.role}
                    </p>
                  </button>
                );
              })}
            </div>
          ) : (
            <input
              type="text"
              value={customInvestor}
              onChange={(e) => setCustomInvestor(e.target.value)}
              placeholder="e.g., Sarah Guo at Conviction"
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-5 py-3.5 text-[15px] text-white placeholder:text-white/15 focus:outline-none focus:border-[var(--accent)]/30 focus:bg-[var(--accent-glow)]"
            />
          )}
        </div>

        {/* Meeting Type */}
        <div className="space-y-3">
          <label className="text-[11px] font-medium text-white/40 uppercase tracking-[0.12em]">
            Meeting Type
          </label>
          <div className="flex flex-wrap gap-2">
            {MEETING_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setMeetingType(type)}
                className={`px-4 py-2 rounded-full text-[13px] border transition-all ${
                  meetingType === type
                    ? "border-[var(--accent)]/30 bg-[var(--accent-glow)] text-white/80"
                    : "border-white/[0.06] text-white/25 hover:border-white/[0.1] hover:text-white/40"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Context */}
        <div className="space-y-3">
          <label className="text-[11px] font-medium text-white/40 uppercase tracking-[0.12em]">
            Additional Context
            <span className="text-white/15 ml-2 normal-case tracking-normal font-normal">
              optional
            </span>
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g., Oliver met this partner briefly at a dinner last month. They expressed interest in world models but had concerns about compute costs."
            rows={3}
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-5 py-3.5 text-[14px] text-white/80 placeholder:text-white/12 focus:outline-none focus:border-[var(--accent)]/30 resize-none leading-relaxed"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading || (!selectedInvestor && !customInvestor)}
          className="w-full py-3.5 rounded-xl font-medium text-[14px] tracking-[-0.01em] transition-all disabled:opacity-20 disabled:cursor-not-allowed bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-[0_0_20px_rgba(75,123,245,0.15)] hover:shadow-[0_0_30px_rgba(75,123,245,0.25)]"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2.5">
              <span className="w-3.5 h-3.5 border-[1.5px] border-white/20 border-t-white rounded-full animate-spin" />
              Generating brief...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Generate Meeting Brief
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

      {/* Output */}
      {output && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden">
          <div className="flex items-center justify-between px-7 py-4 border-b border-white/[0.04]">
            <h3 className="text-[11px] font-medium text-white/40 uppercase tracking-[0.12em]">
              Meeting Brief
            </h3>
            <button
              onClick={handleCopy}
              className={`text-[11px] px-3 py-1 rounded-full border transition-all ${
                copied
                  ? "border-emerald-500/20 text-emerald-400/60"
                  : "border-white/[0.06] text-white/25 hover:border-white/[0.1] hover:text-white/40"
              }`}
            >
              {copied ? "Copied" : "Copy markdown"}
            </button>
          </div>
          <div className="px-7 py-7 prose prose-invert prose-sm max-w-none prose-headings:font-[family-name:var(--font-playfair)] prose-headings:text-white/85 prose-headings:font-normal prose-headings:tracking-[-0.01em] prose-p:text-white/55 prose-p:leading-relaxed prose-li:text-white/55 prose-li:leading-relaxed prose-strong:text-white/75 prose-h2:text-[18px] prose-h2:mt-10 prose-h2:mb-3 prose-h2:first:mt-0 prose-ol:text-white/55 prose-ul:marker:text-white/15">
            <ReactMarkdown>{output}</ReactMarkdown>
            {isLoading && (
              <span className="inline-block w-[3px] h-[18px] bg-[var(--accent)]/50 animate-pulse ml-0.5 rounded-full" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
