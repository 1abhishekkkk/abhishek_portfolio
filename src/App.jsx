import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Video, Palette, Play, Menu, X, 
  Instagram, Linkedin, Mail, ArrowRight,
  MonitorPlay, Aperture, Layers, CheckCircle2,
  Sparkles, Clapperboard, Lightbulb, Smartphone,
  Phone, MessageCircle, Pause, Volume2, VolumeX
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import ParticleBackground from './ParticleBackground';
import VideoBackground from './components/VideoBackground';
import { HeroAvatar, FloatingAvatar } from './Avatar3D';
import { portfolioConfig, services } from './portfolioData';
import ShowreelSection from './components/ShowreelSection';
import LongFormSection from './components/LongFormSection';
import ColorGradingSection from './components/ColorGradingSection';
import InstagramFeed from './components/InstagramFeed';
import InstagramFeedLive from './components/InstagramFeedLive';
import Toasts from './components/Toasts';
const App = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [modalItem, setModalItem] = useState(null);
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

  // Use projects from portfolioData.js with fallback
  const projects = portfolioConfig?.projects || [];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

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
      <ParticleBackground />
      
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
            
            <div className="hidden md:flex gap-12 sans-minimal">
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
            {/* Cinematic Background Video - Strictly for Hero */}
            <VideoBackground src="/reels/anshika-montage.mp4" />
            
            <div className="text-center z-20 mt-12">
              <div className="sans-minimal mb-6 text-amber-500 opacity-80 animate-fade-in-up">
                {portfolioConfig?.personal?.availability}
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

            {/* Bottom Info Bar - Minimal Jiyad Style */}
            <div className="absolute bottom-12 left-0 w-full px-8 md:px-16 flex flex-col md:flex-row justify-between items-center sans-minimal text-white/40">
              <div className="flex items-center gap-6 mb-6 md:mb-0 w-full md:w-auto justify-between md:justify-start">
                <span>Est 2021</span>
                <div className="flex-grow md:w-48 h-[1px] bg-white/10 mx-4"></div>
              </div>
              <div className="mb-6 md:mb-0 text-white/80 tracking-[0.5em]">{portfolioConfig?.personal?.location.toUpperCase()}</div>
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="flex-grow md:w-48 h-[1px] bg-white/10 mx-4"></div>
                <span>{portfolioConfig?.personal?.profession.split(',')[0].toUpperCase()}</span>
              </div>
            </div>
          </section>

          {/* Services/About Section */}
          <section id="services" className="py-32 px-8 md:px-16 bg-neutral-950 relative overflow-hidden">
            <div className="max-w-[1600px] mx-auto">
              <div className="grid lg:grid-cols-2 gap-20 items-start">
                {/* Left: Big Image Placeholder */}
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

                {/* Right: Text Content */}
                <div className="flex flex-col pt-10">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="sans-minimal text-amber-500 mb-8"
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
                        <div className="sans-minimal text-white/30">0{index + 1} / {service.title}</div>
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
          <section id="showreel" className="py-20">
            <ShowreelSection />
          </section>

          {/* Color Grading Section */}
          <ColorGradingSection />

          {/* Instagram Feed Section - Live */}
          <InstagramFeedLive />

          {/* Long Form Content Section */}
          <section id="longform" className="py-20">
            <LongFormSection />
          </section>

          {/* AI Vision Section */}
          <section id="ai-vision" className="py-24 px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-sm text-amber-500 mb-4">
                  <Sparkles size={14} /> AI-Powered
                </div>
                <h2 className="text-4xl font-bold mb-4">Creative Vision Generator</h2>
                <p className="text-neutral-400 max-w-2xl mx-auto">
                  Describe your vision and let AI generate creative concepts, color palettes, and styling ideas.
                </p>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Describe your vision</label>
                    <textarea
                      value={visionInput}
                      onChange={(e) => setVisionInput(e.target.value)}
                      placeholder="E.g., 'A futuristic cyberpunk cityscape at night with neon lights'"
                      className="w-full h-32 bg-black/30 border border-white/10 rounded-lg p-4 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                  
                  <button
                    onClick={generateVision}
                    disabled={isGenerating || !visionInput.trim()}
                    className="w-full py-3 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        Generate Vision
                      </>
                    )}
                  </button>
                  
                  {aiError && (
                    <div className="text-red-400 text-sm text-center mt-2">{aiError}</div>
                  )}
                </div>
                
                {visionResult && (
                  <div className="mt-8 border-t border-white/10 pt-8">
                    <h3 className="text-2xl font-bold mb-6">{visionResult.title}</h3>
                    <p className="text-neutral-300 mb-6">"{visionResult.logline}"</p>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-3">Color Palette</h4>
                        <div className="flex h-12 rounded-lg overflow-hidden border border-white/10">
                          {visionResult.colorPalette.map((color, i) => (
                            <div 
                              key={i} 
                              className="flex-1 group relative"
                              style={{ backgroundColor: color }}
                              title={color}
                            >
                              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {color}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-3">Mood</h4>
                        <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                          <p className="text-amber-400">{visionResult.mood}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h4 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-3">Shot Ideas</h4>
                      <ul className="space-y-3">
                        {visionResult.shotIdeas.map((idea, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-neutral-300">{idea}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-white/10">
                      <button 
                        onClick={() => scrollToSection('contact')}
                        className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg font-medium transition-all"
                      >
                        Let's Bring This to Life
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-24 px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Let's Work Together</h2>
                <p className="text-neutral-400 max-w-2xl mx-auto">
                  Have a project in mind? I'd love to hear about it. Send me a message and let's create something amazing together.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Email</h3>
                      <a href={`mailto:${portfolioConfig?.personal?.email || "abhishek274kumar@gmail.com"}`} className="text-neutral-400 hover:text-white transition-colors">
                        {portfolioConfig?.personal?.email || "abhishek274kumar@gmail.com"}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Phone</h3>
                      <div className="space-y-1">
                        <a href={`tel:${portfolioConfig?.personal?.phone || "+918957562928"}`} className="text-neutral-400 hover:text-white transition-colors block">
                          {portfolioConfig?.personal?.phone || "+91 89575 62928"}
                        </a>
                        {portfolioConfig?.personal?.phone2 && (
                          <a href={`tel:${portfolioConfig.personal.phone2}`} className="text-neutral-400 hover:text-white transition-colors block">
                            {portfolioConfig.personal.phone2}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">WhatsApp</h3>
                      <a 
                        href={`https://wa.me/${portfolioConfig?.personal?.whatsapp || "919876543210"}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-white transition-colors"
                      >
                        Chat on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
                
                <form className="space-y-4" onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const formData = new FormData(form);
                  // Honeypot values
                  const website = formData.get('website');
                  const ts = formData.get('ts');
                  
                  if (website) {
                    return; // silently drop spam bots that fill honeypot
                  }
                  
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
                    const data = await res.json();
                    if (res.ok) {
                      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message: 'Thanks! Your message was sent.' } }));
                      form.reset();
                    } else {
                      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', message: data?.error || 'Something went wrong.' } }));
                    }
                  } catch (err) {
                    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', message: 'Network error. Please try again.' } }));
                  }
                }}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-1">Name</label>
                      <input 
                        name="name"
                        type="text" 
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
                      <input 
                        name="email"
                        type="email" 
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Subject</label>
                    <input 
                      name="subject"
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition-all"
                      placeholder="What's this about? (optional)"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Message</label>
                    <textarea 
                      name="message"
                      rows="4"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition-all resize-none"
                      placeholder="Tell me about your project..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-all"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </section>
        </main>

        {/* Toasts */}
        <Toasts />

        {/* Footer */}
        <footer className="border-t border-white/10 py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-neutral-500">
                &copy; {new Date().getFullYear()} Abhi Clicks. All rights reserved.
              </div>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <a 
                  href={portfolioConfig?.social?.instagram || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href={portfolioConfig?.social?.linkedin || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Avatar */}
      <FloatingAvatar />

      {/* Project Modal */}
      {modalItem && (
        <div 
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setModalItem(null)}
        >
          <div 
            className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-neutral-900 rounded-xl border border-white/10"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-neutral-900/80 backdrop-blur-sm p-4 flex justify-between items-center border-b border-white/10 z-10">
              <h3 className="text-xl font-bold">{modalItem.title}</h3>
              <button 
                onClick={() => setModalItem(null)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="aspect-video w-full bg-black">
              {modalItem.videoSrc ? (
                <video 
                  src={modalItem.videoSrc} 
                  controls 
                  autoPlay 
                  className="w-full h-full object-contain"
                />
              ) : (
                <img 
                  src={modalItem.image} 
                  alt={modalItem.title}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-white/5 text-sm rounded-full border border-white/10">
                  {modalItem.category}
                </span>
                {modalItem.duration && (
                  <span className="px-3 py-1 bg-white/5 text-sm rounded-full border border-white/10">
                    {modalItem.duration}
                  </span>
                )}
              </div>
              
              <p className="text-neutral-300 mb-6">{modalItem.desc}</p>
              
              {modalItem.palette && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-neutral-400 mb-3">Color Palette</h4>
                  <div className="flex gap-2">
                    {modalItem.palette.map((color, i) => (
                      <div 
                        key={i} 
                        className="w-8 h-8 rounded-full border border-white/10"
                        style={{ backgroundColor: color }}
                        title={color}
                      ></div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-8 pt-6 border-t border-white/10">
                <button
                  onClick={() => {
                    setModalItem(null);
                    scrollToSection('contact');
                  }}
                  className="w-full py-3 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-all"
                >
                  Start a Project Like This
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;