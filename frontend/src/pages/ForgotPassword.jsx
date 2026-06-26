import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, ArrowLeft, ShieldCheck, ShieldAlert, Key } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      setMessage(res.data.message);
      if (res.data.resetToken) {
        setResetToken(res.data.resetToken);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg rotate-3">
            <Key size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Reset Password</h2>
          <p className="mt-2 text-sm text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
            Enter your email to receive a reset link
          </p>
        </div>

        {message && (
          <div className="bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold animate-in fade-in">
            <ShieldCheck size={18} /> {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold animate-shake">
            <ShieldAlert size={18} /> {error}
          </div>
        )}

        {resetToken ? (
          <div className="mt-8 p-6 bg-blue-50 rounded-2xl border-2 border-dashed border-blue-200">
            <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4 text-center">Development Mode: Reset Link Generated</p>
            <Link 
              to={`/reset-password/${resetToken}`}
              className="w-full flex justify-center py-4 px-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all uppercase tracking-widest text-xs"
            >
              Click here to Reset Password
            </Link>
            <p className="mt-4 text-[10px] text-blue-400 font-bold text-center leading-tight">
              In a production environment, this link would be sent securely to your email address.
            </p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-12 pr-4 py-4 border-2 border-slate-50 rounded-2xl bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                  placeholder="name@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all disabled:opacity-70 uppercase tracking-widest"
            >
              {loading ? 'Processing...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="text-center pt-4">
          <Link to="/login" className="inline-flex items-center gap-2 font-black text-slate-400 hover:text-blue-600 transition-colors uppercase text-xs tracking-widest">
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
