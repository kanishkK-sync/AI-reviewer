import { Clock, ChevronRight, Trash2 } from 'lucide-react';
import { Review } from '../types';

interface HistorySidebarProps {
  history: Review[];
  onLoadHistory: (item: Review) => void;
  onDelete: (id: string) => void;
}

function HistorySidebar({ history, onLoadHistory, onDelete }: HistorySidebarProps) {
  const getSentimentColor = (sentiment: string) => {
    const lower = sentiment.toLowerCase();
    if (lower.includes('positive')) return 'bg-green-100 text-green-700';
    if (lower.includes('negative')) return 'bg-red-100 text-red-700';
    return 'bg-slate-100 text-slate-700';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-73px)] p-4 overflow-y-auto">
      <div className="flex items-center gap-2 mb-4 sticky top-0 bg-white z-10">
        <Clock className="w-5 h-5 text-slate-600" />
        <h2 className="font-semibold text-slate-800">History</h2>
      </div>

      {history.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">No history yet</p>
      ) : (
        <div className="space-y-2">
          {history.map((item) => (
            <div
              key={item.id}
              className="group relative p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
            >
              <button
                onClick={() => onLoadHistory(item)}
                className="w-full text-left"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-xs px-2 py-1 rounded ${getSentimentColor(item.sentiment)}`}>
                    {item.sentiment}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 mb-1">
                  {item.review_text}
                </p>
                <p className="text-xs text-slate-400">
                  {formatDate(item.created_at)} • {item.tone}
                </p>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}

export default HistorySidebar;
