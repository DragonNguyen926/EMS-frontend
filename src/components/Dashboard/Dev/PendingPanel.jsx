import React, { useEffect, useState } from 'react';

import { API } from '../../../lib/api';

const PendingPanel = ({ devId }) => {
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState('');
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const authedFetch = async (path, options = {}) => {
    const res = await fetch(`${API}${path}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': String(devId || ''),
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const ct = res.headers.get('content-type') || '';
    const text = await res.text();
    const data = ct.includes('application/json') ? JSON.parse(text || '{}') : null;
    if (!res.ok) throw new Error((data && data.message) || text || `Request failed ${res.status}`);
    if (!data) throw new Error(`Expected JSON but got ${ct}`);
    return data;
  };

  const loadGroups = async () => {
    try {
      const r = await fetch(`${API}/groups`);
      const ct = r.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        const txt = await r.text();
        throw new Error(`GET /groups returned non-JSON: ${txt.slice(0,120)}`);
      }
      const list = await r.json();
      setGroups(list);
    } catch (e) {
      setMsg(`❌ ${e.message}`);
    }
  };

  const loadPending = async (id) => {
    if (!id) return setPending([]);
    setLoading(true); setMsg('');
    try {
      const rows = await authedFetch(`/groups/${id}/pending`);
      setPending(rows);
    } catch (e) {
      setMsg(`❌ ${e.message}`);
      setPending([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadGroups(); }, []);
  useEffect(() => { if (groupId) loadPending(groupId); }, [groupId]);

  const accept = async (uid) => {
    setLoading(true); setMsg('');
    try {
      await authedFetch(`/groups/${groupId}/members/${uid}/accept`, { method: 'PUT' });
      await loadPending(groupId);
      setMsg('✅ Member approved');
    } catch (e) {
      setMsg(`❌ ${e.message}`);
    } finally { setLoading(false); }
  };

  const decline = async (uid) => {
    if (!window.confirm('Decline and delete this pending account?')) return;
    setLoading(true); setMsg('');
    try {
      await authedFetch(`/groups/${groupId}/members/${uid}/decline`, { method: 'DELETE' });
      await loadPending(groupId);
      setMsg('🗑️ Member declined and removed');
    } catch (e) {
      setMsg(`❌ ${e.message}`);
    } finally { setLoading(false); }
  };

  return (
    <div className="mt-6 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] text-white font-sans">
      <h2 className="text-xl font-semibold mb-4 text-white/90">Pending Members (Dev Only)</h2>
      {msg && <p className="text-emerald-400 text-sm mb-3">{msg}</p>}

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <select
          value={groupId}
          onChange={e => setGroupId(e.target.value)}
          className="outline-none bg-[#0b1020]/50 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition"
        >
          <option value="" className="bg-[#0b1020]">Select group</option>
          {groups.map(g => (
            <option key={g.id} value={g.id} className="bg-[#0b1020]">{g.name}</option>
          ))}
        </select>
        <button
          onClick={() => loadPending(groupId)}
          disabled={!groupId || loading}
          className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 px-5 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-emerald-500/20 transition disabled:opacity-60"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {pending.map(u => (
          <div
            key={u.id}
            className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border border-white/10 bg-[#0b1020]/50 backdrop-blur hover:bg-[#0b1020]/70 transition"
          >
            <div>
              <p className="text-white text-sm font-medium">{u.first_name}</p>
              <p className="text-gray-400 text-xs">{u.email}</p>
            </div>
            <div className="flex gap-3 mt-3 md:mt-0">
              <button
                onClick={() => accept(u.id)}
                disabled={loading}
                className="bg-emerald-500 hover:bg-emerald-600 py-1.5 px-4 rounded-lg text-white text-xs md:text-sm font-semibold shadow-emerald-500/20 shadow disabled:opacity-60 transition"
              >
                Accept
              </button>
              <button
                onClick={() => decline(u.id)}
                disabled={loading}
                className="border border-red-400 text-red-400 hover:text-red-300 py-1.5 px-4 rounded-lg text-xs md:text-sm font-semibold disabled:opacity-60 transition"
              >
                Decline
              </button>
            </div>
          </div>
        ))}
        {groupId && pending.length === 0 && <p className="text-gray-400">No pending members.</p>}
      </div>
    </div>
  );
};

export default PendingPanel;
