import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, 
  Moon, 
  Terminal as TerminalIcon, 
  Shield, 
  Server, 
  Activity, 
  ArrowDown,  
  Cable, 
  Globe, 
  ExternalLink
} from 'lucide-react';

// Use IntersectionObserver custom hook
function useIntersectionObserver<T extends HTMLElement>() {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        observer.unobserve(el); // Animate once
      }
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return [ref, isIntersecting] as const;
}

// Fade in component
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string; key?: React.Key }) {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } ${className}`}
    >
      {children}
    </div>
  );
}

// Default custom officers
interface Officer {
  id: number;
  role: string;
  englishRole: string;
  name: string;
  motto: string;
  icon: 'terminal' | 'shield' | 'server';
}

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");



  // Edit states
  const [isEditingOfficers, setIsEditingOfficers] = useState(false);
  const [officers, setOfficers] = useState<Officer[]>(() => {
    const saved = localStorage.getItem('cnmc_officers_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse cnmc_officers_list", e);
      }
    }
    return [
      {
        id: 1,
        role: '組長',
        englishRole: 'President',
        name: '呂亮寬',
        motto: '我的代碼沒問題，有問題的是路由表。Ping 了不一定會通，但放假一定會通。',
        icon: 'terminal'
      },
      {
        id: 2,
        role: '副組長',
        englishRole: 'Vice President',
        name: '張築鋒',
        motto: '網路不通就重開機；人生卡關就去睡覺。封包會遲到，但從不缺席。',
        icon: 'shield'
      },
      {
        id: 3,
        role: '會計',
        englishRole: 'SysAdmin',
        name: '張閎棋',
        motto: '看著 Terminal 裡奔跑的封包，就像看著我那無怨無悔流逝的青春歲月。',
        icon: 'server'
      }
    ];
  });



  // Handle application dark-mode initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else if (savedTheme === 'dark' || prefersDark) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(true); // Default to Dark themed futuristic look
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Set mouse track coordinates on container
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      container.style.setProperty('--mouse-x', `${x}px`);
      container.style.setProperty('--mouse-y', `${y}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle manual theme toggle
  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      triggerNotification("已切換為深色模式 - 微光網格已加載");
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      triggerNotification("已切換為淺色模式 - 行動系統已啟動");
    }
  };

  const triggerNotification = (msg: string) => {
    setNotificationMessage(msg);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3500);
  };


  return (
    <div 
      ref={containerRef}
      className="cyber-grid w-full min-h-screen font-sans bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-500 overflow-x-hidden"
    >
      {/* Toast Notification block */}
      <div 
        className={`fixed top-24 right-6 z-50 transform transition-all duration-300 ${
          showNotification ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3 bg-white border border-blue-600/30 dark:bg-slate-800/90 dark:border-cyan-500/40 px-5 py-3 rounded-md shadow-lg shadow-blue-500/10 dark:shadow-cyan-500/10">
          <Activity className="w-5 h-5 text-blue-600 dark:text-cyan-400 animate-pulse" />
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{notificationMessage}</p>
        </div>
      </div>

      {/* SECTION 1: Top Navigation Bar */}
      <header className="fixed top-0 left-0 w-full z-40 bg-slate-50/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-md bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center p-[1px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[5px] flex items-center justify-center">
                <span className="font-mono font-black text-lg tracking-wider text-cyan-400">C</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">CNMC</span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-8">
              <a href="#hero" className="text-sm font-medium text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-400 border-b-2 border-blue-600 dark:border-cyan-400 py-1">首頁</a>
              <a href="#about" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors py-1">關於我們</a>
              <a href="#officers" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors py-1">幹部團隊</a>
            </nav>

            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800/80 hidden md:block"></div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle Button */}
              <button 
                onClick={toggleTheme}
                id="theme-toggle"
                className="p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 hover:border-blue-600/30 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800/80 dark:hover:border-cyan-500/40 transition-all cursor-pointer relative overflow-hidden group shadow-sm"
                aria-label="Toggle theme color mode"
              >
                <div className="flex items-center justify-center transition-transform duration-500 group-hover:rotate-180">
                  {isDark ? (
                    <Sun className="w-5 h-5 text-cyan-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </button>

              <a 
                href="#diagnostics"
                className="hidden sm:inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 font-bold font-mono text-xs rounded-sm hover:brightness-110 active:scale-95 transition-all shadow-md shadow-cyan-500/15"
              >
                <TerminalIcon className="w-3.5 h-3.5" />
                <span>CORE_SOC</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* SECTION 2: Hero Section */}
      <section id="hero" className="relative min-h-[92vh] flex flex-col justify-center items-center pt-24 px-6 overflow-hidden">
        {/* Background ambient lighting effects */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-blue-600/5 dark:bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute bottom-10 right-10 w-[200px] h-[200px] bg-blue-600/5 rounded-full blur-[80px] pointer-events-none z-0"></div>

        {/* Hero Content */}
        <div className="max-w-4xl mx-auto text-center z-10 select-none px-2 mt-8">
          <FadeIn delay={100} className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 border border-slate-200 dark:bg-slate-950/80 dark:border-slate-800 rounded-full shadow-inner mb-6">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 dark:bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-cyan-500"></span>
            </span>
            <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-slate-600 dark:text-slate-300 uppercase">
              CNMC • 32th
            </span>
          </FadeIn>

          <FadeIn delay={200}>
            <h1 className="font-sans font-extrabold text-5xl sm:text-7xl md:text-8xl leading-[1.05] tracking-tighter uppercase mb-6 bg-clip-text text-transparent bg-gradient-to-b from-slate-950 via-slate-850 to-slate-600 dark:from-white dark:via-slate-100 dark:to-slate-500">
              國立師大附中
              <br />
              校園網路管理小組
            </h1>
          </FadeIn>

          <FadeIn delay={300}>
            <h2 className="text-lg sm:text-2xl font-semibold tracking-wide text-slate-700 dark:text-slate-300 max-w-2xl mx-auto mb-6">
              HSNU <span className="text-blue-600 dark:text-cyan-400 font-mono">•</span> CNMC
            </h2>
          </FadeIn>

          <FadeIn delay={400}>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
              由一群對網路工程與系統運維充滿熱血的學子所組成。維護校園機房主機與主幹防護，培養出頂尖的高中網管專才。我們是校園雲端與封包傳輸中，最堅強的隱形後盾。
            </p>
          </FadeIn>

          <FadeIn delay={500}>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a 
                href="#about"
                className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-100 border border-slate-200 dark:bg-slate-950/50 dark:hover:bg-slate-900/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-sm transition-all text-center text-sm tracking-wider"
              >
                暸解更多社團宗旨
              </a>
            </div>
          </FadeIn>
        </div>

        {/* Scroll hint visual indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-70 z-10 pointer-events-none select-none">
          <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400">SCROLL_DOWN</span>
          <ArrowDown className="w-4 h-4 text-blue-600 dark:text-cyan-400 animate-bounce-down" />
        </div>
      </section>

      {/* SECTION 3: About Us (關於我們) */}
      <section id="about" className="relative py-24 sm:py-32 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/20 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Visual server rack banner side */}
            <div className="lg:col-span-5 relative order-2 lg:order-1">
              <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 blur-xl opacity-80 pointer-events-none rounded-xl"></div>
              
              <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl group">
                <div className="absolute inset-0 bg-slate-950/15 mix-blend-overlay z-10 transition-opacity duration-300 group-hover:opacity-0"></div>
                <img 
                  alt="CNMC Server Racks Infrastructure" 
                  className="w-full aspect-[4/3] object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWvoHJK_RY9EO7cNIJhNLMeomfURL4ajpIEq-JHxIKfE5d8kbYaPnbj2-wu694sJS1YWXTyczYRP4G5VWK5rGa9HkZB0pJhDuY-u_4gyADBOPQ9YZNJLVtWOpzjyNZyhXMidsAOqc88qd0Q8TVMW6gWEvMmzCEPp7nYbAKTYvF4QI1Iz7XByX2ipFchls9DRSfs61pBCBmCICU1IDp4y09IGjtqyfWYAYtoDcOHIXIOvzRWXEXNqrWMJyZEhuxsD9oo8T8MWXkJTI"
                />
                
                {/* Embedded status specs overlays */}
                <div className="absolute top-5 left-5 z-20 px-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-sm shadow-md backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase tracking-wider">CNMC_RACK_A ONLINE</span>
                  </div>
                </div>
                
                <div className="absolute bottom-5 right-5 z-20 px-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-sm shadow-md backdrop-blur-sm">
                  <span className="font-mono text-[9px] text-slate-300 font-bold uppercase tracking-wider">TEMP: 22.8°C / HUM: 44.5%</span>
                </div>
              </div>
            </div>

            {/* Informational description typography */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <FadeIn delay={100}>
                <div className="inline-flex items-center gap-2 text-blue-600 dark:text-cyan-400 mb-4">
                  <div className="w-8 h-[2px] bg-blue-600/50 dark:bg-cyan-500/50"></div>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest leading-none">CLUB_MISSION</span>
                </div>
              </FadeIn>
              
              <FadeIn delay={200}>
                <h3 className="font-sans font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-6 tracking-tight leading-snug">
                  關於我們
                </h3>
              </FadeIn>

              <div className="space-y-6 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 p-8 rounded-xl backdrop-blur-sm relative overflow-hidden animate-shine shadow-sm">
                <div className="absolute top-0 left-0 w-[3px] h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                <FadeIn delay={300}>
                  <p className="font-sans text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-300 font-medium">
                    網管小組全名為「校園網路管理小組」簡稱為網管或網管小組，英文為 <span className="text-blue-600 dark:text-cyan-400 font-mono font-bold">Campus Networking Management Club</span> 簡稱 <span className="text-blue-600 dark:text-cyan-400 font-mono font-bold">CNMC</span>。本社團宗旨為傳承網路管理知識，以維護學校的網路資源。藉著管理校園機房中的主機，體現在社團中所學之事，使得學校的系統更加通順流暢。
                  </p>
                </FadeIn>

                <FadeIn delay={450}>
                  <p className="font-sans text-sm sm:text-base leading-relaxed text-slate-500 dark:text-slate-400">
                    本社為了使後輩們學習，擁有多台的主機任後輩實驗，且前輩們必定秉持著用心、盡力的教學態度，同時造就各屆奇才。本社最大理念即為創造最佳的社團，創造最好的學習環境，讓社員們有美好的高中生活。
                  </p>
                </FadeIn>
              </div>

              {/* Live telemetry counters */}
              <FadeIn delay={600} className="grid grid-cols-2 gap-6 mt-10">
                <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 backdrop-blur-sm shadow-inner">
                  <span className="block font-sans text-3xl font-extrabold text-blue-600 dark:text-cyan-400 mb-1">100+</span>
                  <span className="block font-mono text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Active Nodes / 機房實驗子網</span>
                </div>
                <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 backdrop-blur-sm shadow-inner">
                  <span className="block font-sans text-3xl font-extrabold text-blue-600 dark:text-cyan-400 mb-1">24/7/365</span>
                  <span className="block font-mono text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Uptime Goal / 主機持續運作指標</span>
                </div>
              </FadeIn>
            </div>

          </div>
        </div>
      </section>



      {/* SECTION 5: Officers (幹部介紹) */}
      <section id="officers" className="py-24 sm:py-32 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header block with Editing Control switchers */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-16">
            <div>
              <FadeIn delay={100}>
                <div className="inline-flex items-center gap-2 text-blue-600 dark:text-cyan-400 mb-4">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest">COMMITTEE_BOARD</span>
                </div>
              </FadeIn>
              <FadeIn delay={200}>
                <h3 className="font-sans font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
                  社團幹部團隊
                </h3>
              </FadeIn>
              <FadeIn delay={300}>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xl">
                  守護校園骨幹與伺服防沙箱、傳承技術教導的核心網管小組幹部。
                </p>
              </FadeIn>
            </div>

          </div>

          {/* Officers Responsive Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {officers.map((officer, idx) => {
              // Icon map helper
              const renderIcon = (type: string) => {
                switch (type) {
                  case 'terminal':
                    return <TerminalIcon className="w-8 h-8 text-cyan-400" />;
                  case 'shield':
                    return <Shield className="w-8 h-8 text-cyan-400" />;
                  case 'server':
                    return <Server className="w-8 h-8 text-cyan-400" />;
                  default:
                    return <TerminalIcon className="w-8 h-8 text-cyan-400" />;
                }
              };

              return (
                <FadeIn key={officer.id} delay={150 * (idx + 1)} className="h-full">
                  <div className={`p-8 rounded-lg h-full flex flex-col justify-between transition-all duration-300 relative border ${
                    isEditingOfficers
                      ? 'border-blue-600/35 bg-blue-50/50 dark:border-cyan-500/50 dark:bg-slate-950/80 shadow-lg shadow-blue-500/10 dark:shadow-cyan-500/10'
                      : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 hover:border-blue-600/50 dark:hover:border-cyan-500/50 shadow-md hover:shadow-blue-500/5 dark:hover:shadow-cyan-500/5 hover:-translate-y-1'
                  }`}>
                    
                    {/* Header block inside card */}
                    <div>
                      <div className="flex items-center justify-between mb-8">
                        <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 flex items-center justify-center shadow-inner">
                          {renderIcon(officer.icon)}
                        </div>
                        <span className="font-mono text-[9px] uppercase tracking-widest bg-blue-600/10 dark:bg-cyan-500/10 border border-blue-600/20 dark:border-cyan-500/20 px-3 py-1 rounded-full text-blue-600 dark:text-cyan-400 font-bold">
                          {officer.englishRole}
                        </span>
                      </div>

                      {/* Display name OR Editor inputs */}
                      {!isEditingOfficers ? (
                        <>
                          <h4 className="font-sans font-bold text-2xl text-slate-900 dark:text-white leading-none mb-1">
                            {officer.name}
                          </h4>
                          <p className="font-mono text-xs text-blue-600 dark:text-cyan-400 font-bold tracking-wider mb-6">
                            {officer.role}
                          </p>
                          
                          {/* Motto quote */}
                          <p className="italic text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4 border-l-2 border-slate-200 dark:border-slate-800 mb-8 min-h-[4rem] flex items-center select-text">
                            "{officer.motto}"
                          </p>
                        </>
                      ) : (
                        <div className="space-y-4 mb-6">
                          <div>
                            <label className="block font-mono text-[9px] text-slate-400 uppercase font-bold mb-1">姓名 / Name</label>
                            <input
                              type="text"
                              value={officer.name}
                              onChange={(e) => {
                                const val = e.target.value;
                                setOfficers(prev => prev.map(o => o.id === officer.id ? { ...o, name: val } : o));
                              }}
                              placeholder="請填寫姓名"
                              className="w-full font-mono text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded focus:border-cyan-500/50 outline-none text-slate-100"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block font-mono text-[9px] text-slate-400 uppercase font-bold mb-1">職稱 / Role</label>
                              <input
                                type="text"
                                value={officer.role}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setOfficers(prev => prev.map(o => o.id === officer.id ? { ...o, role: val } : o));
                                }}
                                className="w-full font-mono text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded focus:border-cyan-500/50 outline-none text-slate-100"
                              />
                            </div>
                            <div>
                              <label className="block font-mono text-[9px] text-slate-400 uppercase font-bold mb-1">代號 / English</label>
                              <input
                                type="text"
                                value={officer.englishRole}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setOfficers(prev => prev.map(o => o.id === officer.id ? { ...o, englishRole: val } : o));
                                }}
                                className="w-full font-mono text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded focus:border-cyan-500/50 outline-none text-slate-100"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block font-mono text-[9px] text-slate-400 uppercase font-bold mb-1">技術格言 / Technology Motto</label>
                            <textarea
                              rows={2}
                              value={officer.motto}
                              onChange={(e) => {
                                const val = e.target.value;
                                setOfficers(prev => prev.map(o => o.id === officer.id ? { ...o, motto: val } : o));
                              }}
                              className="w-full font-sans text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded focus:border-cyan-500/50 outline-none text-slate-100 resize-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom layout metadata indicators inside card */}
                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-900 pt-5">
                      <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs font-mono">
                        <Cable className="w-3.5 h-3.5 text-slate-600" />
                        <span>SSH_NODE_0{officer.id}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-600 font-bold uppercase select-none">CNMC_STAFF</span>
                    </div>

                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 6: Standard footer 置中排版 */}
      <footer className="w-full py-16 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-900/80 transition-colors duration-500 relative z-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex flex-col items-center gap-6">
            
            {/* CNMC Identity signoff */}
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tighter text-slate-900 dark:text-white">CNMC</span>
              <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
              <span className="font-mono text-xs text-blue-600 dark:text-cyan-400 uppercase font-semibold">校園網路管理小組</span>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
              Advancing campus connectivity through student-led innovation and infrastructure engineering. 傳承網路通訊管理技能，共同創造最具高度的高中生網路實驗園地。
            </p>

            {/* Navigational map lists of the single-page applet */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 my-2 font-mono text-[10px] uppercase font-bold tracking-wider">
              <a href="#hero" className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors">首頁</a>
              <a href="#about" className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors">關於我們</a>
              <a href="#officers" className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors">幹部介紹</a>
            </div>


            {/* Divider */}
            <div className="w-16 h-[1px] bg-slate-800/80 my-2"></div>

            <p className="text-xs text-slate-400 dark:text-slate-500 opacity-80">
              © 2026 國立臺灣師範大學附屬高級中學校園網路管理小組. All rights reserved.
            </p>

          </div>
        </div>
      </footer>
    </div>
  );
}
