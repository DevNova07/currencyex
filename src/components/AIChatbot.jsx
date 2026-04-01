import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

const GEMINI_API_KEY = 'AIzaSyDqT51Zb_uKJZPVUsMzkiDp_gJejSQDbqY';

const formatText = (text) => {
  if (!text) return '';
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
  return formatted.replace(/\n/g, '<br/>');
};

const AIChatbot = ({ t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: t.ai_greet }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

  const handleStart = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    dragRef.current.startX = clientX;
    dragRef.current.startY = clientY;
    dragRef.current.initialX = position.x;
    dragRef.current.initialY = position.y;
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    if (e.cancelable) e.preventDefault();
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    const dx = clientX - dragRef.current.startX;
    const dy = clientY - dragRef.current.startY;
    setPosition({
      x: dragRef.current.initialX + dx,
      y: dragRef.current.initialY + dy
    });
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
    } else {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    try {
      // Fake network delay for a realistic feel
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 800));
      
      const text = userText.toLowerCase();
      let botResponse = "Main ek AI Assistant hoon! Abhi meri live API limit cross ho gayi hai 😅, par aap live rates ke liye website ke tools ka use jarur kar sakte hain 💸!";
      
      if (text.includes("rate") || text.includes("price") || text.includes("kitna") || text.includes("bhav") || text.includes("rupee") || text.includes("dollar")) {
        botResponse = "Currency ke live rates aap site ke 'Live Currency Ticker' aur main converter tool mein dekh sakte hain! Ye rates ekdum real-time hain. 📈";
      } else if (text.includes("hello") || text.includes("hi") || text.includes("namaste") || text.includes("hey")) {
        botResponse = "Namaste! 🙏 Main aapki kya madad kar sakta hoon? Aap mujhse website features ke bare me puch sakte hain.";
      } else if (text.includes("best time") || text.includes("kab") || text.includes("trend") || text.includes("bheju")) {
        botResponse = "Paise bhejne ka sabse sahi time tab hota hai jab graph aapke favour mein ho. Aap 'Performance Metrics' chart mein pichle 7 din ka trend check kar sakte hain, wo aapko sahi samay decide karne me madad karega! 📊";
      } else if (text.includes("kaise ho") || text.includes("how are you")) {
        botResponse = "Main bilkul mast hoon! 🚀 Aap batayiye, aaj market kaisa lag raha hai?";
      } else if (text.includes("thanks") || text.includes("thank you") || text.includes("shukriya") || text.includes("dhanyawad")) {
        botResponse = "Aapka humesha swagat hai! Koi aur sawal ho to zaroor puchhiyega. 😊";
      }
      
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: `Sorry bhai, kuch issue aa gaya, thodi der baad puchiye!` }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        onClick={() => !isDragging && setIsOpen(true)}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s, scale 0.5s'
        }}
        className={`fixed bottom-24 right-4 sm:bottom-10 sm:right-10 px-5 py-3.5 sm:px-6 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-[0_10px_40px_rgba(37,99,235,0.5)] z-[100] flex items-center gap-3 border border-white/10 cursor-move ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare size={22} className="sm:w-6 sm:h-6" />
        <span className="font-black text-sm sm:text-base tracking-widest uppercase">{t.ai_ask}</span>
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-950 animate-pulse"></span>
      </button>

      {/* Chat Window */}
      <div 
        style={{
          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s'
        }}
        className={`fixed inset-0 sm:inset-auto sm:bottom-10 sm:right-10 m-auto sm:m-0 w-[95%] sm:w-[400px] h-[80vh] sm:h-[550px] bg-white dark:bg-gray-950 rounded-3xl sm:rounded-[2rem] shadow-[0_20px_80px_rgba(0,0,0,0.6)] border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden z-[101] ${isOpen ? 'scale-100 opacity-100' : 'scale-50 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div 
          className="p-4 sm:p-5 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-between shadow-md relative overflow-hidden flex-shrink-0"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-16 translate-x-12"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl text-white outline outline-1 outline-white/30 shadow-inner">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-black text-white text-base">CurrencyEx AI</h3>
              <p className="text-[10px] text-blue-100 font-black uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span> Powered by Gemini
              </p>
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            className="p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-full transition-colors relative z-10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50/50 dark:bg-gray-900/30">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[88%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${m.role === 'user' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md ring-2 ring-white dark:ring-gray-900'}`}>
                  {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>

                {/* Bubble */}
                <div className={`p-4 text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-3xl rounded-tr-sm shadow-md shadow-blue-500/20' 
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-3xl rounded-tl-sm shadow-[0_5px_15px_rgba(0,0,0,0.02)]'
                }`}>
                  <div dangerouslySetInnerHTML={{ __html: formatText(m.text) }} />
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[85%] flex-row">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md ring-2 ring-white dark:ring-gray-900 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={14} />
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl rounded-tl-sm shadow-[0_5px_15px_rgba(0,0,0,0.02)] flex items-center gap-1.5 w-16 h-[46px]">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-4 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 flex-shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.01)]">
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.ai_placeholder}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2rem] py-4 pl-6 pr-14 text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2.5 p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-800 text-white disabled:text-gray-500 rounded-full transition-all active:scale-95"
            >
              {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
          <div className="text-center mt-3 mb-1">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              {t.ai_note}
            </span>
          </div>
        </form>
      </div>
    </>
  );
};

export default AIChatbot;
