import React from 'react';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';

const InstagramFeedLive = () => {
  const instagramUsername = 'abhi_clicks._';
  const instagramUrl = `https://instagram.com/${instagramUsername}`;

  return (
    <section className="py-24 px-6 bg-brand-charcoal">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-amber/10 border border-brand-amber/20 text-sm text-brand-amber mb-4">
            <Instagram className="w-4 h-4" />
            Live Feed
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
            <span className="text-white">
              Follow on Instagram
            </span>
          </h2>
          
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto mb-8">
            Behind-the-scenes, latest projects, and daily inspiration from my creative journey
          </p>

          {/* Follow Button */}
          <motion.a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-brand-amber text-brand-charcoal font-black rounded-full hover:bg-white transition-all hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Instagram className="w-5 h-5" />
            Follow @{instagramUsername}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramFeedLive;
