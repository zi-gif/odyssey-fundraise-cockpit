import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { join } from "path";
import { MeetingPrepRequest, Investor } from "@/lib/types";
import {
  getMeetingPrepSystemPrompt,
  getMeetingPrepUserPrompt,
} from "@/lib/prompts";

const client = new Anthropic();

function loadInvestors(): Investor[] {
  const filePath = join(process.cwd(), "data", "investors.json");
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

function loadFactSheet(): string {
  const filePath = join(process.cwd(), "data", "odyssey-fact-sheet.md");
  return readFileSync(filePath, "utf-8");
}

export async function POST(request: Request) {
  const body: MeetingPrepRequest = await request.json();
  const { investorId, investorName, meetingType, context } = body;

  const investors = loadInvestors();
  const investor = investorId
    ? investors.find((i) => i.id === investorId) || null
    : null;
  const factSheet = loadFactSheet();

  const systemPrompt = getMeetingPrepSystemPrompt();
  const userPrompt = getMeetingPrepUserPrompt(
    investor,
    investorName,
    meetingType,
    context,
    factSheet
  );

  const stream = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    stream: true,
    system: [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userPrompt }],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
