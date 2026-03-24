import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, ArrowRight, Github, Chrome } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    if (!isLogin && !name) return;

    // Simulate login/signup logic
    onLogin({
      name: isLogin ? email.split('@')[0] : name,
      email: email,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.25)] border border-white/40 dark:border-gray-700/50 overflow-hidden transform transition-all animate-modal-pop">
        
        {/* Decorative Background Elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-gray-100/50 hover:bg-gray-200/80 dark:bg-gray-800/50 dark:hover:bg-gray-700/80 rounded-full text-gray-500 dark:text-gray-400 transition-colors z-20"
        >
          <X size={20} />
        </button>

        <div className="p-8 sm:p-10 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-2 tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-3 max-w-[280px] mx-auto leading-relaxed">
              {isLogin ? 'Log in securely to manage your global currency portfolios.' : 'Join CurrencyEx for real-time rates and personalized alerts.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  autoFocus
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-gray-50/80 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white dark:focus:bg-gray-900 transition-all"
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus={isLogin}
                placeholder="Email Address"
                className="w-full bg-gray-50/80 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white dark:focus:bg-gray-900 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-gray-50/80 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white dark:focus:bg-gray-900 transition-all"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-[13px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(37,99,235,0.2)] transition-all active:scale-[0.98]"
            >
              {isLogin ? 'Secure Log In' : 'Create Profile'} <ArrowRight size={18} />
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">OR CONTINUE WITH</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-3 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-bold text-gray-700 dark:text-gray-300 transition-all active:scale-[0.98]">
              <Chrome size={18} /> Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 bg-gray-900 dark:bg-white border-2 border-gray-900 dark:border-white rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-100 text-sm font-bold text-white dark:text-gray-900 transition-all active:scale-[0.98]">
              <Github size={18} /> GitHub
            </button>
          </div>

          <p className="text-center text-xs font-bold text-gray-500 mt-8">
            {isLogin ? "New to CurrencyEx?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1.5 text-blue-600 dark:text-blue-400 font-black hover:underline uppercase tracking-wider text-[11px]"
            >
              {isLogin ? 'Create Account' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
      
      {/* Local styles for nice entrance animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes modal-pop {
          0% { opacity: 0; transform: scale(0.95) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-pop {
          animation: modal-pop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
};

export default AuthModal;
