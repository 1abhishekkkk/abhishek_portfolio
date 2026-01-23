import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Heart, MessageCircle, ExternalLink } from 'lucide-react';

const InstagramFeed = () => {
  // Instagram username
  const instagramUsername = 'abhi_clicks._';
  const instagramUrl = `https://instagram.com/${instagramUsername}`;

  // Load Instagram embed script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
    
    // Process embeds after script loads
    script.onload = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    };

    return () => {
      document.body.removeChild(script);
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
            Follow the Journey
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Latest on Instagram
            </span>
          </h2>
          
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto mb-8">
            Behind-the-scenes, latest projects, and creative process. Follow for daily inspiration!
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

        {/* Live Instagram Feed Embed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          {/* Instagram Profile Widget */}
          <div className="flex justify-center">
            <blockquote 
              className="instagram-media" 
              data-instgrm-permalink={`${instagramUrl}/?utm_source=ig_embed&amp;utm_campaign=loading`}
              data-instgrm-version="14"
              style={{
                background: '#FFF',
                border: 0,
                borderRadius: '12px',
                boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                margin: '1px',
                maxWidth: '540px',
                minWidth: '326px',
                padding: 0,
                width: 'calc(100% - 2px)'
              }}
            >
              <div style={{ padding: '16px' }}>
                <a 
                  href={`${instagramUrl}/?utm_source=ig_embed&amp;utm_campaign=loading`}
                  style={{
                    background: '#FFFFFF',
                    lineHeight: 0,
                    padding: 0,
                    textAlign: 'center',
                    textDecoration: 'none',
                    width: '100%'
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View this profile on Instagram
                </a>
              </div>
            </blockquote>
          </div>
        </motion.div>

        {/* Alternative: Grid of Latest Posts */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {instagramPosts.map((post, index) => (
            <motion.a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group aspect-square overflow-hidden rounded-lg bg-neutral-900 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredPost(post.id)}
              onMouseLeave={() => setHoveredPost(null)}
            >
              {/* Post Image */}
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  // Fallback to gradient if image doesn't exist
                  e.target.style.display = 'none';
                  e.target.parentElement.style.background = `linear-gradient(135deg, 
                    hsl(${index * 60}, 70%, 50%), 
                    hsl(${index * 60 + 60}, 70%, 40%))`;
                }}
              />

              {/* Hover Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-300 ${
                hoveredPost === post.id ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                  {/* Stats */}
                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      <Heart className="w-6 h-6 fill-white" />
                      <span className="text-lg font-semibold">{post.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-6 h-6 fill-white" />
                      <span className="text-lg font-semibold">{post.comments}</span>
                    </div>
                  </div>
                  
                  {/* Caption */}
                  <p className="text-sm text-center line-clamp-2 mb-4">
                    {post.caption}
                  </p>

                  {/* View on Instagram */}
                  <div className="flex items-center gap-2 text-xs text-neutral-300">
                    View on Instagram
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Instagram Icon Overlay */}
              <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Instagram className="w-5 h-5 text-white" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* View More on Instagram */}
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
            View All Posts
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Instagram Embed Widget Alternative */}
        <motion.div
          className="mt-16 p-8 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-orange-500/5 rounded-2xl border border-purple-500/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Want Live Instagram Feed?
            </h3>
            <p className="text-neutral-400 mb-6">
              We can integrate a live Instagram widget that automatically updates with your latest posts!
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm text-neutral-500">
              <div className="flex items-center gap-2">
                ✅ Auto-updates
              </div>
              <div className="flex items-center gap-2">
                ✅ No manual work
              </div>
              <div className="flex items-center gap-2">
                ✅ Always fresh content
              </div>
              <div className="flex items-center gap-2">
                ✅ Increases followers
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramFeed;
