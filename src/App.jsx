import React, { useState, useEffect, Suspense } from 'react';
import { 
  X, Menu, Instagram, Linkedin, Mail, ArrowRight,
  Sparkles, Phone, MessageCircle, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoBackground from './components/VideoBackground';
import { portfolioConfig, services } from './portfolioData';
import Toasts from './components/Toasts';
import { useLenisGsap } from './lib/motionSetup';

const PackagesMotionShell = React.lazy(() => import('./components/PackagesMotionShell'));
const TseilyMotionLayer = React.lazy(() => import('./components/TseilyMotionLayer'));
const FaqSection = React.lazy(() => import('./components/FaqSection'));
const FooterSection = React.lazy(() => import('./components/FooterSection'));
const BackgroundSong = React.lazy(() => import('./components/BackgroundSong'));

const ShowreelSection = React.lazy(() => import('./components/ShowreelSection'));
const LongFormSection = React.lazy(() => import('./components/LongFormSection'));
const ColorGradingSection = React.lazy(() => import('./components/ColorGradingSection'));
const InstagramFeedLive = React.lazy(() => import('./components/InstagramFeedLive'));
const StatsSection = React.lazy(() => import('./components/StatsSection'));
const LoadingScreen = React.lazy(() => import('./components/LoadingScreen'));
const TestimonialsSection = React.lazy(() => import('./components/TestimonialsSection'));
const WorkProcessSection = React.lazy(() => import('./components/WorkProcessSection'));
const PhotographySection = React.lazy(() => import('./components/PhotographySection'));
const CaseStudiesSection = React.lazy(() => import('./components/CaseStudiesSection'));
const ContactSection = React.lazy(() => import('./components/ContactSection'));
const AdminModal = React.lazy(() => import('./components/AdminModal'));

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

const ServicePackagesSection = ({ onContact }) => (
  <Suspense fallback={null}>
    <PackagesMotionShell>
      <section id="packages" className="py-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-16">
            <div>
              <div data-pkg-reveal className="sans-minimal text-amber-500 mb-4 font-black tracking-widest uppercase">Packages</div>
              <h2 data-pkg-reveal className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] text-white">
                Clear ways <br /> to start
              </h2>
            </div>
            <button
              data-pkg-reveal
              onClick={onContact}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-amber-500 text-black text-xs font-black uppercase tracking-widest hover:bg-white transition-all"
            >
              Discuss a project <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {portfolioConfig.servicePackages.map((pack) => (
              <div key={pack.title} data-pkg-card className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-8 hover:bg-white/[0.05] transition-colors">
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
    </PackagesMotionShell>
  </Suspense>
);

const App = () => {
  useLenisGsap();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Secret admin shortcut (Cmd+Shift+A or Ctrl+Shift+A or ?admin=true in URL)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    if (window.location.search.includes('admin=true')) {
      setIsAdminOpen(true);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock scroll during loading screen
  useEffect(() => {
    if (showLoader) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Refresh GSAP ScrollTrigger positions once loader exits
      requestAnimationFrame(() => {
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
          ScrollTrigger.refresh();
        });
      });
    }
    return () => { document.body.style.overflow = ''; };
  }, [showLoader]);

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

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white font-sans selection:bg-amber-500 selection:text-black">
      {/* Cinematic Loading Screen */}
      <AnimatePresence>
        {showLoader && (
          <Suspense fallback={null}>
            <LoadingScreen onComplete={() => setShowLoader(false)} />
          </Suspense>
        )}
      </AnimatePresence>
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
            <VideoBackground src="https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/montage-hero-section.mp4" />
            
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

          {/* Stats Counter Section */}
          <Suspense fallback={null}>
            <StatsSection />
          </Suspense>

          {/* Photography Section — mouse trail scoped to this section */}
          <Suspense fallback={null}>
            <PhotographySection />
          </Suspense>

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
                  
                  <p 
                    data-word-reveal
                    className="text-xl md:text-2xl text-white/80 font-light leading-relaxed mb-12 max-w-2xl"
                  >
                    {portfolioConfig?.personal?.description}
                  </p>

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

          {/* Long Form Content Section */}
          <section id="longform" className="py-20 bg-neutral-950">
            <Suspense fallback={<div className="h-96 flex items-center justify-center text-white/20">Loading long form...</div>}>
              <LongFormSection />
            </Suspense>
          </section>

          <Suspense fallback={null}>
            <CaseStudiesSection caseStudies={portfolioConfig.caseStudies} />
          </Suspense>

          {/* Testimonials Section */}
          <Suspense fallback={null}>
            <TestimonialsSection />
          </Suspense>

          {/* Work Process Section */}
          <Suspense fallback={null}>
            <WorkProcessSection />
          </Suspense>

          {/* Color Grading Section */}
          <section id="color-grading" className="bg-neutral-950">
            <Suspense fallback={<div className="h-96 flex items-center justify-center text-white/20">Loading color work...</div>}>
              <ColorGradingSection />
            </Suspense>
          </section>

          {/* Instagram Feed Section */}
          <section id="instagram" className="persp-stage py-4 bg-neutral-950">
            <div data-tseily-flip className="will-change-transform">
              <Suspense fallback={<div className="h-96 flex items-center justify-center text-white/20">Loading feed...</div>}>
                <InstagramFeedLive />
              </Suspense>
            </div>
          </section>

          <ServicePackagesSection onContact={() => scrollToSection('contact')} />

          {/* Q&A Accordion Section */}
          <Suspense fallback={null}>
            <FaqSection />
          </Suspense>

          {/* Contact Section */}
          <Suspense fallback={null}>
            <ContactSection personal={portfolioConfig?.personal} />
          </Suspense>
        </main>

        {/* Footer */}
        <Suspense fallback={null}>
          <FooterSection
            personal={portfolioConfig?.personal}
            social={portfolioConfig?.social}
            onAdminTrigger={() => setIsAdminOpen(true)}
            onScrollTop={() => scrollToSection('hero')}
          />
        </Suspense>
      </div>

      {/* Secret Admin Dashboard Modal */}
      <Suspense fallback={null}>
        <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
      </Suspense>

      {/* Toast Notifications */}
      <Toasts />

      {/* Tseily Motion Layer: Cursor Dot + Section Rail + 3D Scroll Unfolds */}
      <Suspense fallback={null}>
        <TseilyMotionLayer onScrollTo={scrollToSection} />
      </Suspense>

      {/* Background Home Song */}
      <Suspense fallback={null}>
        <BackgroundSong src="https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/audio/song.m4a" />
      </Suspense>
    </div>
  );
};

export default App;