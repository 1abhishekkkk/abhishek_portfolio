import React from 'react';

const Toasts = () => {
  const [toasts, setToasts] = React.useState([]);

  React.useEffect(() => {
    const handler = (e) => {
      const id = Math.random().toString(36).slice(2);
      const toast = { id, type: e.detail?.type || 'info', message: e.detail?.message || '' };
      setToasts((prev) => [...prev, toast]);
      // auto-dismiss after 3.5s
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    };
    window.addEventListener('toast', handler);
    return () => window.removeEventListener('toast', handler);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[70] space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto min-w-[240px] max-w-[360px] rounded-lg border px-4 py-3 shadow-lg backdrop-blur-md transition-all bg-black/70 text-white ${
            t.type === 'success' ? 'border-emerald-500/30' : t.type === 'error' ? 'border-red-500/30' : 'border-white/10'
          }`}
        >
          <div className="text-sm font-medium mb-1">
            {t.type === 'success' ? 'Success' : t.type === 'error' ? 'Error' : 'Notice'}
          </div>
          <div className="text-sm text-neutral-200">{t.message}</div>
        </div>
      ))}
    </div>
  );
};

export default Toasts;
