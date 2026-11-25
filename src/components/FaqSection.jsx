import React, { useState } from 'react';

const FAQS = [
  {
    q: 'Are you just an editor?',
    a: 'No — I handle concept development, pacing, sound design, motion graphics, and commercial color grading end-to-end.',
  },
  {
    q: 'Do you edit & grade footage shot by someone else?',
    a: "Yes! Send over your RAW/Log footage and brief — I'll craft the edit, sound, and cinematic grade.",
  },
  {
    q: 'How fast can we get started?',
    a: 'Click YES below, drop your brief, and we can kick off within 24–48 hours.',
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section id="qa" className="persp-stage border-t border-white/5 bg-neutral-950 px-6 py-24 sm:px-12">
      <div data-tseily-flip className="mx-auto max-w-3xl will-change-transform">
        <h2 className="text-5xl font-black tracking-tighter uppercase text-amber-500 sm:text-6xl">
          Q&amp;A
        </h2>
        <p className="mt-2 text-sm text-neutral-400">
          A few things you might be wondering.
        </p>

        <div className="mt-8 divide-y divide-white/10">
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={item.q} className={`faq-item py-5 ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="flex w-full cursor-pointer items-center justify-between text-left text-base font-semibold text-white sm:text-lg"
                >
                  <span>{item.q}</span>
                  <span className="faq-plus ml-4 text-2xl font-light text-amber-500">
                    +
                  </span>
                </button>
                <div className="faq-body">
                  <div className="overflow-hidden">
                    <p className="pt-3 text-sm leading-relaxed text-neutral-400">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
