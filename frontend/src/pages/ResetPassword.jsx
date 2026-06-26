import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, ArrowLeft, ShieldCheck, ShieldAlert, KeyRound } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setMessage('');
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/reset-password', { token, newPassword: password });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg rotate-3">
            <KeyRound size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Set New Password</h2>
          <p className="mt-2 text-sm text-slate-500 font-bold uppercase tracking-widest">
            Create a strong, secure password
          </p>
        </div>

        {message && (
          <div className="bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold animate-in fade-in">
            <ShieldCheck size={18} /> {message} Redirecting to login...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold animate-shake">
            <ShieldAlert size={18} /> {error}
          </div>
        )}

        {!message && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-12 pr-4 py-4 border-2 border-slate-50 rounded-2xl bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Confirm New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-12 pr-4 py-4 border-2 border-slate-50 rounded-2xl bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all disabled:opacity-70 uppercase tracking-widest"
            >
              {loading ? 'Updating...' : 'Update Password'}
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

export default ResetPassword;
