import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Video, Palette, Play, Menu, X, 
  Instagram, Linkedin, Mail, ArrowRight,
  MonitorPlay, Aperture, Layers, CheckCircle2,
  Sparkles, Clapperboard, Lightbulb, Smartphone,
  Phone, MessageCircle, Pause, Volume2, VolumeX
} from 'lucide-react';
import ParticleBackground from './ParticleBackground';
import { HeroAvatar, FloatingAvatar } from './Avatar3D';
import { portfolioConfig, services } from './portfolioData';
import ShowreelSection from './components/ShowreelSection';
import LongFormSection from './components/LongFormSection';
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
      {/* Background with 3D effect */}
      <ParticleBackground />
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-white/5 backdrop-blur-xl border-b border-white/10 py-4 shadow-lg shadow-black/10' 
            : 'bg-white/3 backdrop-blur-md py-6'
        }`}>
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <div className="text-2xl font-bold tracking-tighter flex items-center gap-2 group">
              <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse group-hover:scale-125 transition-transform duration-300"></div>
              <span className="group-hover:text-amber-400 transition-colors duration-300">
                {portfolioConfig?.personal?.name || "ABHI"}
              </span>
              <span className="text-neutral-500 group-hover:text-neutral-400 transition-colors duration-300">
                {portfolioConfig?.personal?.tagline || "CLICKS"}
              </span>
            </div>
            
            <div className="hidden md:flex gap-2 text-sm font-medium">
              <button 
                onClick={() => scrollToSection('hero')} 
                className="px-4 py-2 text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg backdrop-blur-sm border border-transparent hover:border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/5"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('showreel')} 
                className="px-4 py-2 text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg backdrop-blur-sm border border-transparent hover:border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/5"
              >
                Showreel
              </button>
              <button 
                onClick={() => scrollToSection('services')} 
                className="px-4 py-2 text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg backdrop-blur-sm border border-transparent hover:border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/5"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('ai-vision')} 
                className="px-4 py-2 text-neutral-300 hover:text-amber-400 hover:bg-amber-500/5 rounded-lg backdrop-blur-sm border border-transparent hover:border-amber-500/20 transition-all duration-300 hover:scale-105 flex items-center gap-1 hover:shadow-lg hover:shadow-amber-500/10"
              >
                <Sparkles size={14} className="animate-pulse"/> AI Vision
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="px-5 py-2 bg-white/80 text-black rounded-full hover:bg-white/90 hover:scale-105 transition-all duration-300 font-semibold backdrop-blur-sm border border-white/10 hover:shadow-lg hover:shadow-white/20"
              >
                Let's Talk
              </button>
            </div>
            
            <button 
              className="md:hidden text-white hover:text-amber-400 hover:bg-white/10 p-2 rounded-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-transparent hover:border-white/20" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-white/8 backdrop-blur-3xl border-t border-white/20 z-40 shadow-xl shadow-black/20">
              <div className="p-6 space-y-3">
                <button 
                  onClick={() => { scrollToSection('hero'); setIsMenuOpen(false); }}
                  className="w-full text-left py-3 px-4 text-neutral-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  Home
                </button>
                <button 
                  onClick={() => { scrollToSection('showreel'); setIsMenuOpen(false); }}
                  className="w-full text-left py-3 px-4 text-neutral-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  Showreel
                </button>
                <button 
                  onClick={() => { scrollToSection('services'); setIsMenuOpen(false); }}
                  className="w-full text-left py-3 px-4 text-neutral-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  Services
                </button>
                <button 
                  onClick={() => { scrollToSection('ai-vision'); setIsMenuOpen(false); }}
                  className="w-full text-left py-3 px-4 text-neutral-300 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <Sparkles size={14} className="animate-pulse"/> AI Vision
                </button>
                <button 
                  onClick={() => { scrollToSection('contact'); setIsMenuOpen(false); }}
                  className="w-full mt-3 py-3 bg-amber-500 text-black rounded-lg font-semibold hover:bg-amber-400 transition-all duration-200"
                >
                  Let's Talk
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <main>
          <section id="hero" className="min-h-screen flex items-center justify-center pt-20 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh] lg:min-h-auto">
                {/* 3D Avatar - Show First on Mobile */}
                <div className="order-1 lg:order-2 relative w-full flex justify-center">
                  <div className="relative z-10 w-full max-w-xs sm:max-w-sm lg:max-w-md">
                    <HeroAvatar className="w-full h-[300px] sm:h-[400px] lg:h-[500px]" />

                  </div>
                  {/* Decorative elements */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-blue-500/10 rounded-full blur-3xl -z-10 scale-75"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl -z-10"></div>
                </div>

                {/* Text Content - Show Below Avatar on Mobile */}
                <div className="text-center lg:text-left order-2 lg:order-1 px-4 lg:px-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-widest mb-4 lg:mb-6 text-amber-500 font-semibold">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    {portfolioConfig?.personal?.availability || "Available for freelance"}
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 lg:mb-8 leading-[1.1]">
                    Crafting Stories Through <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-neutral-400 to-neutral-600">Light & Color</span>
                  </h1>
                  <p className="text-base sm:text-lg lg:text-xl text-neutral-400 max-w-lg lg:max-w-2xl mx-auto lg:mx-0 mb-8 lg:mb-10 font-light leading-relaxed">
                    {portfolioConfig?.personal?.description || "Professional Photographer, Video Editor, and Colorist helping brands and creatives achieve the perfect cinematic look."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start mb-8 lg:mb-0">
                    <button onClick={() => scrollToSection('showreel')} className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 group text-sm sm:text-base">
                      View Showreel <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button onClick={() => scrollToSection('contact')} className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent border border-white/20 text-white rounded-full font-semibold hover:bg-white/5 transition-all text-sm sm:text-base">
                      Pitch Your Project
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section id="services" className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold mb-12 text-center">What I Do</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {services.map((service, index) => {
                  const IconComponent = service.icon === 'Aperture' ? Aperture : 
                                       service.icon === 'Video' ? Video : Palette;
                  return (
                    <div key={index} className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-amber-500/30 hover:bg-white/8 transition-all duration-300 group hover:scale-105 hover:shadow-xl hover:shadow-white/5">
                      <div className="w-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg flex items-center justify-center mb-6 text-amber-500 group-hover:scale-110 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-amber-500/10">
                        <IconComponent size={24} />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-amber-400 transition-colors duration-300">{service.title}</h3>
                      <p className="text-neutral-400 group-hover:text-neutral-300 mb-6 leading-relaxed transition-colors duration-300">
                        {service.description}
                      </p>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-2 text-sm text-neutral-500 group-hover:text-neutral-400 transition-colors duration-300">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Showreel Section */}
          <section id="showreel" className="py-20">
            <ShowreelSection />
          </section>

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