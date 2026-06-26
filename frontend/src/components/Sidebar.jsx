import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CreditCard, ShieldCheck, Users } from 'lucide-react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label, activeColor }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-black transition-all duration-300 ${
        isActive(to)
          ? `${activeColor} text-white shadow-lg shadow-blue-200 scale-[1.02]`
          : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
      }`}
    >
      <Icon size={20} className={isActive(to) ? 'text-white' : 'text-blue-400'} />
      {label}
    </Link>
  );

  return (
    <aside className="w-64 bg-white border-r border-blue-50 h-[calc(100vh-64px)] fixed left-0 top-16 p-6 flex flex-col gap-3 z-10 shadow-sm">
      <NavItem to="/dashboard" icon={LayoutDashboard} label="Student Portal" activeColor="bg-gradient-to-r from-blue-600 to-indigo-600" />
      <NavItem to="/verify" icon={ShieldCheck} label="Identity Verification" activeColor="bg-gradient-to-r from-purple-600 to-indigo-600" />
      
      {user?.role === 'admin' && (
        <div className="mt-8">
          <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Administration</p>
          <NavItem to="/admin" icon={Users} label="Campus Registry" activeColor="bg-gradient-to-r from-pink-600 to-rose-600" />
        </div>
      )}

      <div className="mt-auto p-4 bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-3xl border border-blue-100">
          <p className="text-[10px] font-black text-blue-800 uppercase mb-1">Status</p>
          <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-blue-600 capitalize">{user?.role} Access</span>
          </div>
      </div>
    </aside>
  );
};

export default Sidebar;
