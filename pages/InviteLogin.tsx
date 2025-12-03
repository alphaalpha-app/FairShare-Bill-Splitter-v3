import React, { useState } from 'react';
import { AuthService } from '../services/auth';
import { Lock, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

interface InviteLoginProps {
  onLoginSuccess: () => void;
}

export default function InviteLogin({ onLoginSuccess }: InviteLoginProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError('');

    try {
      await AuthService.login(code.trim());
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid invitation code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-blue-600 p-8 text-center">
          <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">FairShare</h1>
          <p className="text-blue-100 text-sm mt-2">Private Bill Splitting</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invitation Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal"
                  placeholder="ENTER-CODE"
                  autoComplete="off"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center animate-fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !code}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-bold shadow-md hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Access App <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-xs text-gray-400">
            A valid invitation code is required to use this application.
          </div>
        </div>
      </div>
    </div>
  );
}