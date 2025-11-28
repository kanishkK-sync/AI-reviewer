import { useState, useEffect } from 'react';
import { Sparkles, Copy, History, ThumbsUp, ThumbsDown, AlertCircle, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { reviewService } from './services/supabase'; // Using our local adapter

function App() {
  // Default to empty array [] to prevent .map() crashes
  const [history, setHistory] = useState<any[]>([]);
  const [review, setReview] = useState('');
  const [tone, setTone] = useState('Professional');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  // 1. SAFE LOAD: Only set history if it is a real array
  useEffect(() => {
    const loadHistory = async () => {
      const { data } = await reviewService.getAllReviews();
      if (Array.isArray(data)) {
        setHistory(data);
      } else {
        setHistory([]); // Fallback to empty list
      }
    };
    loadHistory();
  }, []);

  const handleAnalyze = async () => {
    if (!review.trim()) return;
    setIsAnalyzing(true);
    setResult(null);

    try {
      // Pollinations AI Call
      const prompt = `Analyze this review: '${review}'. Tone: ${tone}. Return ONLY a JSON object with keys: sentiment (Positive/Negative/Neutral), issues (array of strings), reply (string).`;
      
      const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`);
      const text = await response.text();
      
      // Attempt to parse JSON, fallback to raw text if AI fails
      let analysis;
      try {
        analysis = JSON.parse(text);
      } catch (e) {
        analysis = {
          sentiment: 'Neutral',
          issues: ['General Feedback'],
          reply: text
        };
      }

      setResult(analysis);

      // Save to History safely
      const newReview = {
        original: review,
        sentiment: analysis.sentiment,
        reply: analysis.reply,
        date: new Date().toLocaleDateString()
      };
      
      await reviewService.createReview(newReview);
      
      // Update UI immediately
      setHistory(prev => [newReview, ...prev]);

    } catch (error) {
      console.error(error);
      alert("AI Error. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      
      {/* SIDEBAR HISTORY */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-slate-100 font-bold text-slate-700 flex items-center gap-2">
          <History size={18} /> Review History
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* SAFE RENDER: Checks length first */}
          {history.length === 0 && (
            <div className="text-xs text-slate-400 text-center mt-10">No history yet</div>
          )}
          
          {history.map((item: any, i: number) => (
            <div key={i} onClick={() => { setReview(item.original); setResult(item); }} className="p-3 bg-slate-50 border border-slate-100 rounded-lg hover:border-blue-300 cursor-pointer transition-all shadow-sm">
               <div className="flex justify-between items-center mb-2">
                 <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.sentiment?.toLowerCase().includes('pos') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                   {item.sentiment || 'Neutral'}
                 </span>
                 <span className="text-[10px] text-slate-400">{item.date}</span>
               </div>
               <p className="text-xs text-slate-600 line-clamp-2">{item.original}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
             <MessageSquare /> ReviewGuard AI
          </div>
          <button className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition">
            Export Report
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* LEFT: INPUT */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Customer Review</label>
                <textarea 
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm leading-relaxed"
                  placeholder="Paste the Google Review here..."
                ></textarea>
                
                <div className="mt-4 flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Tone</label>
                    <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none">
                      <option>Professional</option>
                      <option>Empathetic</option>
                      <option>Firm</option>
                      <option>Witty</option>
                    </select>
                  </div>
                  <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !review}
                    className="flex-1 mt-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze & Draft'} <Sparkles size={16}/>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT: OUTPUT */}
            <div className="relative">
              <AnimatePresence>
                {result && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* SENTIMENT CARD */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Sentiment Analysis</h3>
                        <div className="text-2xl font-bold text-slate-800">{result.sentiment}</div>
                      </div>
                      <div className={`p-4 rounded-full ${result.sentiment?.includes('Pos') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                         {result.sentiment?.includes('Pos') ? <ThumbsUp /> : <ThumbsDown />}
                      </div>
                    </div>

                    {/* REPLY CARD */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-slate-700">Suggested Response</h3>
                        <button onClick={() => copyToClipboard(result.reply)} className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1">
                          <Copy size={14}/> Copy
                        </button>
                      </div>
                      <textarea 
                        readOnly 
                        value={result.reply}
                        className="w-full h-40 text-sm text-slate-600 leading-relaxed bg-transparent border-none outline-none resize-none"
                      />
                      <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                        {result.issues?.map((issue: string, i: number) => (
                           <span key={i} className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-full flex items-center gap-1">
                             <AlertCircle size={10}/> {issue}
                           </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!result && !isAnalyzing && (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-xl">
                   <MessageSquare size={48} className="mb-4 opacity-50"/>
                   <p>Ready to analyze reviews</p>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default App;