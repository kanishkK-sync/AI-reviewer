import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface InputPanelProps {
  onAnalyze: (review: string, tone: string) => void;
  isLoading: boolean;
}

function InputPanel({ onAnalyze, isLoading }: InputPanelProps) {
  const [review, setReview] = useState('');
  const [tone, setTone] = useState('Professional');

  const handleSubmit = () => {
    if (review.trim()) {
      onAnalyze(review, tone);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Analyze Review</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Customer Review
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste the customer review here..."
            className="w-full h-48 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-700 placeholder-slate-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Response Tone
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700"
          >
            <option value="Professional">Professional</option>
            <option value="Friendly">Friendly</option>
            <option value="Witty">Witty</option>
            <option value="Apologetic">Apologetic</option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!review.trim() || isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-5 h-5" />
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
    </div>
  );
}

export default InputPanel;
