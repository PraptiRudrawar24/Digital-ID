import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { User, Mail, Lock, Building, Camera, Calendar, Phone, Droplet, MapPin, Upload } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    photo: '',
    dob: '',
    phone: '',
    blood_group: '',
    address: '',
    prn: '',
    study_year: '1st Year',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-blue-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
             <User className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Join Your Campus</h2>
          <p className="mt-2 text-sm text-gray-500 font-medium italic">Create your unique digital identity</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 font-bold">{error}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-blue-900 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400">
                  <User size={18} />
                </div>
                <input name="name" type="text" required className="block w-full pl-10 pr-3 py-3 border border-blue-100 rounded-2xl bg-blue-50/30 focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all" placeholder="Enter Full Name" value={formData.name} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-blue-900 uppercase tracking-widest mb-1.5 ml-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400">
                  <Mail size={18} />
                </div>
                <input name="email" type="email" required className="block w-full pl-10 pr-3 py-3 border border-blue-100 rounded-2xl bg-blue-50/30 focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all" placeholder="email@college.edu" value={formData.email} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-blue-900 uppercase tracking-widest mb-1.5 ml-1">PRN (Permanent Reg. No.)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400">
                  <User size={18} />
                </div>
                <input name="prn" type="text" required className="block w-full pl-10 pr-3 py-3 border border-blue-100 rounded-2xl bg-blue-50/30 focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all" placeholder="Ex: 202501120003" value={formData.prn} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-blue-900 uppercase tracking-widest mb-1.5 ml-1">Join As</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400">
                  <User size={18} />
                </div>
                <select name="role" required className="block w-full pl-10 pr-3 py-3 border border-blue-100 rounded-2xl bg-blue-50/30 focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all" value={formData.role} onChange={handleChange}>
                  <option value="student">Student</option>
                  <option value="staff">Teacher / Staff</option>
                </select>
              </div>
            </div>

            {formData.role === 'student' && (
              <div>
                <label className="block text-xs font-bold text-blue-900 uppercase tracking-widest mb-1.5 ml-1">Year of Study</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400">
                    <Calendar size={18} />
                  </div>
                  <select name="study_year" required className="block w-full pl-10 pr-3 py-3 border border-blue-100 rounded-2xl bg-blue-50/30 focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all" value={formData.study_year} onChange={handleChange}>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-blue-900 uppercase tracking-widest mb-1.5 ml-1">Department</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400">
                  <Building size={18} />
                </div>
                <input name="department" type="text" required className="block w-full pl-10 pr-3 py-3 border border-blue-100 rounded-2xl bg-blue-50/30 focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all" placeholder="Ex: Computer Science" value={formData.department} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-blue-900 uppercase tracking-widest mb-1.5 ml-1">Date of Birth</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400">
                  <Calendar size={18} />
                </div>
                <input name="dob" type="date" required className="block w-full pl-10 pr-3 py-3 border border-blue-100 rounded-2xl bg-blue-50/30 focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all" value={formData.dob} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-blue-900 uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400">
                  <Phone size={18} />
                </div>
                <input name="phone" type="text" required className="block w-full pl-10 pr-3 py-3 border border-blue-100 rounded-2xl bg-blue-50/30 focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-blue-900 uppercase tracking-widest mb-1.5 ml-1">Blood Group</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400">
                  <Droplet size={18} />
                </div>
                <select name="blood_group" required className="block w-full pl-10 pr-3 py-3 border border-blue-100 rounded-2xl bg-blue-50/30 focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all" value={formData.blood_group} onChange={handleChange}>
                  <option value="">Choose...</option>
                  <option value="A+">A+</option><option value="A-">A-</option>
                  <option value="B+">B+</option><option value="B-">B-</option>
                  <option value="O+">O+</option><option value="O-">O-</option>
                  <option value="AB+">AB+</option><option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-blue-900 uppercase tracking-widest mb-1.5 ml-1">Residential Address</label>
              <div className="relative">
                <div className="absolute top-3 left-3 text-blue-400">
                  <MapPin size={18} />
                </div>
                <textarea name="address" required rows="2" className="block w-full pl-10 pr-3 py-3 border border-blue-100 rounded-2xl bg-blue-50/30 focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all" placeholder="Enter complete home address" value={formData.address} onChange={handleChange}></textarea>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-blue-900 uppercase tracking-widest mb-1.5 ml-1">Profile Photo</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl border-2 border-dashed border-blue-200 flex items-center justify-center overflow-hidden shrink-0">
                  {formData.photo ? <img src={formData.photo} className="w-full h-full object-cover" /> : <Camera className="text-blue-300" size={24} />}
                </div>
                <label className="flex-1 cursor-pointer bg-blue-50 border border-blue-100 hover:bg-blue-100 p-4 rounded-2xl flex items-center justify-center gap-2 transition-all group">
                  <Upload size={18} className="text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold text-blue-700">Choose Campus Photo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-blue-900 uppercase tracking-widest mb-1.5 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400">
                  <Lock size={18} />
                </div>
                <input name="password" type="password" required className="block w-full pl-10 pr-3 py-3 border border-blue-100 rounded-2xl bg-blue-50/30 focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all" placeholder="Create a secure password" value={formData.password} onChange={handleChange} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full flex justify-center py-4 border border-transparent text-sm font-black rounded-2xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-200 focus:outline-none transform hover:-translate-y-0.5 transition-all disabled:opacity-70">
            {loading ? 'Creating Your ID...' : 'REGISTER & GENERATE ID'}
          </button>
        </form>

        <div className="text-center text-sm font-medium">
          <span className="text-gray-400">Already a member? </span>
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-black decoration-2 underline-offset-4">Log In Here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
