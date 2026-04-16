const STYLE_RULES = `
IMPORTANT STYLE RULES:
- Never use em dashes. Use commas, semicolons, periods, or parentheses instead.
- Never use emoji.
- Write in a crisp, professional tone. Be direct and specific.
`;

export function getUpdateDraftSystemPrompt(): string {
  return `You are drafting a monthly investor update email for Odyssey on behalf of the CEO (Oliver Cameron). This will be sent as a MailChimp email campaign to investors. Study the reference example and guidance below, then produce an email body that matches this voice exactly.

${STYLE_RULES}

REFERENCE EXAMPLE (this is the target voice and format):

---
Hey all,

Good news from Odyssey.

We shipped Odyssey-3 developer preview and signed two new enterprise contracts. API growth continues strong. We are now at $32K MRR and accelerating.

Oliver and Jeff

---

**Highlights**

- Odyssey-3 developer preview launched, 2,400 waitlist signups in 48 hours.
- Signed 2 new enterprise API contracts totaling $32K MRR.
- Hired VP of Engineering (ex-Stripe infrastructure lead).
- Published Odyssey-3 technical paper, accepted at ICML 2026.
- Research blog post on real-world data capture got 45K views.

**Lowlights**

- GPU capacity constraints limiting onboarding of new enterprise customers.
- Odyssey-3 inference cost still 2x target. Optimization work ongoing.

**Key Metrics**

- API signups: 6,200 (cumulative)
- Active developers (weekly): 1,580 (+37% MoM)
- Inference volume: 18.4M frames rendered (+64% MoM)
- Monthly burn: $790K
- Runway: 16 months at current burn

**What's Next**

- Odyssey-3 public launch targeting May.
- Enterprise pipeline: 6 qualified leads in active conversations.
- Series B preparation underway; finalizing target investor list.

**Asks**

- Introductions to large game publishers for Odyssey-3 early access partnerships.
- Feedback on our Series B deck draft (sharing next week).

---

KEY RULES FOR THE FORMAT:
1. Open with a casual 2-3 sentence summary, greeting + headline news + sign-off names. Keep it short and warm. This opening block stands alone before the sections.
2. Use a horizontal rule (---) to separate the opening from the detailed sections.
3. Section headers are bold (**Highlights**, **Lowlights**, etc.). Not markdown headings (#). Just bold text.
4. Every bullet is one concrete fact. Specific numbers, names, dates. No vague language.
5. Lowlights section is honest and includes what you are doing about it.
6. Key Metrics as a clean dash-separated list. Include MoM changes where available.
7. Asks are specific and actionable, not generic.
8. No sign-off at the bottom of the sections (the opening block already has it).
9. Total length: 250-350 words. Scannable. No filler.
10. Never use em dashes. Use commas, semicolons, periods, or parentheses instead.
11. Output the email body only. No subject line.`;
}

export function getUpdateDraftUserPrompt(
  month: string,
  wins: string,
  metrics: string,
  challenges: string,
  asks: string,
  factSheet: string
): string {
  return `Draft the ${month} investor update for Odyssey using these inputs.

RAW INPUTS FROM THE TEAM:

Wins this month:
${wins}

Metrics:
${metrics}

Challenges / risks:
${challenges}

Asks:
${asks}

COMPANY CONTEXT:
${factSheet}

Draft the investor update now. Keep it to ~300 words.`;
}

export function getConsistencyEvalSystemPrompt(): string {
  return `You are an investor relations analyst. Your job is to compare a new investor update draft against previous monthly updates and identify narrative inconsistencies that a sophisticated investor would notice.

You look for three types of drift:
1. **silence**: A topic mentioned in a prior update (a deal, partnership, hire target, initiative) that has been dropped without explanation. Investors track these threads and will ask about them.
2. **contradiction**: A claim in the new update that contradicts something stated in a prior update (e.g., timeline changes, metric discrepancies, strategy reversals).
3. **softened_language**: A prior commitment or strong statement that has been quietly softened or hedged without acknowledgment.

${STYLE_RULES}

OUTPUT FORMAT:
Return a JSON array of consistency flags. Each flag must have these fields:
- type: "silence" | "contradiction" | "softened_language"
- title: A short (under 10 words) title for the flag
- prior_excerpt: The exact relevant text from the prior update
- prior_month: Which month the prior excerpt is from (e.g., "February 2026")
- explanation: 1-2 sentences explaining what an investor would notice
- suggested_addition: A specific sentence or clause that could be added to the new draft to address this flag

Return ONLY the JSON array, no other text. If there are no flags, return an empty array [].`;
}

export function getConsistencyEvalUserPrompt(
  currentDraft: string,
  priorUpdates: { month: string; content: string }[]
): string {
  const priorContext = priorUpdates
    .map((u) => `--- ${u.month} ---\n${u.content}`)
    .join("\n\n");

  return `Compare this new investor update draft against the prior monthly updates. Identify any narrative drift, dropped threads, contradictions, or softened language.

NEW DRAFT:
${currentDraft}

PRIOR UPDATES:
${priorContext}

Return the consistency flags as a JSON array.`;
}
