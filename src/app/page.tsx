import { readFileSync } from "fs";
import { join } from "path";
import { Investor } from "@/lib/types";
import ClientPage from "@/components/ClientPage";

function loadInvestors(): Investor[] {
  const filePath = join(process.cwd(), "data", "investors.json");
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

export default function Home() {
  const investors = loadInvestors();

  return <ClientPage investors={investors} />;
}
