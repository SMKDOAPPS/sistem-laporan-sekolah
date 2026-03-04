import React, { useState, useRef, useEffect } from 'react';
import { 
  MonitorPlay, LayoutDashboard, UploadCloud, Users, LogOut, 
  FileText, Calendar, Search, Plus, Maximize, X, Trash2, Edit3, 
  CheckCircle2, AlertCircle, PlaySquare, Loader2
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { initializeApp } from "firebase/app";
import { 
  getAuth, signInWithPopup, GoogleAuthProvider, 
  signOut, onAuthStateChanged 
} from "firebase/auth";
import { 
  getFirestore, collection, addDoc, deleteDoc, doc, 
  query, orderBy, onSnapshot 
} from "firebase/firestore";
import { 
  getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject 
} from "firebase/storage";

// --- FIREBASE CONFIGURATION (Konfigurasi Sebenar Cikgu) ---
const firebaseConfig = {
  apiKey: "AIzaSyAKI4yO_zUR5ayE0ilCb1lmg5yz-x4p2PQ",
  authDomain: "perhimpunan-rasmi.firebaseapp.com",
  projectId: "perhimpunan-rasmi",
  storageBucket: "perhimpunan-rasmi.firebasestorage.app",
  messagingSenderId: "1002157801773",
  appId: "1:1002157801773:web:7686d1e8f43e7b7c1753a4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// --- TETAPAN ADMIN & AKSES ---
const ADMIN_EMAILS = ['sekolah-4166-cm1@moe-dl.edu.my', 'sekolah-4166-cm5@moe-dl.edu.my', 'faizfoat@gmail.com']; 

// --- KOMPONEN UTAMA (APP) ---
export default function App() {
  const [currentView, setCurrentView] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [loadingApp, setLoadingApp] = useState(true);

  // Semak status log masuk semasa app dibuka
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Tentukan Role pengguna
        const role = ADMIN_EMAILS.includes(user.email) ? 'admin' : 'guru';
        setCurrentUser({
          uid: user.uid,
          name: user.displayName || 'Cikgu',
          email: user.email,
          role: role
        });
        setCurrentView('dashboard');
      } else {
        setCurrentUser(null);
        setCurrentView('login');
      }
      setLoadingApp(false);
    });
    return () => unsubscribe();
  }, []);

  // Tarik data laporan dari Firestore (Real-time)
  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, "reports"), orderBy("week", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reportsData = [];
      snapshot.forEach((doc) => {
        reportsData.push({ id: doc.id, ...doc.data() });
      });
      setReports(reportsData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Fungsi Log Masuk (Google)
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    try {
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user.email;
      
      // SYARAT AKSES: Hanya e-mel MOE dan Gmail dibenarkan untuk ujian
      if (userEmail.endsWith('@moe-dl.edu.my') || userEmail.endsWith('@gmail.com')) {
        // Berjaya log masuk (Akan diuruskan oleh onAuthStateChanged)
      } else {
        await signOut(auth);
        alert("Akses Ditolak! Sila gunakan e-mel rasmi sekolah/DELIMa sahaja.");
      }
    } catch (error) {
      console.error("Ralat log masuk:", error);
      if(error.code !== 'auth/popup-closed-by-user') {
        alert("Gagal log masuk. Sila cuba lagi.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Ralat log keluar:", error);
    }
  };

  const viewReport = (report) => {
    setSelectedReport(report);
    setCurrentView('viewer');
  };

  // Fungsi Padam Laporan dari Database & Storage
  const deleteReport = async (id, fileUrl) => {
    if(window.confirm('Adakah anda pasti mahu memadam laporan ini? Tindakan ini tidak boleh diundur.')) {
      try {
        // 1. Padam dari Firestore
        await deleteDoc(doc(db, "reports", id));
        
        // 2. Padam fail dari Storage
        try {
          if (fileUrl) {
            const fileRef = ref(storage, fileUrl);
            await deleteObject(fileRef);
          }
        } catch (e) {
          console.warn("Fail fizikal mungkin sudah tiada di Storage", e);
        }
      } catch (error) {
        console.error("Ralat memadam:", error);
        alert("Gagal memadam laporan.");
      }
    }
  };

  if (loadingApp) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  }

  // --- PAPARAN LOG MASUK ---
  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-700 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-blue-800 opacity-20 transform -skew-y-6 z-0"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner p-2">
                <img 
                  src="/logo-smk.png" 
                  alt="Logo SMK Dato Onn" 
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://api.iconify.design/lucide:school.svg?color=%231e3a8a" }}
                />
              </div>
              <h1 className="text-2xl font-bold text-white">e-Perhimpunan</h1>
              <p className="text-blue-100 mt-2 text-sm">SMK Dato' Onn, Batu Pahat</p>
            </div>
          </div>
          <div className="p-8 space-y-4">
            <button 
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-all"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Log Masuk (Google / DELIMa)
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
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">SMK Dato' Onn</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <SidebarItem icon={<LayoutDashboard />} label="Papan Pemuka" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
          <SidebarItem icon={<UploadCloud />} label="Muat Naik Laporan" active={currentView === 'upload'} onClick={() => setCurrentView('upload')} />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
              {currentUser?.name?.charAt(0) || 'U'}
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
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm">
           <div className="flex items-center gap-2">
            <img src="/logo-smk.png" alt="Logo" className="w-8 h-8 object-contain" onError={(e) => { e.target.onerror = null; e.target.src = "https://api.iconify.design/lucide:school.svg?color=%231e3a8a" }}/>
            <h2 className="font-bold text-blue-900">e-Perhimpunan</h2>
          </div>
          <button onClick={handleLogout} className="text-slate-500">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

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
              onSuccess={() => setCurrentView('dashboard')}
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
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = reports.filter(r => 
    (r.teacher && r.teacher.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (r.week && r.week.toString().includes(searchTerm))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Papan Pemuka</h1>
          <p className="text-slate-500 mt-1">Selamat bertugas, {currentUser?.name}.</p>
        </div>
        <button 
          onClick={onAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-md shadow-blue-200 font-medium flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" /> Tambah Laporan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <StatCard icon={<FileText />} title="Jumlah Laporan" value={reports.length.toString()} color="blue" />
        <StatCard icon={<Calendar />} title="Laporan Bulan Ini" value={reports.filter(r => new Date(r.date).getMonth() === new Date().getMonth()).length.toString()} color="indigo" />
        <StatCard icon={<CheckCircle2 />} title="Status Sistem" value="Aktif (Live)" color="emerald" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <h2 className="font-bold text-slate-800 text-lg">Senarai Laporan Mingguan</h2>
          <div className="relative w-full sm:w-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Cari nama guru / minggu..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
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
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-4">
                    <div className="font-semibold text-slate-800">Minggu {report.week}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{report.date}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {report.teacher?.charAt(0) || 'G'}
                      </div>
                      <div className="truncate max-w-[150px] md:max-w-xs" title={report.teacher}>{report.teacher}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-orange-100 rounded-lg text-orange-600 shrink-0">
                        <PlaySquare className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-sm font-medium text-slate-700 truncate max-w-[120px] md:max-w-[200px]" title={report.filename}>{report.filename}</div>
                        <div className="text-xs text-slate-400">{report.size}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {/* BUTTON SENTIASA KELIHATAN, BIRU -> MERAH BILA HOVER */}
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => onView(report)}
                        className="p-2 bg-blue-600 text-white hover:bg-red-600 rounded-lg transition-colors tooltip flex items-center gap-1 text-xs px-3 shadow-sm"
                        title="Buka Presentation"
                      >
                        <MonitorPlay className="w-4 h-4" /> <span className="hidden lg:inline">Buka</span>
                      </button>
                      
                      {(currentUser?.role === 'admin' || currentUser?.email === report.teacherEmail) && (
                        <button 
                          onClick={() => onDelete(report.id, report.fileUrl)}
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-colors shadow-sm"
                          title="Padam Laporan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    Belum ada laporan dijumpai.
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

// --- PAPARAN: MUAT NAIK & SIMPAN (FIREBASE STORAGE) ---
function UploadForm({ onCancel, onSuccess, currentUser }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    week: '',
    date: new Date().toISOString().split('T')[0],
    summary: ''
  });

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleFile = (selectedFile) => {
    if (selectedFile.name.endsWith('.ppt') || selectedFile.name.endsWith('.pptx')) {
      setFile(selectedFile);
    } else {
      alert("Sila muat naik fail berformat PowerPoint (.ppt atau .pptx) sahaja.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { alert("Sila muat naik fail PowerPoint terlebih dahulu."); return; }
    
    setIsUploading(true);
    const storageObjRef = ref(storage, `laporan_mingguan/Minggu_${formData.week}_${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageObjRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(prog);
      }, 
      (error) => {
        console.error("Gagal muat naik:", error);
        alert("Gagal memuat naik fail.");
        setIsUploading(false);
      }, 
      async () => {
        // Selepas fail siap dimuat naik, dapatkan link URL
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        
        // Simpan maklumat ke Database (Firestore)
        await addDoc(collection(db, "reports"), {
          week: parseInt(formData.week),
          date: formData.date,
          teacher: currentUser.name,
          teacherEmail: currentUser.email,
          summary: formData.summary,
          filename: file.name,
          fileUrl: downloadURL,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          uploadDate: new Date().toISOString(),
        });

        setIsUploading(false);
        onSuccess();
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 animate-in zoom-in-95 duration-300">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Muat Naik Laporan Mingguan</h2>
        <p className="text-slate-500 mt-1">Sertakan fail pembentangan (.pptx) anda ke dalam pelayan awan sekolah.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Minggu Ke (Nombor)</label>
            <input 
              type="number" required min="1" max="52"
              value={formData.week}
              onChange={(e) => setFormData({...formData, week: e.target.value})}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
              placeholder="Contoh: 12" disabled={isUploading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Tarikh Perhimpunan</label>
            <input 
              type="date" required
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
              disabled={isUploading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Ringkasan Laporan</label>
          <textarea 
            required rows="3"
            value={formData.summary}
            onChange={(e) => setFormData({...formData, summary: e.target.value})}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            placeholder="Tuliskan aktiviti utama perhimpunan..."
            disabled={isUploading}
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Fail PowerPoint (.ppt, .pptx)</label>
          
          <div 
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'
            }`}
            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
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
                {!isUploading && (
                  <button type="button" onClick={() => setFile(null)} className="mt-2 text-sm text-red-500 hover:text-red-700 font-medium">Buang Fail</button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <UploadCloud className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-slate-600 font-medium">Tarik & Letak fail anda di sini</p>
                <label className="bg-white border border-slate-200 shadow-sm text-slate-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors font-medium text-sm mt-2">
                  Pilih Fail
                  <input 
                    type="file" accept=".ppt,.pptx" className="hidden" 
                    onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
                  />
                </label>
              </div>
            )}
          </div>
          
          {/* Progress Bar memuat naik */}
          {isUploading && (
            <div className="w-full bg-slate-200 rounded-full h-2.5 mt-4">
              <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
              <p className="text-xs text-center text-slate-500 mt-2">Memuat naik... {Math.round(progress)}%</p>
            </div>
          )}
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <button type="button" onClick={onCancel} disabled={isUploading} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50">
            Batal
          </button>
          <button type="submit" disabled={isUploading} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-xl shadow-md font-medium transition-all flex items-center gap-2">
            {isUploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : 'Simpan Laporan'}
          </button>
        </div>
      </form>
    </div>
  );
}

// --- PAPARAN: OFFICE VIEWER SEBENAR (IFRAME) ---
function PresentationViewer({ report, onClose }) {
  const viewerRef = useRef(null);
  
  // TUKAR SEMULA KE MICROSOFT OFFICE VIEWER (Slide takkan terhimpit lagi)
  const iframeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(report.fileUrl)}`;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="absolute inset-0 bg-slate-900/95 z-50 flex flex-col backdrop-blur-sm animate-in fade-in duration-300">
      <div className="flex justify-between items-center p-3 bg-slate-900 text-white border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500 rounded text-white shrink-0">
            <PlaySquare className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <h3 className="font-semibold text-sm md:text-base leading-tight truncate max-w-[200px] md:max-w-md">{report.filename}</h3>
            <p className="text-xs text-slate-400 truncate">Dimuat naik oleh {report.teacher}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Butang Muat Turun Alternatif ditambah */}
          <a 
            href={report.fileUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-white text-xs font-medium mr-2"
            title="Muat Turun Fail"
          >
            Muat Turun Asal
          </a>
          <button onClick={toggleFullscreen} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-white" title="Penuh Skrin">
            <Maximize className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-slate-700 mx-2"></div>
          <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-red-600 rounded-lg transition-colors text-slate-300 hover:text-white" title="Tutup">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div ref={viewerRef} className="flex-1 w-full bg-slate-800 flex items-center justify-center p-2 md:p-6">
        <div className="w-full h-full max-w-6xl bg-white shadow-2xl relative rounded-md overflow-hidden flex flex-col items-center justify-center">
          {/* Iframe Paparan Sebenar */}
          <iframe 
            src={iframeUrl} 
            width="100%" 
            height="100%" 
            frameBorder="0"
            title="Presentation Viewer"
            className="w-full h-full z-10 relative bg-white"
            allowFullScreen
          ></iframe>
          
          {/* Teks loading di belakang iframe */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 z-0 bg-slate-50">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
            <p className="font-medium">Memuatkan paparan dokumen...</p>
            <p className="text-sm mt-2 text-center px-4 max-w-md">
              Membuka sambungan selamat ke Microsoft Office Viewer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}