import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, ExternalLink } from 'lucide-react';

const InstagramFeedLive = () => {
  const instagramUsername = 'abhi_clicks._';
  const instagramUrl = `https://instagram.com/${instagramUsername}`;

  // Load Elfsight script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://elfsightcdn.com/platform.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-black via-neutral-950 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-500/20 text-sm text-purple-400 mb-4">
            <Instagram className="w-4 h-4" />
            Live Feed
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
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
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Instagram className="w-5 h-5" />
            Follow @{instagramUsername}
          </motion.a>
        </motion.div>

        {/* Live Instagram Feed - Elfsight Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 elfsight-feed-container"
        >
          {/* Elfsight Instagram Feed Widget */}
          <div 
            className="elfsight-app-682119fe-28a4-4474-8e9e-c2fb05ef47e3" 
            data-elfsight-app-lazy
            style={{
              maxWidth: '1200px',
              margin: '0 auto'
            }}
          ></div>
          
          {/* Style Instagram feed to match portfolio */}
          <style>{`
            /* Hide "Free Instagram Feed Widget" title text */
            .eapps-instagram-feed-title,
            .eapps-instagram-feed-header-title,
            .eapps-instagram-feed-header h2,
            .eapps-instagram-feed-header h3,
            .eapps-widget-header-title {
              display: none !important;
              visibility: hidden !important;
              height: 0 !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            
            /* Hide Elfsight edit/customize buttons ONLY */
            .eapps-link,
            .eapps-instagram-feed-edit-button,
            .eapps-edit-button,
            button[class*="edit"],
            button[class*="customize"],
            .eapps-widget-toolbar {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
              pointer-events: none !important;
            }
            
            /* Keep the widget visible and working */
            .elfsight-app-682119fe-28a4-4474-8e9e-c2fb05ef47e3 {
              min-height: 400px;
              display: block !important;
              visibility: visible !important;
              opacity: 1 !important;
            }
            
            /* Make background dark to match portfolio */
            .elfsight-app-682119fe-28a4-4474-8e9e-c2fb05ef47e3,
            .eapps-instagram-feed,
            .eapps-instagram-feed-posts,
            .eapps-instagram-feed-posts-grid {
              background-color: transparent !important;
              background: transparent !important;
            }
            
            /* Style the widget wrapper */
            .eapps-widget {
              background-color: transparent !important;
              background: transparent !important;
            }
            
            /* Remove grey background from containers */
            div[class*="eapps"] {
              background-color: transparent !important;
            }
            
            /* Ensure feed posts are visible */
            .eapps-instagram-feed-posts,
            .eapps-instagram-feed-posts-grid,
            .eapps-instagram-feed-posts-item,
            .eapps-instagram-feed-posts-item-template {
              display: block !important;
              visibility: visible !important;
              opacity: 1 !important;
            }
            
            /* Style individual post items */
            .eapps-instagram-feed-posts-item {
              background: transparent !important;
              border-radius: 12px;
              overflow: hidden;
            }
          `}</style>
        </motion.div>

        {/* Loading Placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <p className="text-neutral-500 text-sm">
            ✨ Loading live Instagram feed...
          </p>
        </motion.div>

        {/* Direct Instagram Link */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 text-white rounded-full transition-all hover:scale-105"
          >
            View Full Profile on Instagram
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramFeedLive;
