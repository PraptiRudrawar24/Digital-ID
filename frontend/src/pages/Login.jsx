import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Mail, Lock, LogIn, ShieldAlert } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl mb-6 shadow-lg rotate-3">
            ID
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-500 font-bold uppercase tracking-widest">
            Sign in to access your portal
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold animate-shake">
            <ShieldAlert size={18} /> {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
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
              <div className="flex justify-end mt-2">
                <Link to="/forgot-password" className="text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest">
                  Forgot Password?
                </Link>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all disabled:opacity-70 uppercase tracking-widest"
          >
            {loading ? 'Verifying...' : (
              <span className="flex items-center gap-2">
                <LogIn size={20} />
                Sign in to Portal
              </span>
            )}
          </button>
        </form>
        
        <div className="text-center pt-4">
          <span className="text-slate-400 text-sm font-bold">New student? </span>
          <Link to="/register" className="font-black text-blue-600 hover:underline underline-offset-8 decoration-2 uppercase text-sm tracking-widest">
            Create Identity
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
