import { QRCodeCanvas } from 'qrcode.react';
import { User, ShieldCheck, Droplet, Phone, MapPin, Calendar, Verified } from 'lucide-react';

const DigitalIDCard = ({ data, id = "id-card-content" }) => {
  if (!data) return null;

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    } catch (e) {
        return date;
    }
  };

  return (
    <div 
      id={id}
      className="relative w-[420px] h-[240px] bg-white rounded-2xl shadow-2xl overflow-hidden flex border-2 border-gray-100 group"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Decorative Background Accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
      <div className="absolute bottom-0 left-10 w-24 h-24 bg-indigo-50 rounded-full -ml-12 -mb-12" />

      {/* Left Vertical Strip - Vibrant Color */}
      <div className="w-12 bg-gradient-to-b from-blue-600 via-indigo-600 to-purple-700 flex flex-col items-center py-4 gap-4 z-10 shadow-lg">
        <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
            <ShieldCheck className="text-white" size={20} />
        </div>
        <div className="flex-1" />
        {data.blood_group && (
            <div className="flex flex-col items-center mb-4 bg-white/10 p-1 rounded-lg backdrop-blur-sm">
                <Droplet className="text-red-300" size={16} fill="currentColor" />
                <span className="text-[10px] text-white font-black">{data.blood_group}</span>
            </div>
        )}
        <span className="text-[9px] text-white/80 font-black -rotate-90 whitespace-nowrap uppercase tracking-[0.2em]">
          {data.role === 'staff' ? 'STAFF PASS' : 'OFFICIAL PASS'}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col z-10">
        {/* Header - Colourful Gradient */}
        <div className="px-6 py-2.5 bg-gradient-to-r from-blue-600/5 to-purple-600/5 border-b border-gray-100 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-[13px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700 uppercase tracking-tight">
              MIT Academy of Engineering
            </h1>
            <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">{data.role === 'staff' ? 'Staff Identity Network' : 'Digital Campus Network'}</span>
          </div>
          <Verified className="text-blue-500" size={16} />
        </div>

        {/* Info Grid */}
        <div className="flex-1 flex p-4 gap-5">
          {/* Photo Section */}
          <div className="flex flex-col gap-3">
                 <div className="w-[100px] h-[100px] bg-white rounded-xl border-2 border-blue-100 overflow-hidden shadow-md relative ring-4
      ring-blue-50/50">
                     {data.photo ? (
                     <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
                     ) : (
                     <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                         <User size={48} />
                     </div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 bg-blue-600/10 h-1" />
                </div>
   
                {/* ENHANCED QR CODE FOR SCANNING */}
                <div className="p-2 bg-white border-2 border-blue-600/20 rounded-xl shadow-lg self-center ring-4 ring-blue-50 transition-all
    hover:scale-110">
                    <QRCodeCanvas
                        value={`${window.location.origin}/verify/${data.id_uuid}`}
                        size={64} // Even bigger for easier scanning
                        level="H" // Highest error correction
                        includeMargin={false}
                    />
                </div>
              </div>

          {/* Details Section */}
          <div className="flex-1 flex flex-col">
            <div className="mb-2">
                <h2 className="text-[17px] font-black text-slate-900 leading-none">
                {data.name}
                </h2>
                <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-md inline-block mt-2">
                {data.role === 'staff' ? 'Staff / Teacher' : 'Student'}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-1">
              <div className="flex flex-col">
                <span className="text-[7px] text-gray-400 font-black uppercase tracking-tighter">PRN (Reg. No.)</span>
                <span className="text-[10px] font-black text-indigo-700 font-mono tracking-tighter">{data.prn || data.id_number}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[7px] text-gray-400 font-black uppercase tracking-tighter">Year of Study</span>
                <span className="text-[10px] font-bold text-gray-700">{data.study_year || 'N/A'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[7px] text-gray-400 font-black uppercase tracking-tighter">Department</span>
                <span className="text-[10px] font-bold text-gray-700 truncate">{data.department || 'General'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[7px] text-gray-400 font-black uppercase tracking-tighter">Birth Date</span>
                <span className="text-[10px] font-bold text-gray-700">{formatDate(data.dob)}</span>
              </div>
            </div>

            <div className="mt-3 bg-gray-50/80 p-2 rounded-xl border border-gray-100">
              <span className="text-[7px] text-gray-400 font-black uppercase flex items-center gap-1 mb-0.5">
                <MapPin size={8} className="text-blue-500" /> Current Address
              </span>
              <p className="text-[8px] text-gray-600 leading-tight line-clamp-2 font-medium">
                {data.address || 'Address information not registered'}
              </p>
            </div>

            <div className="mt-auto flex justify-between items-end border-t border-dashed border-gray-200 pt-1.5">
                <div className="flex flex-col">
                    <span className="text-[6px] text-gray-400 font-black uppercase">Date of Issue</span>
                    <span className="text-[9px] font-bold text-gray-500">{formatDate(data.issue_date)}</span>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-[6px] text-gray-400 font-black uppercase">Security Expiry</span>
                    <span className="text-[9px] font-black text-red-500">{formatDate(data.expiry_date)}</span>
                </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Glossy Overlay Effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/10 to-transparent opacity-50" />
    </div>
  );
};

export default DigitalIDCard;
