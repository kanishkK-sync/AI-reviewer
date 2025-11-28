import { Download, Shield } from 'lucide-react';
import { AnalysisResult } from '../types';

interface HeaderProps {
  analysis: AnalysisResult | null;
  editableReply: string;
}

function Header({ analysis, editableReply }: HeaderProps) {
  const handleExport = () => {
    if (!analysis) return;

    const exportText = `SENTIMENT: ${analysis.sentiment}\n\nKEY POINTS:\n${analysis.issues.map(issue => `- ${issue}`).join('\n')}\n\nREPLY:\n${editableReply}`;

    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `review-response-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-blue-600">ReviewGuard</h1>
        </div>

        <button
          onClick={handleExport}
          disabled={!analysis}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
    </header>
  );
}

export default Header;
