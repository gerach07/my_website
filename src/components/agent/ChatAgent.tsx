'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompletion } from '@ai-sdk/react';
import { Activity } from 'lucide-react';
import { useUI } from '@/context/UIContext';

const SUGGESTIONS = [
  "Show me details for Astra Link",
  "Tell me about your experience with Rust.",
  "Are you open to remote work.",
  "How do you handle performance optimization?"
];

export default function ChatAgent() {
  const { openProject } = useUI();
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Use the SDK-provided input instead of separate local state
  const firstChunkReceivedRef = useRef(false);

  type ChatMessage = {
    id: string;
    role: 'user' | 'assistant';
    text: string;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: "SYSTEM ONLINE. I am Adrian's digital proxy. Ask me anything about his technical expertise or experience.",
    },
  ]);

  const [error, setError] = useState<string | null>(null);

  const {
    completion,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useCompletion({
    api: '/api/chat',
    initialInput: '',
    streamProtocol: 'text',
    onFinish: (_prompt, finalCompletion) => {
      if (!finalCompletion) return;
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: finalCompletion,
        },
      ]);
    },
    onError: (err: any) => {
      const msg = err?.message || String(err) || 'AI request failed';
      setError(msg);
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Log when the first streaming chunk arrives so we can measure latency
  useEffect(() => {
    if (completion && !firstChunkReceivedRef.current) {
      try {
        console.log('chat:first-chunk-received', { snippet: String(completion).slice(0, 200), ts: Date.now() });
        console.timeEnd('chat:click-to-first-word');
      } catch (err) {
        console.error('chat:first-chunk-log-error', err);
      }
      firstChunkReceivedRef.current = true;
    }
  }, [completion]);

  // Wrap the SDK-provided handleSubmit so we can clear the input immediately
  // for an optimistic UI and keep focus in the input while the model streams.
  const handleSubmitWithImmediateClear = async (e?: React.FormEvent) => {
    e?.preventDefault();

    // Capture the prompt being sent so timing logs include it
    const promptSnapshot = input;
    console.log('chat:submit-clicked', { promptSnapshot, ts: Date.now() });

    // reset first-chunk flag and start the click->first-word timer
    firstChunkReceivedRef.current = false;
    console.time('chat:click-to-first-word');

    // clear visible input immediately so the UI feels responsive
    handleInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    inputRef.current?.focus();

    try {
      // Call the hook's submit which will drive the streaming response
      await handleSubmit(e as any);
    } catch (err) {
      // Hook's onError will surface errors; keep focus for retry
      console.error('chat:submit-error', err);
      inputRef.current?.focus();
    }
  };

  if (!mounted) return null;

  const handleSuggestion = (content: string) => {
    // Replace the current input with the suggestion
    const e = { target: { value: content } } as React.ChangeEvent<HTMLInputElement>;
    handleInputChange(e);
    inputRef.current?.focus();
  };

  return (
    <section className="relative z-[9999] pointer-events-auto py-24 px-6 lg:px-12 bg-[#121212] border-t border-[#2A2A2A]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase">
            AGENTIC <span className="text-[#00FF41]">ABOUT ME</span>
          </h2>
          <p className="text-gray-400 uppercase tracking-widest text-sm font-mono">Manual Override Logic Active</p>
        </div>

        <div className="brutal-card min-h-[500px] flex flex-col overflow-hidden bg-[#1A1A1A]">
          <div className="p-4 border-b-2 border-[#2A2A2A] bg-[#2A2A2A] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#00FF41] rounded-full animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-tighter uppercase text-white">UPLINK_STABLE</span>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 p-6 overflow-y-auto space-y-6 font-mono text-sm scrollbar-thin scrollbar-thumb-[#2A2A2A]"
          >
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <div key={message.id} className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-4 ${
                      message.role === 'user' 
                        ? 'bg-[#00FF41] text-black font-bold brutal-border' 
                        : 'bg-[#2A2A2A] text-white border-2 border-[#3A3A3A]'
                    }`}>
                      <div className="text-[10px] opacity-50 mb-1 uppercase font-bold">
                        {message.role === 'user' ? 'Inquiry' : 'Representative'}
                      </div>
                      {message.text}
                    </div>
                  </motion.div>
                </div>
              ))}

              {completion && (
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[80%] p-4 bg-[#2A2A2A] text-white border-2 border-[#3A3A3A]">
                      <div className="text-[10px] opacity-50 mb-1 uppercase font-bold">
                        Representative
                      </div>
                      {completion}
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-6 border-t-2 border-[#2A2A2A] space-y-4">
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSuggestion(s)} 
                  className="text-[10px] px-3 py-1 border border-[#3A3A3A] hover:border-[#00FF41] hover:text-[#00FF41] transition-colors uppercase font-bold text-white font-mono"
                >
                  {s}
                </button>
              ))}
            </div>
            {error && (
              <div className="text-sm text-red-400 font-mono mt-2">Error: {error}</div>
            )}
            
            <form
              onSubmit={handleSubmitWithImmediateClear}
              className="flex gap-4 relative z-50"
            >
              <input
                id="chat-input"
                ref={inputRef}
                value={input}
                autoFocus
                onKeyDown={(e) => e.stopPropagation()} // Stop 3D canvas interference
                onChange={handleInputChange}
                placeholder={isLoading ? 'Sending...' : 'TYPE YOUR INQUIRY...'}
                className="flex-1 bg-transparent border-2 border-[#2A2A2A] p-4 font-mono text-sm focus:outline-none focus:border-[#00FF41] transition-colors uppercase text-white relative z-[9999] pointer-events-auto select-text"
                autoComplete="off"
              />

              {/* Clear button and Send button */}
              <div className="flex items-center gap-2">
                {input?.trim() && (
                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
                      inputRef.current?.focus();
                    }}
                    className="px-3 py-2 border border-[#3A3A3A] text-sm text-white"
                  >
                    Clear
                  </button>
                )}

                <button 
                  type="submit"
                  disabled={isLoading || !input?.trim()}
                  className="px-8 bg-[#00FF41] text-black font-bold brutal-border hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform disabled:opacity-50 uppercase relative z-[9999] pointer-events-auto"
                >
                  {isLoading ? 'Sending...' : 'SEND'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
