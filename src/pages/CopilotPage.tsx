import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  HelpCircle, 
  ShieldCheck
} from 'lucide-react';
import { 
  CopilotMessage, 
  COPILOT_PRESET_QUESTIONS, 
  answerFleetCopilotQuery 
} from '../services/copilotService';

export const CopilotPage: React.FC = () => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'init',
      sender: 'assistant',
      category: 'OPTIMIZATION',
      text: "Welcome to NautiQ Maritime Copilot. I am connected directly to your active fleet digital twin (12 vessels, 8 transoceanic voyages). Ask me any question regarding voyage optimizations, fuel selection rationale, carbon tax sensitivity, or weather rerouting policies.",
      timestamp: '18:40'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');

  const handleSendMessage = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const botResponse = answerFleetCopilotQuery(queryText);

    setMessages(prev => [...prev, userMsg, botResponse]);
    setInputQuery('');
  };

  return (
    <div className="space-y-8 pb-16 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span className="font-semibold text-slate-700">STRUCTURED MARITIME AI COPILOT (ZERO-HALLUCINATION)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            NautiQ Fleet Intelligence Copilot
          </h1>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            Grounded strictly in digital twin physics data, AQPSO optimization logs, and IMO regulatory standards
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-slate-700 font-medium">Deterministic Source Verification</span>
        </div>
      </div>

      {/* Preset Questions Chips */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
        <div className="text-xs text-slate-500 flex items-center space-x-1.5 font-medium">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>Recommended Maritime Operational Inquiries:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {COPILOT_PRESET_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-xs px-3.5 py-1.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-700 transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 min-h-[460px] flex flex-col justify-between">
        <div className="space-y-5 mb-5 overflow-y-auto max-h-[520px] pr-2">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl p-4 rounded-2xl text-xs ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none font-sans shadow-xs'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none font-sans shadow-2xs'
                }`}
              >
                {msg.category && (
                  <div className="flex items-center space-x-2 mb-2 font-mono">
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-semibold">
                      {msg.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>
                )}

                <p className="leading-relaxed text-sm">{msg.text}</p>

                {/* Structured Key Data Points */}
                {msg.dataPoints && msg.dataPoints.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-slate-200/80 text-xs font-mono">
                    {msg.dataPoints.map((dp, i) => (
                      <div key={i} className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-500 block text-[10px]">{dp.label}</span>
                        <span className="text-blue-700 font-bold">{dp.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                  <span className="font-mono text-xs font-bold">OP</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage(inputQuery);
          }}
          className="flex items-center space-x-2 pt-4 border-t border-slate-100"
        >
          <input
            type="text"
            placeholder="Ask NautiQ Copilot about fleet fuel, carbon taxes, speed throttling, or disruptions..."
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            className="flex-1 bg-slate-50 text-slate-900 text-xs px-4 py-3 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:outline-none placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
