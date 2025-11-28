import { AnalysisResult } from '../types';

export const aiService = {
  async analyzeReview(reviewText: string, tone: string): Promise<AnalysisResult> {
    const prompt = `Analyze this review: '${reviewText}'. Tone: ${tone}. Return ONLY a valid JSON object with these exact fields: { "sentiment": "Positive" or "Negative" or "Neutral", "issues": ["issue1", "issue2", "issue3"], "reply": "professional business response" }. The reply should address the issues in ${tone} tone.`;

    try {
      const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`);
      const text = await response.text();

      try {
        const parsed = JSON.parse(text);
        return {
          sentiment: parsed.sentiment || 'Neutral',
          issues: Array.isArray(parsed.issues) ? parsed.issues.slice(0, 3) : ['Issue 1', 'Issue 2', 'Issue 3'],
          reply: parsed.reply || 'Thank you for your feedback.',
        };
      } catch {
        const isBad = reviewText.toLowerCase().includes('bad') || reviewText.toLowerCase().includes('terrible') || reviewText.toLowerCase().includes('worst');
        const isGood = reviewText.toLowerCase().includes('great') || reviewText.toLowerCase().includes('excellent') || reviewText.toLowerCase().includes('love');

        return {
          sentiment: isGood ? 'Positive' : isBad ? 'Negative' : 'Neutral',
          issues: ['Unable to parse AI response', 'Please try again', 'Raw response below'],
          reply: text,
        };
      }
    } catch (error) {
      console.error('Error analyzing review:', error);
      return {
        sentiment: 'Neutral',
        issues: ['Network error', 'Please check connection', 'Try again'],
        reply: 'Unable to generate response. Please try again.',
      };
    }
  },
};
