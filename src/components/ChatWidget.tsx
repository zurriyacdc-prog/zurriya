'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

type Msg = { role: 'user' | 'assistant'; content: string };

function MsgContent({ text, isUser }: { text: string; isUser: boolean }) {
  const MD_LINK = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  let m: RegExpExecArray | null;
  MD_LINK.lastIndex = 0;
  while ((m = MD_LINK.exec(text)) !== null) {
    if (m.index > cursor) parts.push(<span key={cursor}>{text.slice(cursor, m.index)}</span>);
    const isWA = m[2]!.includes('wa.me');
    parts.push(
      <a key={m.index} href={m[2]} target="_blank" rel="noopener noreferrer"
        className={`underline font-semibold ${isUser ? 'text-white/90' : isWA ? 'text-[#25D366]' : 'text-teal'}`}>
        {m[1]}
      </a>
    );
    cursor = m.index + m[0].length;
  }
  if (cursor < text.length) parts.push(<span key={cursor}>{text.slice(cursor)}</span>);
  return <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{parts}</span>;
}

const SUGGESTED: Record<string, string[]> = {
  ar: [
    'ما هي الخدمات التي تقدمها ذرية؟',
    'كيف يتم التسجيل في المركز؟',
    'ما هي علامات التوحد المبكرة؟',
    'ما الفرق بين تأخر اللغة واضطرابها؟',
  ],
  en: [
    'What services does Zurriya offer?',
    'How do I register my child?',
    'What are early signs of autism?',
    'What is ABA therapy?',
  ],
};

