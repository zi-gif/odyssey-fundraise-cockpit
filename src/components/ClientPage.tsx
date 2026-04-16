"use client";

import InvestorUpdate from "./InvestorUpdate";

function OdysseyGlobe() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      className="opacity-70"
    >
      <circle
        cx="11"
        cy="11"
        r="10"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.5"
      />
      <ellipse
        cx="11"
        cy="11"
        rx="6"
        ry="10"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.35"
      />
      <ellipse
        cx="11"
        cy="11"
        rx="2.5"
        ry="10"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.25"
      />
      <line
        x1="1"
        y1="7"
        x2="21"
        y2="7"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.2"
      />
      <line
        x1="1"
        y1="15"
        x2="21"
        y2="15"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.2"
      />
      <circle cx="11" cy="11" r="1" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={className}
    >
      <path
        d="M5.5 3L9.5 7L5.5 11"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ClientPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-white/[0.05] backdrop-blur-sm bg-[#050508]/80 sticky top-0 z-50">
        <div className="max-w-[1100px] mx-auto px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <OdysseyGlobe />
            <span className="font-[family-name:var(--font-playfair)] text-[17px] text-white/85 tracking-[-0.01em]">
              Fundraise Cockpit
            </span>
          </div>
          <span className="text-[11px] text-white/15 tracking-wide">
            Zi / Apr 2026
          </span>
        </div>
      </header>

      {/* Scenario Banner */}
      <div className="border-b border-white/[0.03]">
        <div className="max-w-[1100px] mx-auto px-8 py-3.5 flex items-center gap-4">
          <span className="shrink-0 px-2 py-0.5 rounded text-[9px] font-medium border border-white/[0.08] text-white/25 uppercase tracking-[0.15em]">
            Scenario
          </span>
          <p className="text-[13px] text-white/25 leading-relaxed">
            Odyssey is preparing a $60M Series B, targeting Q3 2026, ~$300M
            post. Odyssey-2 Pro API live for 8 months. This cockpit is the CoS
            workspace for that raise.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1100px] mx-auto w-full px-8 py-10 flex-1">
        <div className="mb-10">
          <h1 className="font-[family-name:var(--font-playfair)] text-[38px] leading-[1.15] tracking-[-0.02em] text-white/90 mb-3">
            Monthly Investor Update
          </h1>
          <p className="text-[15px] text-white/30 leading-relaxed max-w-xl">
            Draft the monthly update and check narrative consistency against
            prior months.
          </p>
        </div>

        <InvestorUpdate />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.03] mt-auto">
        <div className="max-w-[1100px] mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-white/12">
            <OdysseyGlobe />
            <span>
              Built by Zi in 2 days, Apr 2026. Chief of Staff application.
              All scenarios hypothetical except where sourced.
            </span>
          </div>
          <p className="text-[11px] text-white/12 flex items-center gap-1.5">
            Powered by Claude
            <ArrowIcon className="opacity-40" />
          </p>
        </div>
      </footer>
    </div>
  );
}
