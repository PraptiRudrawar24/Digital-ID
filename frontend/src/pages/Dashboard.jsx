import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Layout from '../components/Layout';
import DigitalIDCard from '../components/DigitalIDCard';
import { PlusCircle, RefreshCw, ShieldCheck, Edit3, X, Upload, Rocket, ExternalLink, Trash2, Link as LinkIcon, Plus } from 'lucide-react';

const Dashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const [idCard, setIdCard] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [editData, setEditData] = useState({
    name: '', department: '', phone: '', blood_group: '', address: '', dob: '', photo: '', study_year: ''
  });
  const [newProject, setNewProject] = useState({ title: '', description: '', project_url: '' });
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [idRes, projectsRes] = await Promise.all([
        axios.get('/api/idcards/my-id').catch(() => ({ data: null })),
        axios.get('/api/projects').catch(() => ({ data: [] }))
      ]);
      setIdCard(idRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Set edit data ONLY when modal opens
  const openEditModal = () => {
    if (user) {
      setEditData({
        name: user.name || '',
        department: user.department || '',
        phone: user.phone || '',
        blood_group: user.blood_group || '',
        address: user.address || '',
        dob: user.dob || '',
        photo: user.photo || '',
        study_year: user.study_year || '1st Year'
      });
    }
    setShowEdit(true);
  };

  const generateID = async () => {
    try {
      setLoading(true);
      await axios.post('/api/idcards/generate');
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate ID');
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    setEditData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditData(prev => ({ ...prev, photo: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const res = await axios.put('/api/auth/update', editData);
      setUser(res.data);
      setShowEdit(false);
      fetchDashboardData();
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Update failed');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/projects', newProject);
      setNewProject({ title: '', description: '', project_url: '' });
      setShowAddProject(false);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to add project');
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Remove this project?')) return;
    try {
      await axios.delete(`/api/projects/${id}`);
      fetchDashboardData();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <Layout>
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Dashboard</h1>
          <p className="text-slate-500 text-sm font-bold mt-1 uppercase tracking-widest">Portal & Portfolio</p>
        </div>
        <button 
          onClick={openEditModal}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Edit3 size={18} /> Edit My Info
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section className="flex flex-col items-center">
            {loading ? (
                <div className="w-[420px] h-[240px] bg-white rounded-3xl shadow-xl flex items-center justify-center border border-slate-100">
                  <RefreshCw className="animate-spin text-blue-600" size={40} />
                </div>
            ) : idCard ? (
                <div className="space-y-6 flex flex-col items-center">
                    <div className="p-4 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100">
                        <DigitalIDCard data={idCard} />
                    </div>
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-600 rounded-full border border-green-100">
                        <ShieldCheck size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Identity Secured</span>
                    </div>
                </div>
            ) : (
                <div className="w-full bg-white p-12 rounded-[3rem] border border-slate-100 flex flex-col items-center text-center shadow-xl">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Initialize ID</h3>
                    <p className="text-slate-500 text-sm mt-2 mb-8 font-medium">Your identity card is ready for generation.</p>
                    <button onClick={generateID} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 shadow-lg transition-all">CREATE PASS</button>
                </div>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-xl"><Rocket size={20} /></div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight text-black">Project Portfolio</h2>
                </div>
                <button 
                    onClick={() => setShowAddProject(true)}
                    className="p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-lg flex items-center gap-2 px-4 py-2 font-bold text-xs"
                >
                    <Plus size={16} /> ADD PROJECT
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map(project => (
                    <div key={project.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group relative text-black">
                        <button onClick={() => deleteProject(project.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                        </button>
                        <h3 className="text-lg font-black text-slate-900 mb-2">{project.title}</h3>
                        <p className="text-slate-500 text-xs font-medium mb-6 line-clamp-3 leading-relaxed">{project.description}</p>
                        {project.project_url && (
                            <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-purple-600 font-black text-[10px] uppercase tracking-widest hover:gap-3 transition-all">
                                <LinkIcon size={12} /> View Project <ExternalLink size={10} />
                            </a>
                        )}
                    </div>
                ))}
                {projects.length === 0 && (
                    <div className="col-span-full py-12 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                        <Rocket size={40} strokeWidth={1} className="mb-3" />
                        <p className="font-bold text-sm">No projects added yet.</p>
                    </div>
                )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-2xl">
            <h3 className="font-black text-black text-xl mb-6 flex items-center gap-2 text-black">
              <ShieldCheck className="text-green-600" size={24} />
              Account Info
            </h3>
            <div className="space-y-5">
              <div className="flex justify-between items-center py-4 border-b-2 border-slate-50">
                <span className="text-slate-900 font-black uppercase text-xs tracking-widest">Access Role</span>
                <span className="font-black text-slate-900 px-3 py-1 bg-slate-100 rounded-lg capitalize text-sm">{user?.role || 'Student'}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b-2 border-slate-50">
                <span className="text-slate-900 font-black uppercase text-xs tracking-widest">Study Year</span>
                <span className="font-black text-blue-600 px-3 py-1 bg-blue-50 rounded-lg text-sm">{user?.study_year || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b-2 border-slate-50">
                <span className="text-slate-900 font-black uppercase text-xs tracking-widest text-black">Projects</span>
                <span className="font-black px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-sm">{projects.length} Showcase</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-slate-900 p-8 flex justify-between items-center text-white">
              <h2 className="text-xl font-black tracking-widest uppercase text-white">Edit Student Info</h2>
              <button onClick={() => setShowEdit(false)} className="text-white"><X size={24} /></button>
            </div>
            <form onSubmit={handleUpdate} className="p-10 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                  <input name="name" type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-bold text-slate-800" value={editData.name} onChange={handleEditChange} required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Department</label>
                  <input name="department" type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-bold text-slate-800" value={editData.department} onChange={handleEditChange} required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Date of Birth</label>
                  <input name="dob" type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-bold text-slate-800" value={editData.dob} onChange={handleEditChange} required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Phone</label>
                  <input name="phone" type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-bold text-slate-800" value={editData.phone} onChange={handleEditChange} required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Blood Group</label>
                  <select name="blood_group" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-bold text-slate-800" value={editData.blood_group} onChange={handleEditChange} required>
                    <option value="A+">A+</option><option value="A-">A-</option>
                    <option value="B+">B+</option><option value="B-">B-</option>
                    <option value="O+">O+</option><option value="O-">O-</option>
                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Year of Study</label>
                  <select name="study_year" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-bold text-slate-800" value={editData.study_year} onChange={handleEditChange} required>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Address</label>
                  <textarea name="address" rows="2" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-bold text-slate-800" value={editData.address} onChange={handleEditChange} required></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">New Password (leave blank to keep current)</label>
                  <input name="password" type="password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-bold text-slate-800" value={editData.password || ''} onChange={handleEditChange} placeholder="••••••••" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Passport Photo</label>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-slate-100 rounded-2xl border-2 border-white overflow-hidden flex-shrink-0 shadow-lg">
                      {editData.photo && <img src={editData.photo} className="w-full h-full object-cover" />}
                    </div>
                    <label className="flex-1 cursor-pointer bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 transition-all text-blue-700 font-bold">
                      <Upload size={18} /> Choose New Photo
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                    </label>
                  </div>
                </div>
              </div>
              <button type="submit" disabled={updateLoading} className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-black transition-all disabled:opacity-50 uppercase tracking-widest">
                {updateLoading ? 'Updating...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in">
                <div className="bg-purple-600 p-6 flex justify-between items-center text-white font-['Outfit']">
                    <h2 className="text-xl font-black tracking-tight uppercase text-white">Add Portfolio Project</h2>
                    <button onClick={() => setShowAddProject(false)} className="text-white"><X size={24} /></button>
                </div>
                <form onSubmit={handleAddProject} className="p-8 space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Project Title</label>
                        <input type="text" className="w-full px-4 py-3 bg-slate-50 border-2 border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none font-bold text-slate-800" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} required placeholder="Ex: Smart Campus App" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Brief Description</label>
                        <textarea rows="3" className="w-full px-4 py-3 bg-slate-50 border-2 border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none font-bold text-slate-800" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} placeholder="What did you build?" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Project URL / Link</label>
                        <input type="url" className="w-full px-4 py-3 bg-slate-50 border-2 border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none font-bold text-slate-800" value={newProject.project_url} onChange={e => setNewProject({...newProject, project_url: e.target.value})} placeholder="https://github.com/..." />
                    </div>
                    <button type="submit" className="w-full py-4 bg-purple-600 text-white rounded-2xl font-black shadow-lg uppercase tracking-widest">Add to Portfolio</button>
                </form>
            </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
