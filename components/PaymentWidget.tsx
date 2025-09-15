



import { GoogleGenAI, Type } from "@google/genai";
import React, { useState } from 'react';
import { SparklesIcon, InfoIcon, CheckCircleIcon, XCircleIcon } from './icons';

// 🤫 IMPORTANT: The API key must be provided as an environment variable `process.env.API_KEY`.
// Do not hardcode the key here for security reasons. The app will not work without it.
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.error("API Key not found. Please set the process.env.API_KEY environment variable.");
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    overall_verdict: { type: Type.STRING, description: 'A single word verdict: "Verified", "Likely False", "Needs Context", or "Mixed".' },
    trust_score: { type: Type.INTEGER, description: 'A score from 0 (untrustworthy) to 100 (trustworthy).' },
    summary: { type: Type.STRING, description: 'A concise one or two sentence summary of the analysis.' },
    claims: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          claim_text: { type: Type.STRING, description: 'The exact text of the claim found in the source.' },
          verdict: { type: Type.STRING, description: 'Verdict for this specific claim: "Verified", "Likely False", "Needs Context".' },
          explanation: { type: Type.STRING, description: 'A brief explanation for the verdict of this specific claim.' },
          sources: {
            type: Type.ARRAY,
            description: 'A list of URLs for sources that support the verdict.',
            items: {
              type: Type.STRING
            }
          }
        }
      }
    }
  }
};

type Claim = {
    claim_text: string;
    verdict: 'Verified' | 'Likely False' | 'Needs Context';
    explanation: string;
    sources?: string[];
};

type AnalysisResult = {
    overall_verdict: 'Verified' | 'Likely False' | 'Needs Context' | 'Mixed';
    trust_score: number;
    summary: string;
    claims: Claim[];
};

const getHighlightedText = (originalText: string, claims: Claim[] | undefined) => {
    if (!claims || claims.length === 0) {
        return { __html: originalText };
    }
    let highlighted = originalText;
    claims.forEach(claim => {
        let bgColor;
        switch (claim.verdict) {
            case 'Likely False': bgColor = 'bg-red-500/20'; break;
            case 'Needs Context': bgColor = 'bg-yellow-500/20'; break;
            case 'Verified': bgColor = 'bg-green-500/20'; break;
            default: bgColor = 'bg-gray-500/20';
        }
        const highlightedClaim = `<span class="${bgColor} rounded-md px-1 py-0.5">${claim.claim_text}</span>`;
        highlighted = highlighted.replace(new RegExp(claim.claim_text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), highlightedClaim);
    });
    return { __html: highlighted };
};

const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
        case 'Verified': return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
        case 'Likely False': return <XCircleIcon className="w-5 h-5 text-red-400" />;
        case 'Needs Context':
        case 'Mixed':
        default: return <InfoIcon className="w-5 h-5 text-yellow-400" />;
    }
};

const FactCheckWidget: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!API_KEY || !ai) {
      setError("Configuration Error: The Gemini API key is missing. Please ensure the API_KEY environment variable is set correctly.");
      return;
    }
    if (!input.trim()) {
      setError("Please enter some text to analyze.");
      return;
    }
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Please analyze the following text for misinformation and factual accuracy:\n\n---\n\n${input}`,
        config: {
          systemInstruction: "You are a world-class fact-checking AI. Your goal is to analyze text for misinformation with extreme accuracy and provide structured, unbiased feedback. For each claim you identify, it is mandatory to provide verifiable sources (as URLs) to support your verdict. If no source can be found, you must explicitly state that. Your response must be in the specified JSON format.",
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      });
      
      const jsonStr = response.text.trim();
      const parsedResult = JSON.parse(jsonStr);
      setResult(parsedResult);

    } catch (e) {
      console.error(e);
      setError("Sorry, an error occurred during analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = () => {
      setInput('');
      setResult(null);
      setError(null);
  }

  const getScoreColor = (score: number) => {
    if (score < 40) return 'text-red-400';
    if (score < 70) return 'text-yellow-400';
    return 'text-green-400';
  }

  return (
    <div className="w-full max-w-2xl p-px mx-auto rounded-2xl bg-gradient-to-b from-blue-500/50 via-blue-800/20 to-transparent shadow-2xl shadow-blue-900/40">
      <div className="bg-[#0c142b]/80 backdrop-blur-2xl rounded-[15px] p-6 text-white transition-all duration-500">
        <div className="flex items-center space-x-3 mb-6">
          <SparklesIcon className="w-5 h-5 text-white"/>
          <span className="text-sm font-semibold tracking-wider uppercase">Content Analyzer</span>
        </div>

        {result ? (
            <div className="space-y-6 animate-fade-in">
                <div className="p-4 rounded-lg bg-[#080f21]/80 border border-white/10">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                        <div className="flex-grow">
                            <h3 className="text-lg font-bold flex items-center gap-2">{getVerdictIcon(result.overall_verdict)} Overall Verdict: {result.overall_verdict}</h3>
                            <p className="text-gray-300 mt-1">{result.summary}</p>
                        </div>
                        <div className="text-center flex-shrink-0 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-white/10 sm:pl-4 sm:border-l">
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Trust Score</p>
                            <p className={`text-4xl font-bold ${getScoreColor(result.trust_score)}`}>{result.trust_score}</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-lg bg-[#080f21]/80 border border-white/10 max-h-60 overflow-y-auto">
                    <h4 className="text-sm font-semibold tracking-wider uppercase text-gray-400 mb-3">Analysis</h4>
                    <p className="text-left whitespace-pre-wrap text-gray-200" dangerouslySetInnerHTML={getHighlightedText(input, result.claims)} />
                </div>
                
                {result.claims && result.claims.length > 0 && (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {result.claims.map((claim, index) => (
                            <div key={index} className="flex items-start gap-3 text-left p-3 rounded-lg bg-[#080f21]/50">
                                <div className="flex-shrink-0 pt-1">{getVerdictIcon(claim.verdict)}</div>
                                <div>
                                    <p className="font-semibold text-white">"{claim.claim_text}"</p>
                                    <p className="text-sm text-gray-300">{claim.explanation}</p>
                                    {claim.sources && claim.sources.length > 0 && (
                                        <div className="mt-2">
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sources:</p>
                                            <ul className="list-disc list-inside text-sm space-y-1">
                                                {claim.sources.map((source, i) => (
                                                    <li key={i}>
                                                        <a href={source} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                                                            {source}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <button onClick={handleReset} className="w-full py-3 font-bold text-white transition-all rounded-lg bg-white/5 hover:bg-white/10 border border-white/10">
                  Analyze Another Text
                </button>
            </div>
        ) : (
            <div className="space-y-6">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste an article or text here to check for misinformation..."
                    className="w-full h-48 p-4 text-gray-200 bg-[#080f21] border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                    disabled={loading}
                />
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button 
                    onClick={handleAnalyze} 
                    disabled={loading || !API_KEY}
                    className="w-full py-4 font-bold tracking-wider text-white transition-all transform rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:scale-[1.03] hover:shadow-xl hover:shadow-blue-500/40 shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>ANALYZING...</span>
                    </>
                  ) : (
                    <>
                        <SparklesIcon className="w-5 h-5" />
                        <span>ANALYZE CONTENT</span>
                    </>
                  )}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default FactCheckWidget;