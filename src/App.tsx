import { useState, useEffect } from 'react';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import HistorySidebar from './components/HistorySidebar';
import { Review, AnalysisResult } from './types';
import { aiService } from './services/ai';
import { reviewService } from './services/supabase';

function App() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentReview, setCurrentReview] = useState<string>('');
  const [currentTone, setCurrentTone] = useState<string>('Professional');
  const [editableReply, setEditableReply] = useState<string>('');
  const [currentReviewId, setCurrentReviewId] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const reviews = await reviewService.getAllReviews();
    setHistory(reviews);
  };

  const handleAnalyze = async (review: string, tone: string) => {
    setIsLoading(true);
    setCurrentReview(review);
    setCurrentTone(tone);
    setCurrentReviewId(null);

    try {
      const result = await aiService.analyzeReview(review, tone);
      setAnalysis(result);
      setEditableReply(result.reply);

      const saved = await reviewService.addReview(review, tone, result.sentiment, result.issues, result.reply);
      if (saved) {
        setCurrentReviewId(saved.id);
        loadHistory();
      }
    } catch (error) {
      console.error('Error analyzing review:', error);
      setAnalysis({
        sentiment: 'Neutral',
        issues: ['Error connecting to AI service'],
        reply: 'Unable to generate response. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateReply = async (newReply: string) => {
    setEditableReply(newReply);
    if (currentReviewId) {
      await reviewService.updateReview(currentReviewId, newReply);
    }
  };

  const handleLoadHistory = async (review: Review) => {
    setCurrentReview(review.review_text);
    setCurrentTone(review.tone);
    setCurrentReviewId(review.id);
    setAnalysis({
      sentiment: review.sentiment,
      issues: review.issues,
      reply: review.reply,
    });
    setEditableReply(review.reply);
  };

  const handleClear = () => {
    setAnalysis(null);
    setCurrentReview('');
    setCurrentTone('Professional');
    setCurrentReviewId(null);
    setEditableReply('');
  };

  const handleDeleteHistory = async (id: string) => {
    await reviewService.deleteReview(id);
    loadHistory();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header analysis={analysis} editableReply={editableReply} />

      <div className="flex">
        <HistorySidebar
          history={history}
          onLoadHistory={handleLoadHistory}
          onDelete={handleDeleteHistory}
        />

        <main className="flex-1 max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InputPanel onAnalyze={handleAnalyze} isLoading={isLoading} />
            <OutputPanel
              analysis={analysis}
              isLoading={isLoading}
              editableReply={editableReply}
              onUpdateReply={handleUpdateReply}
              onClear={handleClear}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
