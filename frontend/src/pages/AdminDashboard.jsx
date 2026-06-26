import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Users, Trash2, ShieldX, CheckCircle, Search, Mail, ShieldCheck, UserCheck } from 'lucide-react';

const AdminDashboard = () => {
  const [idCards, setIdCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAllCards = async () => {
    try {
      const res = await axios.get('/api/idcards/all');
      setIdCards(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCards();
  }, []);

  const handleRevoke = async (uuid) => {
    if (!window.confirm('Are you sure you want to revoke this student identity?')) return;
    try {
      await axios.put(`/api/idcards/revoke/${uuid}`);
      fetchAllCards();
    } catch (err) {
      alert('Revocation failed');
    }
  };

  const filteredCards = idCards.filter(card => 
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    card.id_number.includes(searchTerm)
  );

  return (
    <Layout>
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
             <UserCheck className="text-pink-600" size={32} />
             Campus Registry
          </h1>
          <p className="text-gray-400 text-sm font-medium mt-1">Manage and monitor all student digital identities.</p>
        </div>
        <div className="bg-white border-2 border-pink-50 rounded-2xl px-5 py-3 flex items-center gap-4 shadow-sm w-full md:w-96 focus-within:border-pink-200 transition-all">
          <Search size={20} className="text-pink-400" />
          <input 
            type="text" 
            placeholder="Search student or ID number..." 
            className="text-sm outline-none w-full font-bold text-gray-700 placeholder:text-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-pink-50 shadow-xl shadow-pink-50/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gradient-to-r from-pink-600 to-rose-600 text-white font-black uppercase text-[10px] tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">Student Information</th>
                <th className="px-8 py-5">Campus ID</th>
                <th className="px-8 py-5">Enrollment Date</th>
                <th className="px-8 py-5">Security Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {filteredCards.map((card) => (
                <tr key={card.id_uuid} className="hover:bg-pink-50/30 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center font-black">
                        {card.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-gray-800 text-base">{card.name}</span>
                        <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                          <Mail size={12} /> {card.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-mono text-xs font-black bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                      #{card.id_number}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-bold text-gray-500">
                    {new Date(card.issue_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                      card.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${card.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      {card.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    {card.status === 'active' && (
                      <button 
                        onClick={() => handleRevoke(card.id_uuid)}
                        className="p-3 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                        title="Revoke Identity"
                      >
                        <ShieldX size={20} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredCards.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-300">
                      <Users size={48} strokeWidth={1} />
                      <p className="font-black uppercase text-xs tracking-widest">No matching students found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
