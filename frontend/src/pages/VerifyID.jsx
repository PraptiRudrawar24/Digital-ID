import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { ShieldCheck, ShieldAlert, ShieldX, User, Search, RefreshCw, MapPin, Droplet, Phone } from 'lucide-react';

const VerifyID = () => {
  const { uuid: paramUuid } = useParams();
  const [uuid, setUuid] = useState(paramUuid || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (!uuid) return;

    setLoading(true);
    setResult(null);
    setError('');

    try {
      const res = await axios.get(`/api/idcards/verify/${uuid}`);
      setResult(res.data);
    } catch (err) {
      if (err.response?.data?.status) {
        setResult(err.response.data);
      } else {
        setError('Verification system is offline. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paramUuid) handleVerify();
  }, [paramUuid]);

  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Identity Verification</h1>
        <p className="text-gray-400 text-sm font-medium mt-1">Authenticate student credentials securely.</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-10 rounded-[2.5rem] border-2 border-purple-50 shadow-xl shadow-purple-50/50 mb-10">
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-purple-900 uppercase tracking-[0.2em] mb-3 ml-2">Secure Identity UUID</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-400">
                    <Search size={20} />
                  </div>
                  <input 
                    type="text" 
                    className="block w-full pl-12 pr-4 py-4 border-2 border-purple-50 rounded-2xl bg-purple-50/30 focus:ring-4 focus:ring-purple-100 focus:bg-white focus:outline-none transition-all font-bold text-gray-700"
                    placeholder="Scan or paste identity code..."
                    value={uuid}
                    onChange={(e) => setUuid(e.target.value)}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading || !uuid}
                  className="px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-purple-100 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <RefreshCw size={20} className="animate-spin" /> : 'AUTHENTICATE'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {result && (
          <div className={`p-1 bg-white rounded-[3rem] border-2 shadow-2xl overflow-hidden animate-in zoom-in duration-500 ${
            result.status === 'VALID' ? 'border-green-100 shadow-green-100/50' : 'border-red-100 shadow-red-100/50'
          }`}>
            <div className={`px-10 py-8 flex items-center justify-between ${
              result.status === 'VALID' ? 'bg-green-50/50' : 'bg-red-50/50'
            }`}>
              <div className="flex items-center gap-5">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 ${
                  result.status === 'VALID' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  {result.status === 'VALID' ? <ShieldCheck size={32} /> : <ShieldX size={32} />}
                </div>
                <div>
                  <h2 className={`text-3xl font-black uppercase tracking-tighter leading-none ${
                    result.status === 'VALID' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.status}
                  </h2>
                  <p className="text-sm text-gray-500 font-bold mt-1 uppercase tracking-widest">{result.message}</p>
                </div>
              </div>
            </div>

            {result.details && (
              <div className="p-10">
                <div className="flex flex-col md:flex-row gap-10">
                   <div className="w-32 h-32 bg-gray-50 rounded-[2rem] overflow-hidden shrink-0 border-4 border-white shadow-xl ring-1 ring-gray-100">
                      {result.details.photo ? (
                        <img src={result.details.photo} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200"><User size={64} /></div>
                      )}
                   </div>
                   <div className="flex-1">
                      <h3 className="text-2xl font-black text-gray-900 mb-1">{result.details.name}</h3>
                      <div className="flex items-center gap-3 mb-6">
                         <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-black uppercase tracking-wider">{result.details.role}</span>
                         <span className="text-xs font-black text-gray-300 uppercase tracking-widest">#{result.details.id_number}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-1">
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block">PRN (Reg. No.)</span>
                            <span className="text-sm font-black text-indigo-700 font-mono tracking-tighter">{result.details.prn || result.details.id_number}</span>
                         </div>
                         <div className="space-y-1">
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block">Year of Study</span>
                            <span className="text-sm font-bold text-gray-700">{result.details.study_year || 'N/A'}</span>
                         </div>
                         <div className="space-y-1">
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block">Department</span>
                            <span className="text-sm font-bold text-gray-700">{result.details.department}</span>
                         </div>
                         <div className="space-y-1">
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block">Blood Group</span>
                            <div className="flex items-center gap-1.5 font-bold text-red-600">
                               <Droplet size={14} fill="currentColor" /> {result.details.blood_group || 'N/A'}
                            </div>
                         </div>
                         <div className="space-y-1">
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block">Phone</span>
                            <div className="flex items-center gap-1.5 font-bold text-gray-700">
                               <Phone size={14} /> {result.details.phone || 'N/A'}
                            </div>
                         </div>
                         <div className="space-y-1">
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block">Status Date</span>
                            <span className="text-sm font-bold text-gray-700">{new Date().toLocaleDateString()}</span>
                         </div>
                      </div>

                      <div className="mt-8 pt-8 border-t border-gray-50">
                         <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-2">Campus Address</span>
                         <div className="flex gap-2 text-sm text-gray-600 font-medium">
                            <MapPin size={18} className="text-purple-400 shrink-0" />
                            <p>{result.details.address || 'Address not registered'}</p>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-100 text-red-600 px-8 py-5 rounded-3xl flex items-center gap-4 text-sm font-black animate-shake">
            <ShieldAlert size={24} />
            {error}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VerifyID;
