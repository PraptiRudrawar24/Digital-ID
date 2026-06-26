import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 h-16 flex items-center px-6 justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-college-blue rounded-lg flex items-center justify-center text-white font-bold">ID</div>
        <span className="font-semibold text-lg text-gray-800 tracking-tight">CollegeID System</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User size={16} />
          <span>{user?.name}</span>
          <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs uppercase font-medium">{user?.role}</span>
        </div>
        <button 
          onClick={handleLogout} 
          className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
