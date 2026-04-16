export interface InvestorUpdateRequest {
  month: string;
  wins: string;
  metrics: string;
  challenges: string;
  asks: string;
}

export interface ConsistencyFlag {
  type: "silence" | "contradiction" | "softened_language";
  title: string;
  prior_excerpt: string;
  prior_month: string;
  explanation: string;
  suggested_addition: string;
}

export interface InvestorUpdateResponse {
  draft: string;
  flags: ConsistencyFlag[];
}
