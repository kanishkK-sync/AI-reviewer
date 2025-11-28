export interface Review {
  id: string;
  review_text: string;
  tone: string;
  sentiment: string;
  issues: string[];
  reply: string;
  created_at: string;
}

export interface AnalysisResult {
  sentiment: string;
  issues: string[];
  reply: string;
}
