import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'motion/react';
import { Layers, Wrench, TerminalSquare, Cpu, Code2, Shield, Database, GitBranch, ChevronDown, Github, Zap, FileText, Globe, Cloud, Briefcase, AlertTriangle, Lock, Eye, Building, Puzzle, Users, Link, Menu, X, Palette, Settings } from 'lucide-react';

const themesList = [
  'theme-bttf', 'theme-retro', 'theme-architect', 'theme-php', 
  'theme-resume', 'theme-linux', 'theme-intel', 'theme-cyberpunk'
];

const themeDisplayNames: Record<string, string> = {
  'theme-bttf': 'BTTF',
  'theme-retro': 'Retro',
  'theme-architect': 'Architect',
  'theme-php': 'PHP',
  'theme-resume': 'Resume',
  'theme-linux': 'Linux',
  'theme-intel': 'Intel',
  'theme-cyberpunk': 'Cyberpunk',
};

const themeColors: Record<string, { bg: string, primary: string }> = {
  'theme-bttf': { bg: '#0a0a16', primary: '#f000ff' },
  'theme-retro': { bg: '#0000a8', primary: '#ffffff' },
  'theme-architect': { bg: '#f8fafc', primary: '#3b82f6' },
  'theme-php': { bg: '#3e4c7a', primary: '#8892BF' },
  'theme-resume': { bg: '#1e293b', primary: '#38bdf8' },
  'theme-linux': { bg: '#000000', primary: '#00ff00' },
  'theme-intel': { bg: '#050505', primary: '#ff0055' },
  'theme-cyberpunk': { bg: '#0a0a0c', primary: '#ff0055' },
};

function buildRandomThemeMap(): Record<string, string> {
  const map: Record<string, string> = {};
  sections.forEach((s) => {
    map[s.id] = themesList[Math.floor(Math.random() * themesList.length)];
  });
  return map;
}

function buildUniformThemeMap(theme: string): Record<string, string> {
  const map: Record<string, string> = {};
  sections.forEach((s) => {
    map[s.id] = theme;
  });
  return map;
}

const sections = [
  { id: 'hero', name: 'Identity' },
  { id: 'about', name: 'About' },
  { id: 'domains', name: 'Architecture' },
  { id: 'opensource', name: 'Open Source' },
  { id: 'resume', name: 'Experience' },
  { id: 'whyme', name: 'Why Me' },
  { id: 'cyberpunk', name: 'Cybernetics' },
  { id: 'engineering', name: 'Engineering' },
];

function Typewriter({ text, delay = 0, speed = 30, className = "", cursor = true }: { text: string, delay?: number, speed?: number, className?: string, cursor?: boolean }) {
  const [startTyping, setStartTyping] = useState(false);

  return (
    <motion.span
      onViewportEnter={() => {
        setTimeout(() => setStartTyping(true), delay * 1000);
      }}
      viewport={{ once: true, margin: "-50px" }}
      className={className}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        <TypewriterInner text={text} startTyping={startTyping} speed={speed} cursor={cursor} />
      </span>
    </motion.span>
  );
}

function TypewriterInner({ text, startTyping, speed, cursor }: { text: string, startTyping: boolean, speed: number, cursor: boolean }) {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    if (!startTyping) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, startTyping, speed]);

  return (
    <>
      {displayedText}
      {cursor && <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}>_</motion.span>}
    </>
  );
}

