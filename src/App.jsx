import React, { useState, useRef } from 'react';
import { 
  MonitorPlay, LayoutDashboard, UploadCloud, Users, Settings, 
  LogOut, FileText, Calendar, User, Search, Plus, 
  ChevronLeft, ChevronRight, Maximize, X, Trash2, Edit3, 
  CheckCircle2, AlertCircle, PlaySquare
} from 'lucide-react';

// --- KOMPONEN UTAMA (APP) ---
export default function App() {
  const [currentView, setCurrentView] = useState('login'); // login, dashboard, upload, viewer
  const [currentUser, setCurrentUser] = useState(null); // { name, role: 'admin' | 'guru' }
  const [selectedReport, setSelectedReport] = useState(null);

  // Data Mock Laporan
  const [reports, setReports] = useState([
    {
      id: 1,
      week: 12,
      date: '2026-03-02',
      teacher: 'Cikgu Ahmad bin Daud',
      summary: 'Perhimpunan berjalan lancar. Penyampaian sijil sukan MSSD.',
      filename: 'Laporan_Minggu_12.pptx',
      size: '2.4 MB',
      uploadDate: '2026-03-02T08:30:00',
    },
    {
      id: 2,
      week: 11,
      date: '2026-02-23',
      teacher: 'Cikgu Siti Aminah',
      summary: 'Taklimat disiplin oleh PK HEM. Kehadiran murid memuaskan.',
      filename: 'Laporan_Minggu_11.pptx',
      size: '1.8 MB',
      uploadDate: '2026-02-23T10:15:00',
    }
  ]);

  // Fungsi Navigasi & Tindakan
  const handleLogin = (role) => {
    setCurrentUser({
      name: role === 'admin' ? 'Pentadbir Sistem' : 'Cikgu Ahmad bin Daud',
      role: role
    });
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
  };

  const viewReport = (report) => {
    setSelectedReport(report);
    setCurrentView('viewer');
  };

  const deleteReport = (id) => {
    if(window.confirm('Adakah anda pasti mahu memadam laporan ini?')) {
      setReports(reports.filter(r => r.id !== id));
    }
  };

  // --- PAPARAN LOG MASUK ---
  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-700 p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner p-2">
              <img 
                src="/logo-smk.png" 
                alt="Logo SMK Dato Onn" 
                className="w-full h-full object-contain"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://api.iconify.design/lucide:school.svg?color=%231e3a8a" }}
              />
            </div>
            <h1 className="text-2xl font-bold text-white">e-Perhimpunan</h1>
            <p className="text-blue-100 mt-2 text-sm">Sistem Laporan Perhimpunan Mingguan Sekolah</p>
          </div>
          <div className="p-8 space-y-4">
            <button 
              onClick={() => handleLogin('guru')}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-all"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Log Masuk sebagai Guru
            </button>
            <button 
              onClick={() => handleLogin('admin')}
              className="w-full flex items-center justify-center gap-3 bg-blue-50 text-blue-700 font-semibold py-3 px-4 rounded-xl hover:bg-blue-100 transition-all"
            >
              <Users className="w-5 h-5" />
              Log Masuk sebagai Admin
            </button>
            <p className="text-center text-xs text-slate-400 mt-6">
              Sistem ini dikhaskan untuk kegunaan warga sekolah sahaja.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN LAYOUT (SIDEBAR + CONTENT) ---
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm hidden md:flex z-10">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 shrink-0">
            <img 
              src="/logo-smk.png" 
              alt="Logo Sekolah" 
              className="w-full h-full object-contain drop-shadow-sm"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://api.iconify.design/lucide:school.svg?color=%231e3a8a" }}
            />
          </div>
          <div>
            <h2 className="font-bold text-blue-900 leading-tight">e-Perhimpunan</h2>
            <p className="text-xs text-slate-500">SMK Dato' Onn, Batu Pahat</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <SidebarItem icon={<LayoutDashboard />} label="Papan Pemuka" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
          <SidebarItem icon={<UploadCloud />} label="Muat Naik Laporan" active={currentView === 'upload'} onClick={() => setCurrentView('upload')} />
          {currentUser?.role === 'admin' && (
            <SidebarItem icon={<Users />} label="Senarai Guru" active={false} onClick={() => {}} />
          )}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              {currentUser?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-800 truncate">{currentUser?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{currentUser?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-600 p-2 w-full rounded-lg transition-colors text-sm font-medium">
            <LogOut className="w-4 h-4" /> Log Keluar
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm">
           <div className="flex items-center gap-2">
            <img 
              src="/logo-smk.png" 
              alt="Logo" 
              className="w-8 h-8 object-contain"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://api.iconify.design/lucide:school.svg?color=%231e3a8a" }}
            />
            <h2 className="font-bold text-blue-900">e-Perhimpunan</h2>
          </div>
          <button onClick={handleLogout} className="text-slate-500">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {/* Dynamic View */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {currentView === 'dashboard' && (
            <Dashboard 
              reports={reports} 
              currentUser={currentUser} 
              onView={viewReport} 
              onDelete={deleteReport} 
              onAddNew={() => setCurrentView('upload')}
            />
          )}
          {currentView === 'upload' && (
            <UploadForm 
              onCancel={() => setCurrentView('dashboard')} 
              onSuccess={(newReport) => {
                setReports([newReport, ...reports]);
                setCurrentView('dashboard');
              }}
              currentUser={currentUser}
            />
          )}
          {currentView === 'viewer' && selectedReport && (
            <PresentationViewer 
              report={selectedReport} 
              onClose={() => setCurrentView('dashboard')} 
            />
          )}
        </div>
      </main>
    </div>
  );
}

// --- KOMPONEN BANTUAN ---

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
        active 
        ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm border border-blue-100' 
        : 'text-slate-600 hover:bg-slate-100 font-medium'
      }`}
    >
      {React.cloneElement(icon, { className: `w-5 h-5 ${active ? 'text-blue-600' : 'text-slate-400'}` })}
      {label}
    </button>
  );
}

// --- PAPARAN: DASHBOARD ---
function Dashboard({ reports, currentUser, onView, onDelete, onAddNew }) {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Papan Pemuka</h1>
          <p className="text-slate-500 mt-1">Selamat kembali, {currentUser?.name}. Berikut adalah ringkasan laporan.</p>
        </div>
        <button 
          onClick={onAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-md shadow-blue-200 font-medium flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" /> Tambah Laporan
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <StatCard icon={<FileText />} title="Jumlah Laporan" value={reports.length.toString()} color="blue" />
        <StatCard icon={<Calendar />} title="Laporan Bulan Ini" value="2" color="indigo" />
        <StatCard icon={<CheckCircle2 />} title="Status Sistem" value="Aktif" color="emerald" />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-bold text-slate-800 text-lg">Senarai Laporan Mingguan</h2>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Cari minggu/guru..." 
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-medium">Minggu / Tarikh</th>
                <th className="p-4 font-medium">Guru Bertugas</th>
                <th className="p-4 font-medium">Fail PPTX</th>
                <th className="p-4 font-medium text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-4">
                    <div className="font-semibold text-slate-800">Minggu {report.week}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{report.date}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {report.teacher.charAt(0)}
                      </div>
                      {report.teacher}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                        <PlaySquare className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-700">{report.filename}</div>
                        <div className="text-xs text-slate-400">{report.size}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onView(report)}
                        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors tooltip"
                        title="Buka Presentation"
                      >
                        <MonitorPlay className="w-4 h-4" />
                      </button>
                      {(currentUser?.role === 'admin' || currentUser?.name === report.teacher) && (
                        <>
                          <button className="p-2 text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => onDelete(report.id)}
                            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    Belum ada laporan dimuat naik.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
      <div className={`p-4 rounded-xl ${colorStyles[color]}`}>
        {React.cloneElement(icon, { className: 'w-6 h-6' })}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

// --- PAPARAN: MUAT NAIK ---
function UploadForm({ onCancel, onSuccess, currentUser }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    week: '',
    date: new Date().toISOString().split('T')[0],
    summary: ''
  });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (selectedFile.name.endsWith('.ppt') || selectedFile.name.endsWith('.pptx')) {
      setFile(selectedFile);
    } else {
      alert("Sila muat naik fail berformat PowerPoint (.ppt atau .pptx) sahaja.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Sila muat naik fail PowerPoint terlebih dahulu.");
      return;
    }
    
    // Simulasi simpan ke pangkalan data
    const newReport = {
      id: Date.now(),
      week: formData.week,
      date: formData.date,
      teacher: currentUser.name,
      summary: formData.summary,
      filename: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      uploadDate: new Date().toISOString(),
    };
    
    onSuccess(newReport);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 animate-in zoom-in-95 duration-300">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Muat Naik Laporan Mingguan</h2>
        <p className="text-slate-500 mt-1">Lengkapkan maklumat di bawah dan sertakan fail pembentangan anda.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Minggu Ke</label>
            <input 
              type="number" 
              required
              min="1" max="52"
              value={formData.week}
              onChange={(e) => setFormData({...formData, week: e.target.value})}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              placeholder="Contoh: 12"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Tarikh Perhimpunan</label>
            <input 
              type="date" 
              required
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Ringkasan Laporan</label>
          <textarea 
            required
            rows="3"
            value={formData.summary}
            onChange={(e) => setFormData({...formData, summary: e.target.value})}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
            placeholder="Tuliskan ringkasan aktiviti perhimpunan..."
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Fail PowerPoint (.ppt, .pptx)</label>
          
          <div 
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-orange-100 rounded-full">
                  <PlaySquare className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / (1024*1024)).toFixed(2)} MB</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setFile(null)}
                  className="mt-2 text-sm text-red-500 hover:text-red-700 font-medium"
                >
                  Buang Fail
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <UploadCloud className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-slate-600 font-medium">Tarik & Letak fail anda di sini</p>
                <p className="text-xs text-slate-400 mb-4">Maksimum saiz: 50MB</p>
                <label className="bg-white border border-slate-200 shadow-sm text-slate-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors font-medium text-sm">
                  Pilih Fail
                  <input 
                    type="file" 
                    accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" 
                    className="hidden" 
                    onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl shadow-md shadow-blue-200 font-medium transition-all active:scale-95"
          >
            Simpan Laporan
          </button>
        </div>
      </form>
    </div>
  );
}

// --- PAPARAN: VIEWER PRESENTATION ---
// Menggunakan simulasi UI Viewer memandangkan fail local tidak boleh dibaca terus oleh iframe Google/Microsoft Office.
function PresentationViewer({ report, onClose }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 5; // Simulasi jumlah slide
  const viewerRef = useRef(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, totalSlides));
  const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 1, 1));

  return (
    <div className="absolute inset-0 bg-slate-900/95 z-50 flex flex-col backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* Top Bar Viewer */}
      <div className="flex justify-between items-center p-4 bg-slate-900 text-white border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500 rounded text-white">
            <PlaySquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm md:text-base leading-tight">{report.filename}</h3>
            <p className="text-xs text-slate-400">Dimuat naik oleh {report.teacher} • Minggu {report.week}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleFullscreen} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-white" title="Penuh Skrin">
            <Maximize className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-slate-700 mx-2"></div>
          <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-red-600 rounded-lg transition-colors text-slate-300 hover:text-white" title="Tutup">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Slide Area */}
      <div ref={viewerRef} className="flex-1 relative flex items-center justify-center p-4 md:p-8 overflow-hidden bg-slate-950">
        
        {/* Simulated Slide Canvas */}
        <div className="w-full max-w-5xl aspect-video bg-white rounded shadow-2xl relative flex flex-col overflow-hidden transition-all duration-500 ease-in-out transform">
          
          {/* Simulasi Kandungan Slide berdasarkan nombor slide */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-blue-50 to-white">
            {currentSlide === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-4xl md:text-6xl font-extrabold text-blue-900 mb-4 tracking-tight">Laporan Perhimpunan</h1>
                <h2 className="text-2xl text-slate-600 mb-8 font-medium">Minggu {report.week}</h2>
                <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full mb-8"></div>
                <p className="text-lg text-slate-800 font-semibold">{report.teacher}</p>
                <p className="text-slate-500">{report.date}</p>
              </div>
            )}
            {currentSlide > 1 && currentSlide < totalSlides && (
              <div className="w-full h-full flex flex-col text-left animate-in fade-in duration-500">
                <h2 className="text-3xl font-bold text-blue-800 mb-6 border-b-2 border-blue-100 pb-4">Ringkasan Aktiviti - Bahagian {currentSlide - 1}</h2>
                <div className="flex-1 bg-slate-50 rounded-xl border border-slate-100 p-8">
                  <ul className="list-disc list-inside text-xl space-y-4 text-slate-700">
                    <li>Nyanyian lagu Negaraku, lagu Negeri, dan lagu Sekolah.</li>
                    <li>Bacaan doa oleh wakil pengawas.</li>
                    <li>{report.summary}</li>
                    <li>Laporan guru bertugas minggu lepas.</li>
                  </ul>
                </div>
              </div>
            )}
            {currentSlide === totalSlides && (
              <div className="animate-in zoom-in duration-500">
                <h2 className="text-4xl font-bold text-slate-800 mb-4">Sekian, Terima Kasih</h2>
                <p className="text-slate-500">Tamat Pembentangan</p>
              </div>
            )}
          </div>

          {/* Watermark/Logo simulasi di penjuru slide */}
          <div className="absolute bottom-4 right-6 opacity-30 flex items-center gap-2">
            <img 
              src="/logo-smk.png" 
              alt="Logo" 
              className="w-6 h-6 object-contain grayscale"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://api.iconify.design/lucide:school.svg?color=%231e3a8a" }}
            />
            <span className="text-blue-900 font-bold text-sm">e-Perhimpunan</span>
          </div>
        </div>

        {/* Floating Controls Overlay */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-800/80 backdrop-blur-md px-4 py-3 rounded-2xl flex items-center gap-4 border border-slate-700 shadow-2xl transition-opacity duration-300 ${isFullscreen ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
          <button 
            onClick={prevSlide}
            disabled={currentSlide === 1}
            className="p-2 rounded-full hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="px-4 py-1 bg-slate-900 rounded-lg text-sm font-medium text-slate-300 min-w-[5rem] text-center border border-slate-700">
            {currentSlide} / {totalSlides}
          </div>
          
          <button 
            onClick={nextSlide}
            disabled={currentSlide === totalSlides}
            className="p-2 rounded-full hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {/* Nota Pembangun untuk UI ini */}
      <div className="bg-blue-900 text-blue-200 text-xs text-center py-2 px-4 flex items-center justify-center gap-2">
        <AlertCircle className="w-4 h-4" />
        Nota: Dalam sistem sebenar, ruang slide di atas akan digantikan dengan `&lt;iframe&gt;` Microsoft Office Web Viewer untuk memaparkan fail PPTX sebenar dari server.
      </div>
    </div>
  );
}