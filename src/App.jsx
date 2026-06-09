import React, { useState, useEffect, Suspense } from 'react';
import { 
  X, Menu, Instagram, Linkedin, Mail, ArrowRight,
  Sparkles, Phone, MessageCircle, Play
} from 'lucide-react';
import { motion } from 'framer-motion';
import VideoBackground from './components/VideoBackground';
import { portfolioConfig, services } from './portfolioData';
import Toasts from './components/Toasts';

const ParticleBackground = React.lazy(() => import('./ParticleBackground'));
const FloatingAvatar = React.lazy(() => import('./Avatar3D').then(m => ({ default: m.FloatingAvatar })));
const ShowreelSection = React.lazy(() => import('./components/ShowreelSection'));
const LongFormSection = React.lazy(() => import('./components/LongFormSection'));
const ColorGradingSection = React.lazy(() => import('./components/ColorGradingSection'));
const InstagramFeedLive = React.lazy(() => import('./components/InstagramFeedLive'));

const BrandProofSection = () => (
  <section className="py-24 px-6 bg-neutral-950 border-y border-white/5">
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-12">
        <div>
          <div className="sans-minimal text-amber-500 mb-4 font-black tracking-widest uppercase">Trusted Output</div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] text-white">
            Built for <span className="text-amber-500">brands</span> that move fast
          </h2>
        </div>
        <p className="text-lg md:text-xl text-white/60 font-medium max-w-xl">
          Launch edits, event films, color finishes, and social cuts shaped for teams that need polished work without slow production drag.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {portfolioConfig.brandPartners.map((brand) => (
          <div key={brand.name} className="rounded-2xl border border-white/5 bg-white/5 p-6 hover:bg-white/10 transition-all group">
            <div className="text-3xl font-black tracking-tighter uppercase mb-3 text-white group-hover:text-amber-500 transition-colors">{brand.name}</div>
            <p className="text-sm text-white/50 font-semibold leading-relaxed">{brand.detail}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CaseStudiesSection = () => (
  <section id="case-studies" className="py-32 px-6 bg-neutral-950">
    <div className="max-w-[1400px] mx-auto">
      <div className="text-center mb-16">
        <div className="sans-minimal text-amber-500 mb-4 font-black tracking-widest uppercase">Case Studies</div>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-white">Proof, not just pretty cuts</h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {portfolioConfig.caseStudies.map((study) => (
          <article key={study.title} className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-8 flex flex-col min-h-[520px] hover:border-amber-500/20 transition-all">
            <div className="flex items-center justify-between gap-4 mb-10">
              <span className="text-[10px] font-black tracking-[0.3em] text-amber-500 uppercase">{study.client}</span>
              <span className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-500" />
              </span>
            </div>

            <h3 className="text-3xl font-black tracking-tighter uppercase mb-6 text-white">{study.title}</h3>
            <div className="space-y-5 text-white/60 font-medium leading-relaxed">
              <p><span className="text-white font-black">Goal:</span> {study.goal}</p>
              <p><span className="text-white font-black">Role:</span> {study.role}</p>
              <p><span className="text-white font-black">Output:</span> {study.output}</p>
            </div>

            <div className="mt-auto pt-8">
              <p className="text-amber-500 font-bold mb-5 tracking-tight">{study.result}</p>
              <div className="flex flex-wrap gap-2">
                {study.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const ServicePackagesSection = ({ onContact }) => (
  <section id="packages" className="py-32 px-6 bg-neutral-950">
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-16">
        <div>
          <div className="sans-minimal text-amber-500 mb-4 font-black tracking-widest uppercase">Packages</div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] text-white">
            Clear ways <br /> to start
          </h2>
        </div>
        <button
          onClick={onContact}
          className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-amber-500 text-black text-xs font-black uppercase tracking-widest hover:bg-white transition-all"
        >
          Discuss a project <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {portfolioConfig.servicePackages.map((pack) => (
          <div key={pack.title} className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-8 hover:bg-white/[0.05] transition-all">
            <h3 className="text-3xl font-black tracking-tighter uppercase mb-4 text-white">{pack.title}</h3>
            <p className="text-white/50 font-medium mb-8 leading-relaxed italic text-sm">"{pack.bestFor}"</p>
            <div className="space-y-4">
              {pack.deliverables.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                  </div>
                  <span className="font-semibold text-white/70 text-sm tracking-tight">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visionInput, setVisionInput] = useState('');
  const [visionResult, setVisionResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const generateVision = async () => {
    if (!visionInput.trim()) return;
    setIsGenerating(true);
    setAiError(null);
    setVisionResult(null);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: visionInput })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'AI request failed');
      }
      setVisionResult(data);
    } catch (error) {
      console.error("AI Generation Error:", error);
      setAiError(error.message || "Could not generate vision. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white font-sans selection:bg-amber-500 selection:text-black">
      {/* Global Particle Background */}
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className={`fixed w-full z-50 transition-all duration-700 ${
          scrolled 
            ? 'bg-black/40 backdrop-blur-xl border-b border-white/5 py-4' 
            : 'bg-transparent py-8'
        }`}>
          <div className="max-w-[1800px] mx-auto px-8 md:px-12 flex justify-between items-center">
            <div className="text-xl font-bold tracking-tighter flex items-center gap-2 group cursor-pointer" onClick={() => scrollToSection('hero')}>
              <span className="group-hover:text-amber-400 transition-colors duration-300">
                {portfolioConfig?.personal?.name.toUpperCase() || "ABHI"}
              </span>
              <span className="text-neutral-500 font-light group-hover:text-neutral-300 transition-colors duration-300">
                {portfolioConfig?.personal?.tagline.toUpperCase() || "CLICKS"}
              </span>
            </div>
            
            <div className="hidden md:flex gap-12 sans-minimal items-center text-xs font-bold tracking-widest uppercase">
              <button onClick={() => scrollToSection('showreel')} className="hover:text-amber-400 transition-colors">Works</button>
              <button onClick={() => scrollToSection('services')} className="hover:text-amber-400 transition-colors">Services</button>
              <button onClick={() => scrollToSection('color-grading')} className="hover:text-amber-400 transition-colors">Coloring</button>
              <button onClick={() => scrollToSection('contact')} className="text-amber-500 border-b border-amber-500/30 pb-1">Contact</button>
            </div>
            
            <button 
              className="md:hidden text-white p-2" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-black/90 backdrop-blur-3xl border-t border-white/10 z-40">
              <div className="p-8 space-y-6 sans-minimal text-center">
                <button onClick={() => { scrollToSection('showreel'); setIsMenuOpen(false); }} className="block w-full text-lg">Works</button>
                <button onClick={() => { scrollToSection('services'); setIsMenuOpen(false); }} className="block w-full text-lg">Services</button>
                <button onClick={() => { scrollToSection('color-grading'); setIsMenuOpen(false); }} className="block w-full text-lg">Coloring</button>
                <button onClick={() => { scrollToSection('contact'); setIsMenuOpen(false); }} className="block w-full text-lg text-amber-500">Contact</button>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <main>
          <section id="hero" className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
            <VideoBackground src="https://res.cloudinary.com/de6kkxnqn/video/upload/f_auto,q_auto/v1777628360/reels/anshika-montage.mp4" />
            
            <div className="text-center z-20 mt-12">
              <div className="sans-minimal mb-6 text-amber-500 opacity-80 animate-fade-in-up">
                {portfolioConfig?.personal?.availability.toUpperCase()}
              </div>
              <h1 className="text-[10vw] md:text-[6vw] lg:text-[100px] font-black tracking-tighter leading-none flex flex-col items-center justify-center select-none">
                <div className="flex flex-col md:flex-row items-center justify-center gap-x-4">
                  <span className="serif-italic bg-clip-text text-transparent bg-gradient-to-b from-white via-white/80 to-white/20 uppercase">
                    Crafting,
                  </span>
                  <span className="text-white uppercase font-sans animate-fade-in-up">
                    Creating.
                  </span>
                </div>
                <div className="text-lg md:text-xl lg:text-2xl mt-6 font-light tracking-[0.4em] text-white/60 uppercase">
                  through Light & Color
                </div>
              </h1>
              <p className="max-w-xl mx-auto mt-8 text-white/60 font-light text-sm md:text-base leading-relaxed tracking-wide px-4">
                {portfolioConfig?.personal?.description}
              </p>
            </div>

            {/* Bottom Info Bar */}
            <div className="absolute bottom-12 left-0 w-full px-8 md:px-16 flex flex-col md:flex-row justify-between items-center sans-minimal text-white/40">
              <div className="flex items-center gap-6 mb-6 md:mb-0 w-full md:w-auto justify-between md:justify-start">
                <span>EST 2021</span>
                <div className="flex-grow md:w-48 h-[1px] bg-white/10 mx-4"></div>
              </div>
              <div className="mb-6 md:mb-0 text-white/80 tracking-[0.5em]">{portfolioConfig?.personal?.location.toUpperCase()}</div>
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="flex-grow md:w-48 h-[1px] bg-white/10 mx-4"></div>
                <span>{portfolioConfig?.personal?.profession.split(',')[0].toUpperCase()}</span>
              </div>
            </div>
          </section>

          <BrandProofSection />

          {/* Services/About Section */}
          <section id="services" className="py-32 px-8 md:px-16 bg-neutral-950 relative overflow-hidden">
            <div className="max-w-[1600px] mx-auto">
              <div className="grid lg:grid-cols-2 gap-20 items-start">
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-neutral-900 grayscale hover:grayscale-0 transition-all duration-1000">
                    <img 
                      src="/images/abhishek-about.jpg" 
                      alt="Abhishek Kumar" 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2000&auto=format&fit=crop";
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r border-b border-amber-500/30"></div>
                </motion.div>

                <div className="flex flex-col pt-10">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="sans-minimal text-amber-500 mb-8 font-bold tracking-widest uppercase"
                  >
                    About Me
                  </motion.div>
                  
                  <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="text-5xl md:text-7xl font-bold tracking-tighter mb-12 uppercase leading-none"
                  >
                    Driven by <br />
                    <span className="serif-italic lowercase text-white/40">visual</span> storytelling
                  </motion.h2>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="text-xl md:text-2xl text-white/80 font-light leading-relaxed mb-12 max-w-2xl"
                  >
                    {portfolioConfig?.personal?.description}
                  </motion.p>

                  <div className="grid sm:grid-cols-2 gap-12 mt-8">
                    {services.map((service, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 + (index * 0.1) }}
                        viewport={{ once: true }}
                        className="flex flex-col gap-4"
                      >
                        <div className="sans-minimal text-white/30 text-[10px] font-bold tracking-widest uppercase">0{index + 1} / {service.title}</div>
                        <div className="w-12 h-[1px] bg-amber-500/50"></div>
                        <p className="text-sm text-white/50 leading-relaxed font-light">
                          {service.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Showreel Section */}
          <section id="showreel" className="py-20 bg-neutral-950">
            <Suspense fallback={<div className="h-96 flex items-center justify-center text-white/20">Loading works...</div>}>
              <ShowreelSection />
            </Suspense>
          </section>

          <CaseStudiesSection />

          {/* Color Grading Section */}
          <section id="color-grading" className="py-20 bg-neutral-900/30">
            <Suspense fallback={<div className="h-96 flex items-center justify-center text-white/20">Loading color work...</div>}>
              <ColorGradingSection />
            </Suspense>
          </section>

          {/* Instagram Feed Section */}
          <section id="instagram" className="py-20">
            <Suspense fallback={<div className="h-96 flex items-center justify-center text-white/20">Loading feed...</div>}>
              <InstagramFeedLive />
            </Suspense>
          </section>

          {/* Long Form Content Section */}
          <section id="longform" className="py-20">
            <Suspense fallback={<div className="h-96 flex items-center justify-center text-white/20">Loading long form...</div>}>
              <LongFormSection />
            </Suspense>
          </section>

          <ServicePackagesSection onContact={() => scrollToSection('contact')} />

          {/* AI Vision Section */}
          <section id="ai-vision" className="py-24 px-6 bg-neutral-950">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-sm text-amber-500 mb-4 uppercase tracking-widest font-bold">
                  <Sparkles size={14} /> AI-Powered
                </div>
                <h2 className="text-4xl md:text-6xl font-bold mb-4 uppercase tracking-tighter">Creative Vision Generator</h2>
                <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
                  Describe your vision and let AI generate creative concepts, color palettes, and styling ideas.
                </p>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 mb-2 uppercase tracking-[0.2em]">Describe your vision</label>
                    <textarea
                      value={visionInput}
                      onChange={(e) => setVisionInput(e.target.value)}
                      placeholder="E.g., 'A futuristic cyberpunk cityscape at night with neon lights'"
                      className="w-full h-40 bg-black/30 border border-white/10 rounded-xl p-6 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition-all resize-none text-lg font-light"
                    />
                  </div>
                  
                  <button
                    onClick={generateVision}
                    disabled={isGenerating || !visionInput.trim()}
                    className="w-full py-5 bg-amber-500 text-black font-bold uppercase tracking-widest rounded-xl hover:bg-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl shadow-amber-500/10"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        Generate Vision
                      </>
                    )}
                  </button>
                  
                  {aiError && (
                    <div className="text-red-400 text-sm text-center mt-2 uppercase font-bold tracking-tighter">{aiError}</div>
                  )}
                </div>
                
                {visionResult && (
                  <div className="mt-12 border-t border-white/10 pt-12 animate-fade-in-up">
                    <h3 className="text-3xl font-bold mb-4 uppercase tracking-tight">{visionResult.title}</h3>
                    <p className="text-neutral-400 text-xl mb-10 italic">"{visionResult.logline}"</p>
                    
                    <div className="grid md:grid-cols-2 gap-10">
                      <div>
                        <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4">Color Palette</h4>
                        <div className="flex h-16 rounded-xl overflow-hidden border border-white/10">
                          {visionResult.colorPalette.map((color, i) => (
                            <div 
                              key={i} 
                              className="flex-1 group relative"
                              style={{ backgroundColor: color }}
                              title={color}
                            >
                              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                {color}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4">Mood</h4>
                        <div className="bg-black/30 border border-white/10 rounded-xl p-5">
                          <p className="text-amber-500 font-medium tracking-wide">{visionResult.mood}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-10">
                      <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4">Shot Ideas</h4>
                      <ul className="grid gap-4">
                        {visionResult.shotIdeas.map((idea, i) => (
                          <li key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="w-6 h-6 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                              {i + 1}
                            </div>
                            <p className="text-neutral-300 font-light">{idea}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-12 pt-8 border-t border-white/10 text-center">
                      <button 
                        onClick={() => scrollToSection('contact')}
                        className="inline-flex items-center gap-2 text-amber-500 hover:text-white transition-colors group uppercase tracking-widest text-xs font-bold"
                      >
                        Let's Bring This to Life <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-40 px-6 bg-neutral-950">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-20 items-center">
                <div>
                  <div className="sans-minimal text-amber-500 mb-8 font-bold tracking-[0.4em] uppercase">Get In Touch</div>
                  <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-12 uppercase leading-[0.85]">
                    Let's Build <br />
                    Something <br />
                    <span className="serif-italic lowercase text-white/30">epic</span>
                  </h2>
                  <p className="text-2xl text-white/60 font-light max-w-md mb-12 leading-relaxed">
                    Have a vision? I have the tools and edit instincts to make it reality.
                  </p>
                  
                  <div className="space-y-10">
                    <div className="flex items-center gap-6 group">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500 transition-all duration-500">
                        <Mail className="w-6 h-6 group-hover:text-black" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase mb-1">Email</div>
                        <a href={`mailto:${portfolioConfig?.personal?.email}`} className="text-xl md:text-2xl font-bold hover:text-amber-500 transition-colors">
                          {portfolioConfig?.personal?.email}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 group">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500 transition-all duration-500">
                        <Phone className="w-6 h-6 group-hover:text-black" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase mb-1">Phone</div>
                        <div className="space-y-1">
                          <a href={`tel:${portfolioConfig?.personal?.phone}`} className="text-xl md:text-2xl font-bold hover:text-amber-500 transition-colors block">
                            {portfolioConfig?.personal?.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/[0.03] p-8 md:p-12 rounded-[2.5rem] border border-white/10 backdrop-blur-sm">
                  <form className="space-y-6" onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const formData = new FormData(form);
                    const payload = {
                      name: formData.get('name'),
                      email: formData.get('email'),
                      message: formData.get('message') || formData.get('subject') || ''
                    };
                    try {
                      const res = await fetch('/api/submit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                      });
                      if (res.ok) {
                        window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message: 'Thanks! Your message was sent.' } }));
                        form.reset();
                      } else {
                        const data = await res.json();
                        window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', message: data?.error || 'Something went wrong.' } }));
                      }
                    } catch {
                      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', message: 'Network error. Please try again.' } }));
                    }
                  }}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 mb-2 uppercase tracking-widest">Name</label>
                        <input name="name" type="text" required className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all" placeholder="YOUR NAME" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 mb-2 uppercase tracking-widest">Email</label>
                        <input name="email" type="email" required className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all" placeholder="EMAIL@EXAMPLE.COM" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-500 mb-2 uppercase tracking-widest">Message</label>
                      <textarea name="message" rows="6" required className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all resize-none" placeholder="TELL ME ABOUT YOUR PROJECT..."></textarea>
                    </div>
                    <button type="submit" className="w-full py-5 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-amber-500 transition-all shadow-xl shadow-white/5">
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 py-20 bg-neutral-950">
          <div className="max-w-[1800px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="text-2xl font-black tracking-tighter">
              {portfolioConfig?.personal?.name.toUpperCase()} <span className="text-neutral-500 font-light">{portfolioConfig?.personal?.tagline.toUpperCase()}</span>
            </div>
            
            <div className="flex gap-10 text-[10px] font-bold tracking-widest uppercase">
              <a href={portfolioConfig?.social?.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors flex items-center gap-2">
                <Instagram size={14} /> Instagram
              </a>
              <a href={portfolioConfig?.social?.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors flex items-center gap-2">
                <Linkedin size={14} /> LinkedIn
              </a>
            </div>
            
            <div className="text-[10px] font-bold text-neutral-600 tracking-widest uppercase">
              &copy; {new Date().getFullYear()} {portfolioConfig?.personal?.fullName}. All rights reserved.
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Avatar */}
      <Suspense fallback={null}>
        <FloatingAvatar />
      </Suspense>

      {/* Toast Notifications */}
      <Toasts />
    </div>
  );
};

export default App;