export function ChatWidget({ locale }: { locale: string }) {
  const isAr = locale === 'ar';
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggested, setShowSuggested] = useState(true);
  const [hint, setHint] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('noor_hint_seen')) {
      const t = setTimeout(() => setHint(true), 3500);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (!hint) return;
    const t = setTimeout(() => {
      setHint(false);
      localStorage.setItem('noor_hint_seen', '1');
    }, 8000);
    return () => clearTimeout(t);
  }, [hint]);

  const dismissHint = () => {
    setHint(false);
    localStorage.setItem('noor_hint_seen', '1');
  };

  const welcome: Msg = {
    role: 'assistant',
    content: isAr
      ? 'مرحباً! أنا نور، مساعدتك الافتراضية في ذرية 🌿\n\nيسعدني مساعدتك في فهم خدماتنا، مراحل نمو طفلك، أو كيفية التسجيل. كيف يمكنني مساعدتك اليوم؟'
      : "Hi! I'm Noor, your virtual assistant at Zurriya 🌿\n\nI'm here to help you understand our services, your child's development, or how to get started. What can I help you with today?",
  };

  useEffect(() => {
    if (open && msgs.length === 0) setMsgs([welcome]);
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]); // eslint-disable-line

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, loading]);

  const send = useCallback(async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput('');
    setShowSuggested(false);

    const history: Msg[] = [...msgs, { role: 'user', content }];
    setMsgs(history);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok) throw new Error('api');
      const { content: reply } = await res.json() as { content: string };
      setMsgs(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMsgs(prev => [...prev, {
        role: 'assistant',
        content: isAr
          ? 'عذراً، حدث خطأ مؤقت. يمكنك التواصل معنا مباشرةً عبر واتساب: +20 104 158 2668'
          : 'Sorry, something went wrong. You can reach us directly on WhatsApp: +20 104 158 2668',
      }]);
    }
    setLoading(false);
  }, [input, loading, msgs, isAr]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const suggestions = SUGGESTED[locale] ?? SUGGESTED.en;

  return (
    <>
      {/* ── Chat window ───────────────────────────────────── */}
      {open && (
        <div
          className={`fixed z-50 flex flex-col bg-white rounded-2xl overflow-hidden
            shadow-[0_8px_48px_rgba(0,0,0,0.18)] border border-border
            bottom-[88px] start-4
            w-[360px] max-w-[calc(100vw-32px)]
            sm:w-[380px]`}
          style={{ height: 'min(520px, calc(100vh - 110px))' }}
          dir={isAr ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="bg-teal flex items-center gap-3 px-4 py-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-base" style={{ fontFamily: 'Cairo, Arial, sans-serif' }}>ن</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-tight">{isAr ? 'نور — ذرية' : 'Noor — Zurriya'}</p>
              <p className="text-white/60 text-xs mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                {isAr ? 'متاح الآن' : 'Online now'}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
              aria-label="Close chat"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ background: '#F7F4F0' }}>
            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-2 items-end ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-teal flex-shrink-0 flex items-center justify-center mb-0.5">
                    <span className="text-white text-xs font-bold" style={{ fontFamily: 'Cairo, Arial, sans-serif' }}>ن</span>
                  </div>
                )}
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-teal text-white rounded-2xl rounded-ee-[4px]'
                      : 'bg-white text-ink rounded-2xl rounded-es-[4px] shadow-sm border border-border/40'
                  }`}
                >
                  <MsgContent text={m.content} isUser={m.role === 'user'} />
                </div>
              </div>
            ))}

            {/* Suggested questions (only after welcome, before first user msg) */}
            {showSuggested && msgs.length === 1 && (
              <div className="flex flex-col gap-1.5 mt-1">
                {suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-start text-xs text-teal border border-teal/30 bg-teal-pale/60 rounded-xl px-3 py-2 hover:bg-teal-pale hover:border-teal/60 transition-colors leading-snug"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2 items-end justify-start">
                <div className="w-7 h-7 rounded-full bg-teal flex-shrink-0 flex items-center justify-center">
                  <span className="text-white text-xs font-bold" style={{ fontFamily: 'Cairo, Arial, sans-serif' }}>ن</span>
                </div>
                <div className="bg-white border border-border/40 shadow-sm rounded-2xl rounded-es-[4px] px-4 py-3.5 flex gap-1.5 items-center">
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full bg-teal/50 animate-bounce"
                      style={{ animationDelay: `${i * 0.18}s`, animationDuration: '0.9s' }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex-shrink-0 bg-white border-t border-border/60 px-3 py-2.5 flex items-end gap-2">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder={isAr ? 'اكتب رسالتك...' : 'Type a message...'}
              className="flex-1 resize-none border border-border rounded-xl px-3 py-2 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-teal/25 focus:border-teal transition-colors leading-relaxed"
              style={{ maxHeight: '96px', direction: isAr ? 'rtl' : 'ltr' }}
              onInput={e => {
                const el = e.currentTarget;
                el.style.height = 'auto';
                el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
              }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="flex-shrink-0 w-9 h-9 rounded-full bg-teal text-white flex items-center justify-center hover:bg-teal-dark transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
              aria-label={isAr ? 'إرسال' : 'Send'}
            >
              <svg
                width="16" height="16" fill="currentColor" viewBox="0 0 24 24"
                className={isAr ? 'rotate-180' : ''}
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>

          {/* Footer branding */}
          <div className="flex-shrink-0 bg-white border-t border-border/40 py-1.5 text-center">
            <p className="text-[10px] text-ink-2/40">
              {isAr ? 'مدعوم بالذكاء الاصطناعي · ذرية' : 'Powered by AI · Zurriya'}
            </p>
          </div>
        </div>
      )}

      {/* ── Hint tooltip ─────────────────────────────────── */}
      {hint && !open && (
        <div
          dir={isAr ? 'rtl' : 'ltr'}
          className="fixed bottom-24 start-4 z-50 bg-white rounded-2xl shadow-lg border border-border px-4 py-3 w-[220px] cursor-pointer"
          onClick={() => { dismissHint(); setOpen(true); }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); dismissHint(); }}
            className="absolute top-2 end-2 text-ink-2/40 hover:text-ink-2/70 transition-colors"
            aria-label="Dismiss"
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/>
            </svg>
          </button>
          <p className="text-sm font-semibold text-ink pe-4">{isAr ? 'مرحباً! 👋' : 'Hi there! 👋'}</p>
          <p className="text-xs text-ink-2 mt-1 leading-snug">
            {isAr ? 'لديك أسئلة عن خدماتنا؟ تحدث مع نور!' : 'Questions about our services? Chat with Noor!'}
          </p>
          {/* Tail */}
          <div className="absolute -bottom-[7px] start-5 w-3.5 h-3.5 bg-white border-b border-e border-border rotate-45" />
        </div>
      )}

      {/* ── Toggle button ────────────────────────────────── */}
      <button
        onClick={() => { setOpen(o => !o); dismissHint(); }}
        aria-label={isAr ? 'افتح المحادثة' : 'Open chat'}
        className="fixed bottom-6 start-6 z-50 w-14 h-14 rounded-full bg-teal text-white
          shadow-lg shadow-teal/30 hover:bg-teal-dark active:scale-95 transition-all
          flex items-center justify-center"
      >
        {open ? (
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg width="26" height="26" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
          </svg>
        )}

        {/* Unread dot — visible only when chat is closed */}
        {!open && (
          <span className="absolute top-0 end-0 w-3.5 h-3.5 rounded-full bg-coral border-2 border-white animate-pulse" />
        )}
      </button>
    </>
  );
}
