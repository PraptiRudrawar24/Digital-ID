import { Link } from 'react-router-dom';
import { ShieldCheck, Rocket, Zap, Globe, Github, ExternalLink, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-white text-slate-900 selection:bg-blue-200 font-['Outfit']">
      {/* --- LIGHT UNIQUE BACKGROUND --- */}
      <div className="fixed inset-0 z-0">
        {/* Soft Light Blue & Light Pink Mesh */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(at_0%_0%,#e0f2fe_0px,transparent_50%),radial-gradient(at_100%_0%,#fce7f3_0px,transparent_50%),radial-gradient(at_50%_50%,#fdf2f8_0px,transparent_50%)]" />
        
        {/* Subtle Decorative Blobs */}
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] opacity-40 bg-blue-100 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-pink-100 opacity-40 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="relative z-50 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase text-slate-900">Campus<span className="text-blue-600">Node</span></span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Sign In</Link>
          <Link to="/register" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-black text-sm hover:scale-105 transition-all shadow-lg shadow-blue-200">Get Started</Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 pt-20 pb-32 px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-600/20 rounded-full mb-8">
          <Zap size={14} className="text-blue-600" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Next Gen Student Identity</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-[1000] tracking-tighter leading-[0.9] mb-8 text-slate-900">
          YOUR CAMPUS <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">LEGACY STARTS HERE.</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-slate-600 text-lg md:text-xl font-medium mb-12 leading-relaxed">
          The all-in-one digital identity and project portfolio system for the modern student. Secure your ID, showcase your work, and verify your credentials instantly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/register" className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 text-white">
            CREATE MY IDENTITY
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/verify" className="px-10 py-5 bg-white border-2 border-slate-100 rounded-[2rem] font-black text-lg hover:bg-slate-50 transition-all text-slate-900">
            VERIFY AN ID
          </Link>
        </div>

        {/* --- FEATURE GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
          <FeatureCard 
            icon={<ShieldCheck className="text-blue-600" size={32} />}
            title="Digital ID Card"
            desc="A premium, horizontal identity card with secure QR verification and dynamic status updates."
          />
          <FeatureCard 
            icon={<Rocket className="text-indigo-600" size={32} />}
            title="Project Showcase"
            desc="Host your portfolio directly on your campus profile. Share links to GitHub, Behance, or live URLs."
          />
          <FeatureCard 
            icon={<Globe className="text-pink-600" size={32} />}
            title="Global Access"
            desc="Access your credentials and projects from anywhere. Mobile-ready and lightning fast."
          />
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 border-t border-slate-100 py-12 px-8 text-center bg-white/50 backdrop-blur-md">
        <p className="text-slate-400 text-sm font-bold tracking-widest uppercase">&copy; 2026 CampusNode Digital Network</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] text-left hover:shadow-2xl hover:shadow-blue-100 transition-all hover:-translate-y-2 group shadow-xl">
    <div className="mb-6 p-4 bg-slate-50 rounded-2xl inline-block group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-xl font-black mb-3 text-slate-900 uppercase tracking-tight">{title}</h3>
    <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
  </div>
);

export default Home;