export default function App() {
  const [activeTheme, setActiveTheme] = useState('theme-architect');
  const [activeSection, setActiveSection] = useState('hero');
  const [isManualScroll, setIsManualScroll] = useState(false);
  const [isAutoThemeEnabled, setIsAutoThemeEnabled] = useState(false);
  const [sectionThemeMap, setSectionThemeMap] = useState<Record<string, string>>(() => buildUniformThemeMap('theme-architect'));
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const ratios = useRef<Record<string, number>>({});
  const activeSectionRef = useRef(activeSection);
  const autoThemeRef = useRef(isAutoThemeEnabled);
  const sectionThemeMapRef = useRef(sectionThemeMap);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    autoThemeRef.current = isAutoThemeEnabled;
  }, [isAutoThemeEnabled]);

  useEffect(() => {
    sectionThemeMapRef.current = sectionThemeMap;
  }, [sectionThemeMap]);

  const toggleAutoTheme = () => {
    const newState = !isAutoThemeEnabled;
    setIsAutoThemeEnabled(newState);
    if (newState) {
      const newMap = buildRandomThemeMap();
      setSectionThemeMap(newMap);
      setActiveTheme(newMap[activeSectionRef.current] || themesList[0]);
    } else {
      const newMap = buildUniformThemeMap('theme-architect');
      setSectionThemeMap(newMap);
      setActiveTheme('theme-architect');
    }
  };

  const handleSectionThemeChange = (sectionId: string, theme: string) => {
    setSectionThemeMap(prev => {
      const updated = { ...prev, [sectionId]: theme };
      if (sectionId === activeSectionRef.current) {
        setActiveTheme(theme);
      }
      return updated;
    });
  };

  const handleRandomizeAll = () => {
    const newMap = buildRandomThemeMap();
    setSectionThemeMap(newMap);
    setIsAutoThemeEnabled(true);
    setActiveTheme(newMap[activeSectionRef.current] || themesList[0]);
  };

  useEffect(() => {
    if (isManualScroll) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.current[entry.target.id] = entry.intersectionRatio;
        });

        let maxRatio = 0;
        let targetId = activeSectionRef.current;

        Object.entries(ratios.current).forEach(([id, ratio]) => {
          const numRatio = ratio as number;
          if (numRatio > maxRatio) {
            maxRatio = numRatio;
            targetId = id;
          }
        });

        if (maxRatio > 0 && targetId !== activeSectionRef.current) {
          const currentSection = sections.find((s) => s.id === targetId);
          if (currentSection) {
            if (autoThemeRef.current) {
              const mappedTheme = sectionThemeMapRef.current[targetId];
              if (mappedTheme) {
                setActiveTheme(mappedTheme);
              }
            }
            setActiveSection(currentSection.id);
          }
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '-20% 0px -20% 0px',
      }
    );

    sections.forEach((s) => {
      const element = document.getElementById(s.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [isManualScroll]);

  const handleNavClick = (id: string) => {
    setIsManualScroll(true);
    setActiveSection(id);
    if (isAutoThemeEnabled) {
      const mappedTheme = sectionThemeMapRef.current[id];
      if (mappedTheme) {
        setActiveTheme(mappedTheme);
      }
    }
    
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Allow time for smooth scrolling to finish before re-enabling the observer
    setTimeout(() => {
      setIsManualScroll(false);
    }, 800);
  };

  return (
    <div className={`theme-container min-h-screen w-full ${activeTheme}`}>
      <Navbar activeSection={activeSection} activeTheme={activeTheme} onNavClick={handleNavClick} />
      <main>
        <HeroSection />
        <AboutSection />
        <DomainsSection />
        <OpenSourceSection />
        <ResumeSection />
        <WhyHireSection />
        <CyberpunkSection />
        <EngineeringSection />
      </main>
      <footer className="w-full p-6 text-center opacity-50 font-mono text-sm">
        <p>© {new Date().getFullYear()} Lars Moelleken. All systems operational.</p>
      </footer>
      
      {/* Floating Theme Controls */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <button
          onClick={() => setIsConfigOpen(true)}
          className={`p-3 rounded-full shadow-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            isAutoThemeEnabled 
              ? 'bg-[var(--theme-bg)] text-[var(--theme-primary)] border-2 border-[var(--theme-primary)] hover:scale-110 focus-visible:ring-[var(--theme-primary)]' 
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 focus-visible:ring-slate-400'
          }`}
          aria-label="Open theme configuration"
          title="Theme configuration"
        >
          <Settings size={20} />
        </button>
        <button
          onClick={toggleAutoTheme}
          className={`p-4 rounded-full shadow-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            isAutoThemeEnabled 
              ? 'bg-[var(--theme-primary)] text-[var(--theme-bg)] hover:scale-110 focus-visible:ring-[var(--theme-primary)]' 
              : 'bg-white text-slate-800 hover:bg-slate-100 border border-slate-200 focus-visible:ring-slate-400'
          }`}
          aria-label={isAutoThemeEnabled ? "Disable auto theme switching" : "Enable auto theme switching"}
          title={isAutoThemeEnabled ? "Disable auto theme switching" : "Enable auto theme switching"}
        >
          <Palette size={24} className={isAutoThemeEnabled ? 'animate-pulse' : ''} />
        </button>
      </div>

      {/* Theme Configuration Overlay */}
      <AnimatePresence>
        {isConfigOpen && (
          <ThemeConfigOverlay
            sectionThemeMap={sectionThemeMap}
            isAutoThemeEnabled={isAutoThemeEnabled}
            onSectionThemeChange={handleSectionThemeChange}
            onRandomizeAll={handleRandomizeAll}
            onClose={() => setIsConfigOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ThemeConfigOverlay({ 
  sectionThemeMap, 
  isAutoThemeEnabled,
  onSectionThemeChange, 
  onRandomizeAll, 
  onClose 
}: { 
  sectionThemeMap: Record<string, string>,
  isAutoThemeEnabled: boolean,
  onSectionThemeChange: (sectionId: string, theme: string) => void,
  onRandomizeAll: () => void,
  onClose: () => void 
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700 sticky top-0 bg-slate-900 z-10 rounded-t-2xl">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Palette size={20} className="text-blue-400" /> Theme Configuration
            </h3>
            <p className="text-sm text-slate-400 mt-1">Assign a theme to each section</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onRandomizeAll}
              className="px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              title="Randomize all section themes"
            >
              Randomize
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              aria-label="Close configuration"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="px-5 py-3 border-b border-slate-800">
          <div className={`text-xs font-mono px-2 py-1 rounded inline-block ${isAutoThemeEnabled ? 'bg-green-900/50 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
            {isAutoThemeEnabled ? '● Auto-switching ON — themes change as you scroll' : '○ Auto-switching OFF — toggle via palette button'}
          </div>
        </div>

        {/* Matrix */}
        <div className="p-5">
          <div className="space-y-3">
            {sections.map((section) => (
              <div key={section.id} className="flex items-center gap-3">
                <div className="w-28 shrink-0 text-sm font-medium text-slate-300 truncate" title={section.name}>
                  {section.name}
                </div>
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {themesList.map((theme) => {
                    const isSelected = sectionThemeMap[section.id] === theme;
                    const colors = themeColors[theme];
                    return (
                      <button
                        key={theme}
                        onClick={() => onSectionThemeChange(section.id, theme)}
                        className={`px-2.5 py-1 text-xs rounded-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                          isSelected 
                            ? 'ring-2 ring-blue-400 font-bold scale-105' 
                            : 'opacity-60 hover:opacity-100 hover:scale-105'
                        }`}
                        style={{
                          backgroundColor: colors.bg,
                          color: colors.primary,
                          border: `1px solid ${isSelected ? colors.primary : 'rgba(255,255,255,0.15)'}`,
                        }}
                        title={`Set ${section.name} to ${themeDisplayNames[theme]}`}
                        aria-pressed={isSelected}
                      >
                        {themeDisplayNames[theme]}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer hint */}
        <div className="px-5 py-3 border-t border-slate-800 text-xs text-slate-500 text-center">
          Click a theme for each section · Use <strong>Randomize</strong> to shuffle · Toggle auto-switch with the <Palette size={12} className="inline" aria-hidden="true" /> button
        </div>
      </motion.div>
    </motion.div>
  );
}

function Navbar({ activeSection, activeTheme, onNavClick }: { activeSection: string, activeTheme: string, onNavClick: (id: string) => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLinkClick = (id: string) => {
    onNavClick(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 p-4 pointer-events-none transition-colors duration-300 text-[var(--theme-text)]`}>
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="font-bold text-xl tracking-tighter pointer-events-auto">voku</div>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex min-w-0 flex-1 items-center justify-end gap-4 xl:gap-6 pointer-events-auto whitespace-nowrap">
          {sections.map((s) => (
            <a 
              key={s.id} 
              href={`#${s.id}`}
              onClick={(e) => { e.preventDefault(); handleLinkClick(s.id); }}
              className={`text-xs xl:text-sm uppercase tracking-widest transition-[color,opacity] duration-300 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded px-1 ${
                activeSection === s.id 
                  ? 'opacity-100 font-bold text-[var(--theme-primary)]' 
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              {s.name}
            </a>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden pointer-events-auto p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/95 backdrop-blur-md z-40 flex flex-col items-center justify-center pointer-events-auto">
          <button 
            className="absolute top-6 right-6 text-white p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={32} />
          </button>
          <div className="flex flex-col gap-6 items-center text-white">
            {sections.map((s) => (
              <a 
                key={s.id} 
                href={`#${s.id}`}
                onClick={(e) => { e.preventDefault(); handleLinkClick(s.id); }}
                className={`text-2xl uppercase tracking-widest transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded px-2 ${
                  activeSection === s.id 
                    ? 'opacity-100 font-bold text-[var(--theme-primary)]' 
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { stiffness: 75, damping: 15 });
  const y = useSpring(mouseY, { stiffness: 75, damping: 15 });

  const handleMouseMove = (event: React.MouseEvent) => {
    const { clientX, clientY } = event;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    mouseX.set((clientX - centerX) / 25);
    mouseY.set((clientY - centerY) / 25);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <section 
      id="hero" 
      className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ x, y }}
        className="max-w-4xl mx-auto text-center z-10"
      >
        <motion.p variants={itemVariants} className="text-xl md:text-2xl mb-4 tracking-widest uppercase opacity-80" role="doc-subtitle">
          Lars Moelleken (voku)
        </motion.p>
        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 uppercase tracking-tighter italic"
        >
          Software Systems <br/> Architect
        </motion.h1>
        
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mb-12">
          <span className="px-4 py-2 border border-current rounded-full text-sm uppercase tracking-wider hover:bg-[var(--theme-primary)]/10 transition-colors cursor-default backdrop-blur-sm">Open Source Maintainer</span>
          <span className="px-4 py-2 border border-current rounded-full text-sm uppercase tracking-wider hover:bg-[var(--theme-primary)]/10 transition-colors cursor-default backdrop-blur-sm">Engineering Workflow Designer</span>
        </motion.div>

        <motion.p variants={itemVariants} className="text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto border-l-4 border-current pl-6 text-left italic opacity-90 backdrop-blur-sm">
          Software Systems Architect specializing in legacy modernization, developer tooling, and maintainable engineering systems.
        </motion.p>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 10, 0] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-12 opacity-50"
      >
        <ChevronDown size={40} />
      </motion.div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="min-h-[120vh] flex flex-col justify-center px-6 py-32 relative">
      <div className="max-w-4xl mx-auto w-full z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 border-b-2 border-current pb-4 inline-block">
            <Typewriter text="C:\> WHOAMI" delay={0.2} speed={100} />
          </h2>
          <p className="text-xl opacity-80 max-w-3xl mb-8 leading-relaxed">
            <Typewriter text="Lars Moelleken is a seasoned German software developer specializing in PHP, backend systems, and open-source projects." delay={1.2} speed={30} cursor={false} />
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-bg p-8"
          >
            <h3 className="text-2xl font-bold mb-6 text-[var(--theme-text)] border-b border-current pb-2">SYSTEM.INFO</h3>
            <ul className="space-y-4">
              <li className="flex flex-col"><span className="text-[var(--theme-text)] font-bold mb-1">BORN:</span> 1987</li>
              <li className="flex flex-col"><span className="text-[var(--theme-text)] font-bold mb-1">LOCATION:</span> Voerde, Germany</li>
              <li className="flex flex-col"><span className="text-[var(--theme-text)] font-bold mb-1">CURRENT ROLE:</span> Senior Software Developer (PHP) at REMONDIS IT Services GmbH & Co. KG</li>
              <li className="flex flex-col"><span className="text-[var(--theme-text)] font-bold mb-1">TECH STACK:</span> PHP (5–8), MySQL, PostgreSQL, Symfony, REST APIs, JavaScript, CSS3, HTML5, Git, Linux, CI/CD</li>
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-bg p-8"
          >
            <h3 className="text-2xl font-bold mb-6 text-[var(--theme-text)] border-b border-current pb-2">REFERENCES.LNK</h3>
            <ul className="space-y-4">
              <li><a href="http://suckup.de/about/" target="_blank" rel="noreferrer" className="hover:text-[var(--theme-primary)] hover:underline flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded px-1" aria-label="Über mich (Blog) (opens in a new tab)"><Link size={16} aria-hidden="true" /> Über mich (Blog)</a></li>
              <li><a href="https://www.xing.com/profile/Lars_Moelleken" target="_blank" rel="noreferrer" className="hover:text-[var(--theme-primary)] hover:underline flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded px-1" aria-label="XING Profile (opens in a new tab)"><Link size={16} aria-hidden="true" /> XING Profile</a></li>
              <li><a href="https://github.com/voku/" target="_blank" rel="noreferrer" className="hover:text-[var(--theme-primary)] hover:underline flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded px-1" aria-label="GitHub (@voku) (opens in a new tab)"><Github size={16} aria-hidden="true" /> GitHub (@voku)</a></li>
              <li><a href="https://de.linkedin.com/company/remondis-it" target="_blank" rel="noreferrer" className="hover:text-[var(--theme-primary)] hover:underline flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded px-1" aria-label="REMONDIS IT (opens in a new tab)"><Link size={16} aria-hidden="true" /> REMONDIS IT</a></li>
              <li><a href="https://www.youtube.com/c/LarsMoelleken/videos" target="_blank" rel="noreferrer" className="hover:text-[var(--theme-primary)] hover:underline flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded px-1" aria-label="YouTube Channel (opens in a new tab)"><Link size={16} aria-hidden="true" /> YouTube Channel</a></li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function DomainsSection() {
  return (
    <section id="domains" className="min-h-[120vh] flex flex-col justify-center px-6 py-32 relative">
      <div className="max-w-6xl mx-auto w-full z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 border-b-2 border-current pb-4 inline-block uppercase tracking-tight">Architectural Domains</h2>
          <p className="text-xl opacity-80 max-w-2xl">Designing maintainable software systems and improving engineering workflows.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <DomainCard 
            icon={<Layers size={32} aria-hidden="true" />}
            title="Software Architecture"
            items={['Maintainable system design', 'Modular architectures', 'Deletable code', 'Pragmatic SOLID']}
            index={0}
          />
          <DomainCard 
            icon={<Wrench size={32} aria-hidden="true" />}
            title="Legacy Modernization"
            items={['Refactoring legacy PHP', 'Introducing static analysis', 'Incremental architecture upgrades']}
            index={1}
          />
          <DomainCard 
            icon={<Cpu size={32} aria-hidden="true" />}
            title="System Optimization"
            items={['Performance profiling', 'Database query optimization', 'Scalable caching strategies']}
            index={2}
          />
        </div>
      </div>
    </section>
  );
}

function DomainCard({ icon, title, items, index }: { icon: React.ReactNode, title: string, items: string[], index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1, type: "spring", bounce: 0.2 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className="card-bg p-8 rounded-xl group cursor-default"
    >
      <motion.div 
        className="mb-6 opacity-80 group-hover:opacity-100 transition-opacity"
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-2xl font-bold mb-6 uppercase tracking-tight">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="opacity-50 mt-1 group-hover:opacity-100 transition-opacity">▹</span>
            <span className="text-lg">{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function OpenSourceSection() {
  return (
    <section id="opensource" className="min-h-[120vh] flex flex-col justify-center px-6 py-32 relative overflow-hidden">
      {/* Abstract Elephant Shape Background */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.2 }}
        transition={{ duration: 1.5 }}
        className="absolute right-[-10%] top-1/4 w-96 h-96 bg-[var(--theme-primary)] rounded-full blur-3xl"
      ></motion.div>
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.3 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="absolute left-[-5%] bottom-1/4 w-64 h-64 bg-[var(--theme-secondary)] rounded-full blur-2xl"
      ></motion.div>

      <div className="max-w-6xl mx-auto w-full z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Open Source Infrastructure</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">Building and maintaining ecosystem improvements used by thousands of developers.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProjectCard icon={<Code2 aria-hidden="true" />} title="portable-utf8" desc="Performance optimized (unicode) string functions for PHP." tags={['PHP', 'Unicode', 'Polyfill']} stats="10M+ DLs" index={0} />
          <ProjectCard icon={<Shield aria-hidden="true" />} title="anti-xss" desc="Robust cross-site scripting (XSS) protection module." tags={['PHP', 'Security', 'XSS']} stats="5M+ DLs" index={1} />
          <ProjectCard icon={<Database aria-hidden="true" />} title="Arrayy" desc="Advanced array manipulation library, compatible with PHP 7/8." tags={['PHP', 'Collections', 'Data']} stats="2M+ DLs" index={2} />
          <ProjectCard icon={<Zap aria-hidden="true" />} title="HtmlMin" desc="HTML Compressor and Minifier. Reduces HTML size for faster loading." tags={['PHP', 'Performance', 'HTML']} stats="3M+ DLs" index={3} />
          <ProjectCard icon={<Globe aria-hidden="true" />} title="simple_html_dom" desc="PHP Simple HTML DOM Parser with advanced CSS selector support." tags={['PHP', 'DOM', 'Scraping']} stats="4M+ DLs" index={4} />
          <ProjectCard icon={<TerminalSquare aria-hidden="true" />} title="portable-ascii" desc="Performance optimized ASCII string manipulation functions." tags={['PHP', 'ASCII', 'Strings']} stats="8M+ DLs" index={5} />
          <ProjectCard icon={<FileText aria-hidden="true" />} title="Stop-Words" desc="Stop words list for different languages in PHP, JSON, and other formats." tags={['Data', 'NLP', 'JSON']} stats="1M+ DLs" index={6} />
          <ProjectCard icon={<Cloud aria-hidden="true" />} title="weather" desc="Weather API wrapper for PHP. Simple access to OpenWeatherMap." tags={['PHP', 'API', 'Weather']} stats="500K+ DLs" index={7} />
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <a href="https://github.com/voku" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-current rounded-full font-bold uppercase tracking-widest hover:bg-[var(--theme-primary)] hover:text-[var(--theme-bg)] hover:border-[var(--theme-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current" aria-label="View GitHub Profile (opens in a new tab)">
            <Github size={20} aria-hidden="true" /> View GitHub Profile
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({ icon, title, desc, tags, stats, index }: { icon: React.ReactNode, title: string, desc: string, tags: string[], stats: string, index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05, type: "spring", bounce: 0.2 }}
      whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className="card-bg p-6 rounded-2xl flex flex-col h-full group cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4 w-full">
        <motion.div 
          className="opacity-80 group-hover:opacity-100 transition-opacity p-3 subtle-bg rounded-xl"
          whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
        >
          {icon}
        </motion.div>
        <div className="text-xs font-mono opacity-60 subtle-bg px-3 py-1 rounded-full">{stats}</div>
      </div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-current transition-colors">{title}</h3>
      <p className="opacity-70 text-sm mb-6 flex-grow leading-relaxed">{desc}</p>
      <div className="flex flex-wrap gap-2 mt-auto">
        {tags.map(tag => (
          <span key={tag} className="text-xs font-mono opacity-50 border border-current/30 px-2 py-1 rounded-md">{tag}</span>
        ))}
      </div>
    </motion.div>
  );
}

function ExperienceCard({ title, company, period, icon, details, impact }: { title: string, company: string, period: string, icon: React.ReactNode, details: string[], impact: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
      className="card-bg p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-start group"
    >
      <div className="opacity-80 p-4 subtle-bg rounded-xl shrink-0 mt-1">
        {icon}
      </div>
      <div className="flex-grow">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
          <h3 className="text-2xl font-bold group-hover:text-current transition-colors">{title}</h3>
          <span className="text-sm font-mono opacity-60 subtle-bg px-3 py-1 rounded-full mt-2 md:mt-0 self-start md:self-auto">{period}</span>
        </div>
        <h4 className="text-lg opacity-90 mb-4 font-semibold">{company}</h4>
        <ul className="list-disc list-inside space-y-2 opacity-80 mb-6 text-sm leading-relaxed">
          {details.map((detail, idx) => (
            <li key={idx}>{detail}</li>
          ))}
        </ul>
        <div className="subtle-bg p-4 rounded-lg border border-current/10">
          <p className="text-sm font-medium"><span className="opacity-60 uppercase tracking-wider text-xs mr-2">Impact:</span> {impact}</p>
        </div>
      </div>
    </motion.div>
  );
}

function WhyHireSection() {
  return (
    <section id="whyme" className="min-h-[120vh] flex flex-col justify-center px-6 py-32 relative">
      <div className="max-w-6xl mx-auto w-full z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 border-b-4 border-current pb-4 inline-block">WHY HIRE LARS?</h2>
          <p className="text-2xl font-bold max-w-3xl mb-12">Not just a coder, but a builder of reliable, scalable, and future-proof systems.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <WhyCard 
            icon={<Cpu size={32} aria-hidden="true" />} 
            title="Technical Expertise" 
            desc="Mastery of PHP, backend systems, and modern frameworks ensures robust, scalable solutions." 
            index={0}
          />
          <WhyCard 
            icon={<Globe size={32} aria-hidden="true" />} 
            title="Open Source Leadership" 
            desc="Libraries used globally, showing initiative, innovation, and community impact." 
            index={1}
          />
          <WhyCard 
            icon={<Building size={32} aria-hidden="true" />} 
            title="Enterprise Experience" 
            desc="Works at REMONDIS IT, handling complex IT services for large-scale operations." 
            index={2}
          />
          <WhyCard 
            icon={<Puzzle size={32} aria-hidden="true" />} 
            title="Problem-Solving" 
            desc="Focus on clean code, testing, and static analysis reduces bugs and improves maintainability." 
            index={3}
          />
          <WhyCard 
            icon={<Layers size={32} aria-hidden="true" />} 
            title="Versatility" 
            desc="Full-stack skills (backend + frontend) and DevOps knowledge make him adaptable across teams." 
            index={4}
          />
          <WhyCard 
            icon={<Users size={32} aria-hidden="true" />} 
            title="Collaboration" 
            desc="Active in developer communities, sharing knowledge via GitHub, YouTube, and blogs." 
            index={5}
          />
        </div>
      </div>
    </section>
  );
}

function WhyCard({ icon, title, desc, index }: { icon: React.ReactNode, title: string, desc: string, index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      className="card-bg p-8 flex flex-col gap-6 group"
    >
      <div className="text-[var(--theme-secondary)] group-hover:text-[var(--theme-primary)] transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-bold uppercase tracking-wide">{title}</h3>
      <p className="opacity-90 text-lg leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function ResumeSection() {
  return (
    <section id="resume" className="min-h-[120vh] flex flex-col justify-center px-6 py-32 relative">
      <div className="max-w-4xl mx-auto w-full z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 border-b-2 border-current pb-4 inline-block">Professional Experience</h2>
          <p className="text-xl opacity-80 max-w-2xl">20+ Jahre Erfahrung in der Entwicklung geschäftskritischer Systeme. Fokus auf Legacy-Modernisierung, Architektur-Entscheidungen und nachhaltige Codequalität.</p>
        </motion.div>

        <div className="space-y-8">
          <ExperienceCard 
            title="Senior PHP Developer" 
            company="REMONDIS IT Services" 
            period="seit 2020" 
            icon={<Briefcase aria-hidden="true" />}
            details={[
              "PHP 8.x, Symfony, Docker, Kubernetes, CI/CD, GitHub Actions",
              "PHPStan Level 9, PHPUnit, TDD, Rector, php-cs-fixer",
              "REST API Design, MySQL, MariaDB, Redis, Performance Optimization",
              "Legacy Modernization, OOP / SOLID, Code Review, Mentoring"
            ]}
            impact="Stabilisierung und Weiterentwicklung geschäftskritischer interner Plattformen"
          />
          <ExperienceCard 
            title="Senior Developer" 
            company="IONOS" 
            period="2018–2020" 
            icon={<Briefcase aria-hidden="true" />}
            details={[
              "PHP 8.x, Symfony, Laravel, Microservices, Docker, CI/CD",
              "REST APIs, PostgreSQL, Redis, Scalable Architecture",
              "PHPUnit, Static Analysis, Team Lead, Agile/Scrum"
            ]}
            impact="Ausbau wartbarer Service-Strukturen für skalierbare Hosting-nahe Workflows"
          />
          <ExperienceCard 
            title="PHP Developer" 
            company="MEERX" 
            period="2013–2018" 
            icon={<Briefcase aria-hidden="true" />}
            details={[
              "PHP, Symfony, MySQL, REST API, Git, Composer",
              "OOP, Design Patterns, Clean Code, PHPUnit"
            ]}
            impact="Aufbau solider Backend-Fundamente und API-first-Entwicklung in Kundenprojekten"
          />
        </div>
      </div>
    </section>
  );
}

function CyberpunkSection() {
  return (
    <section id="cyberpunk" className="min-h-[120vh] flex flex-col justify-center px-6 py-32 relative overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(var(--theme-primary) 1px, transparent 1px), linear-gradient(90deg, var(--theme-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="max-w-5xl mx-auto w-full z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <Zap className="text-[var(--theme-accent)] w-12 h-12" aria-hidden="true" />
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-widest">NEURO-LINK // SYSTEM UPGRADES</h2>
          </div>
          <p className="text-xl opacity-80 max-w-3xl">Injecting modern architecture into legacy mainframes. Elevating system performance and neutralizing technical debt.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-bg p-8 rounded-xl border-l-4 border-l-[var(--theme-primary)]"
          >
            <div className="flex items-center gap-3 mb-4 text-[var(--theme-primary)]">
              <Database className="w-6 h-6" aria-hidden="true" />
              <h3 className="text-2xl font-bold">Legacy Override</h3>
            </div>
            <p className="mb-4 opacity-80">Refactoring monolithic PHP structures into modular, high-performance micro-services.</p>
            <ul className="space-y-4 font-mono text-sm opacity-80">
              <li><span className="text-[var(--theme-secondary)]">[EXEC]</span> PHP 5 to 8.x Migration</li>
              <li><span className="text-[var(--theme-secondary)]">[EXEC]</span> Symfony Framework Integration</li>
              <li><span className="text-[var(--theme-secondary)]">[EXEC]</span> Decoupling Business Logic</li>
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-bg p-8 rounded-xl border-l-4 border-l-[var(--theme-secondary)]"
          >
            <div className="flex items-center gap-3 mb-4 text-[var(--theme-secondary)]">
              <Shield className="w-6 h-6" aria-hidden="true" />
              <h3 className="text-2xl font-bold">Static Analysis ICE</h3>
            </div>
            <p className="mb-4 opacity-80">Deploying automated scripts to build impenetrable code quality defenses.</p>
            <div className="code-block p-4 rounded font-mono text-xs text-[var(--theme-secondary)]">
              {`> INITIALIZING PHPSTAN LEVEL 9...
> DEPLOYING RECTOR AUTOMATION...
> ENFORCING STRICT TYPES...
> STATUS: IMPENETRABLE`}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-bg p-8 rounded-xl border-l-4 border-l-[var(--theme-accent)] md:col-span-2"
          >
            <div className="flex items-center gap-3 mb-4 text-[var(--theme-accent)]">
              <Cpu className="w-6 h-6" aria-hidden="true" />
              <h3 className="text-2xl font-bold">Performance Implants</h3>
            </div>
            <p className="opacity-80">Optimizing database queries and implementing Redis caching layers for sub-millisecond response times. Creator of high-performance libraries like portable-utf8.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function EngineeringSection() {
  return (
    <section id="engineering" className="min-h-[120vh] flex flex-col justify-center px-6 py-32 relative">
      <div className="max-w-4xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="card-bg p-1 mb-8 shadow-2xl shadow-[var(--theme-secondary)]/20"
        >
          <div className="bg-[var(--theme-primary)] text-[var(--theme-bg)] px-4 py-2 font-bold flex justify-between items-center">
            <span className="flex items-center gap-2"><TerminalSquare size={18} aria-hidden="true" /> root@voku:~# ./differentiator.sh</span>
            <span className="animate-pulse" aria-hidden="true">_</span>
          </div>
          <div className="p-6 md:p-10 space-y-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <GitBranch className="text-[var(--theme-primary)]" aria-hidden="true" /> Developer Infrastructure (DX)
              </h3>
              <ul className="list-none space-y-3 font-mono text-lg">
                <li className="flex gap-4"><span className="opacity-50">01</span> Static analysis pipelines</li>
                <li className="flex gap-4"><span className="opacity-50">02</span> Coding standards</li>
                <li className="flex gap-4"><span className="opacity-50">03</span> Tooling & CI integration</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-12"
            >
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Cpu className="text-[var(--theme-primary)]" aria-hidden="true" /> The Unique Edge
              </h3>
              <div className="border-l-2 border-[var(--theme-primary)] pl-6 py-2 font-mono text-lg space-y-2">
                <p>enterprise experience</p>
                <p>+ open source maintainer</p>
                <p>+ architecture thinking</p>
                <p>+ AI workflow experimentation</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-12 pt-8 border-t border-[var(--theme-primary)]/30"
            >
              <p className="opacity-70 font-mono text-sm leading-relaxed">
                /* Most "architects" in companies are just senior developers who attend more meetings.
                You, on the other hand, seem to spend your time fixing ecosystems, writing libraries, analyzing systems, and documenting ideas. */
              </p>
              <p className="mt-4 font-bold animate-pulse text-[var(--theme-primary)]">EOF_</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
