import React, { useState, useEffect } from 'react';
import { X, Lock, RefreshCw, Mail, Check, LogOut, ShieldAlert, Inbox, User, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminModal({ isOpen, onClose }) {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(() => sessionStorage.getItem('admin_token') || '');
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchContacts = async (authToken) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/get-contacts', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (res.ok) {
        setContacts(data.contacts || []);
        sessionStorage.setItem('admin_token', authToken);
        setToken(authToken);
      } else {
        setError(data.error || 'Authentication failed');
        if (res.status === 401) {
          sessionStorage.removeItem('admin_token');
          setToken('');
        }
      }
    } catch (err) {
      setError('Network error connecting to database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      fetchContacts(token);
    }
  }, [isOpen, token]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!password) return;
    fetchContacts(password);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    setToken('');
    setPassword('');
    setContacts([]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-neutral-950/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                  Studio Admin <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">Secret Access</span>
                </h2>
                <p className="text-xs text-neutral-400 font-medium">Manage portfolio contact inquiries</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {token && (
                <>
                  <button
                    onClick={() => fetchContacts(token)}
                    disabled={loading}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
                    title="Refresh messages"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {!token ? (
              /* Login View */
              <div className="max-w-md mx-auto py-12 text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <Lock className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Enter Admin Password</h3>
                  <p className="text-sm text-neutral-400 mt-1">Authorized access only</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Admin Password..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-center font-mono tracking-wider"
                      autoFocus
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center justify-center gap-2">
                      <ShieldAlert className="w-4 h-4" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Unlock Admin Dashboard'}
                  </button>
                </form>
              </div>
            ) : (
              /* Contacts List View */
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-neutral-300">
                    <Inbox className="w-4 h-4 text-amber-500" /> Total Inquiries: <span className="text-white font-bold px-2 py-0.5 rounded-md bg-white/10">{contacts.length}</span>
                  </div>
                </div>

                {contacts.length === 0 ? (
                  <div className="text-center py-16 text-neutral-500 space-y-3">
                    <Inbox className="w-12 h-12 mx-auto opacity-30" />
                    <p className="text-sm font-medium">No contact form messages yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contacts.map((c) => (
                      <div
                        key={c.id}
                        className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-500/30 transition-all space-y-3 group"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-amber-500" />
                            <span className="font-bold text-white text-base">{c.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-neutral-400 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-neutral-500" />
                              {new Date(c.created_at).toLocaleString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <a
                              href={`mailto:${c.email}?subject=Re: Your message on Abhi's Creative Studio`}
                              className="px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black font-semibold text-xs transition-all flex items-center gap-1.5 border border-amber-500/20"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              Reply: {c.email}
                            </a>
                          </div>
                        </div>
                        <p className="text-neutral-200 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-black/30 p-4 rounded-xl border border-white/5">
                          {c.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
