import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { InvestorUpdateRequest, ConsistencyFlag } from "@/lib/types";
import {
  getUpdateDraftSystemPrompt,
  getUpdateDraftUserPrompt,
  getConsistencyEvalSystemPrompt,
  getConsistencyEvalUserPrompt,
} from "@/lib/prompts";

const client = new Anthropic();

function loadFactSheet(): string {
  const filePath = join(process.cwd(), "data", "odyssey-fact-sheet.md");
  return readFileSync(filePath, "utf-8");
}

function loadPriorUpdates(): { month: string; content: string }[] {
  const dir = join(process.cwd(), "data", "prior-updates");
  const files = readdirSync(dir).filter((f) => f.endsWith(".md")).sort();

  return files.map((f) => {
    const content = readFileSync(join(dir, f), "utf-8");
    const monthMatch = f.match(/^(\w+)-(\d{4})\.md$/);
    const month = monthMatch
      ? `${monthMatch[1].charAt(0).toUpperCase() + monthMatch[1].slice(1)} ${monthMatch[2]}`
      : f;
    return { month, content };
  });
}

export async function POST(request: Request) {
  const body: InvestorUpdateRequest = await request.json();
  const { month, wins, metrics, challenges, asks } = body;

  const factSheet = loadFactSheet();
  const priorUpdates = loadPriorUpdates();

  // Pass 1: Draft the update
  const draftResponse = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: [
      {
        type: "text",
        text: getUpdateDraftSystemPrompt(),
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: getUpdateDraftUserPrompt(
          month,
          wins,
          metrics,
          challenges,
          asks,
          factSheet
        ),
      },
    ],
  });

  const draft =
    draftResponse.content[0].type === "text"
      ? draftResponse.content[0].text
      : "";

  // Pass 2: Evaluate consistency
  let flags: ConsistencyFlag[] = [];

  if (priorUpdates.length > 0) {
    const evalResponse = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: [
        {
          type: "text",
          text: getConsistencyEvalSystemPrompt(),
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: getConsistencyEvalUserPrompt(draft, priorUpdates),
        },
      ],
    });

    const evalText =
      evalResponse.content[0].type === "text"
        ? evalResponse.content[0].text
        : "[]";

    try {
      // Extract JSON from the response (handle potential markdown code blocks)
      const jsonMatch = evalText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        flags = JSON.parse(jsonMatch[0]);
      }
    } catch {
      console.error("Failed to parse consistency flags:", evalText);
      flags = [];
    }
  }

  return Response.json({ draft, flags });
}
