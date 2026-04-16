export interface Investor {
  id: string;
  name: string;
  firm: string;
  role: string;
  relationship_to_odyssey: string;
  check_size_range: string;
  stage_focus: string;
  thesis_notes: string[];
  recent_relevant_deals: {
    company: string;
    role: string;
    year: number;
    relevance: string;
  }[];
  public_statements_on_world_models: string[];
  known_portfolio_conflicts: string[];
  warm_intro_paths: string[];
  source_urls: string[];
}

export interface MeetingPrepRequest {
  investorId: string | null;
  investorName: string;
  meetingType: string;
  context: string;
}

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
