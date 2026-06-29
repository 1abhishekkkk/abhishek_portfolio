import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, ExternalLink, Camera, Film, Star } from 'lucide-react';

const instagramUsername = 'abhi_clicks._';
const instagramUrl = `https://instagram.com/${instagramUsername}`;

// Stat items
const stats = [
  { label: 'Posts', value: '198' },
  { label: 'Followers', value: '1.4K' },
  { label: 'Following', value: '1,097' },
];

// Floating tags that orbit the CTA
const tags = [
  { label: '#BrandFilms', icon: Film, x: '-left-4', y: 'top-10', delay: 0 },
  { label: '#ColorGrade', icon: Star, x: 'right-0', y: 'top-6', delay: 0.15 },
  { label: '#BTS', icon: Camera, x: '-left-2', y: 'bottom-12', delay: 0.3 },
  { label: '#Realme', icon: Star, x: 'right-2', y: 'bottom-8', delay: 0.45 },
];

const InstagramFeedLive = () => (
  <section className="py-24 px-6 bg-neutral-950 relative overflow-hidden">
    {/* Subtle grid texture */}
    <div
      className="absolute inset-0 opacity-[0.025] pointer-events-none"
      style={{
        backgroundImage:
          'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }}
    />

    {/* Instagram gradient orb */}
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-[0.07] pointer-events-none"
      style={{
        background:
          'radial-gradient(circle, #f97316, #ec4899, #8b5cf6)',
      }}
    />

    <div className="max-w-4xl mx-auto relative z-10">
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest mb-5"
          style={{
            background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(236,72,153,0.15))',
            borderColor: 'rgba(249,115,22,0.3)',
            color: '#f97316',
          }}
        >
          <Instagram className="w-3.5 h-3.5" />
          Live Feed
        </div>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-white uppercase">
          Follow the <span style={{
            background: 'linear-gradient(90deg, #f97316, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Journey</span>
        </h2>
        <p className="text-white/40 font-medium text-lg max-w-xl mx-auto">
          Behind-the-scenes, latest projects, and daily creative inspiration.
        </p>
      </motion.div>

      {/* Main CTA card */}
      <motion.div
        className="relative rounded-3xl overflow-hidden border border-white/10"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        {/* Instagram gradient top bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, #f97316, #ec4899, #8b5cf6)' }}
        />

        {/* Card body */}
        <div className="bg-white/[0.03] backdrop-blur-sm px-8 md:px-14 py-14 flex flex-col items-center gap-10">
          {/* IG avatar circle + handle */}
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            {/* Gradient avatar ring */}
            <div
              className="w-24 h-24 rounded-full p-[3px]"
              style={{ background: 'linear-gradient(135deg, #f97316, #ec4899, #8b5cf6)' }}
            >
              <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center">
                <Instagram className="w-10 h-10 text-white/60" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-white font-black text-xl tracking-tight">@{instagramUsername}</div>
              <div className="text-white/40 text-sm font-medium mt-0.5">Photographer · Editor · Colorist</div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex items-center gap-0 divide-x divide-white/10 rounded-2xl border border-white/8 overflow-hidden"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            {stats.map((s) => (
              <div key={s.label} className="px-8 py-5 text-center">
                <div className="text-2xl font-black text-white tracking-tight">{s.value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-black uppercase tracking-widest text-sm text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
            whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(249,115,22,0.4)' }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            <Instagram className="w-5 h-5" />
            Follow on Instagram
            <ExternalLink className="w-4 h-4 opacity-70" />
          </motion.a>

          {/* Hashtag cloud */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55, duration: 0.6 }}
          >
            {['#BrandFilms', '#ColorGrade', '#BTS', '#Realme', '#Fuse', '#CinematicEdit', '#VideoEditor', '#India'].map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-bold text-white/20 hover:text-white/50 transition-colors cursor-default"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default InstagramFeedLive;
