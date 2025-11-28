import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Trash2, AlertCircle, CheckCircle, MinusCircle } from 'lucide-react';
import { AnalysisResult } from '../types';

interface OutputPanelProps {
  analysis: AnalysisResult | null;
  isLoading: boolean;
  editableReply: string;
  onUpdateReply: (reply: string) => void;
  onClear: () => void;
}

function OutputPanel({ analysis, isLoading, editableReply, onUpdateReply, onClear }: OutputPanelProps) {
  const [copiedResponse, setCopiedResponse] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(editableReply);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const getSentimentConfig = (sentiment: string) => {
    const lower = sentiment.toLowerCase();
    if (lower.includes('positive')) {
      return { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle };
    }
    if (lower.includes('negative')) {
      return { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle };
    }
    return { color: 'bg-slate-100 text-slate-800 border-slate-200', icon: MinusCircle };
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600">AI is analyzing your review...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-center min-h-[500px]">
        <div className="text-center text-slate-400">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium text-slate-600">No analysis yet</p>
          <p className="text-sm mt-2">Paste a review and click Analyze to get started</p>
        </div>
      </div>
    );
  }

  const sentimentConfig = getSentimentConfig(analysis.sentiment);
  const SentimentIcon = sentimentConfig.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
        >
          <h3 className="text-sm font-medium text-slate-700 mb-3">Sentiment</h3>
          <div className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg border ${sentimentConfig.color} font-medium text-lg`}>
            <SentimentIcon className="w-6 h-6" />
            {analysis.sentiment}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
        >
          <h3 className="text-sm font-medium text-slate-700 mb-4">Key Points</h3>
          <ul className="space-y-3">
            {analysis.issues.map((issue, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.08 }}
                className="flex items-start gap-3 text-slate-600"
              >
                <span className="text-blue-600 font-bold text-lg flex-shrink-0 mt-0.5">•</span>
                <span className="text-sm leading-relaxed">{issue}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
        >
          <h3 className="text-sm font-medium text-slate-700 mb-3">The Reply</h3>
          <textarea
            value={editableReply}
            onChange={(e) => onUpdateReply(e.target.value)}
            className="w-full h-48 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-700 bg-white placeholder-slate-400 font-medium"
            placeholder="Your AI-generated response..."
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex gap-3"
        >
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {copiedResponse ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy to Clipboard
              </>
            )}
          </button>

          <button
            onClick={onClear}
            className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default OutputPanel;
