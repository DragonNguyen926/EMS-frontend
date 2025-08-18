import React, { useEffect, useState } from 'react';

import { API } from '../../../lib/api';

const GroupsPanel = ({ devId }) => {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // dev-only helper: adds x-user-id header
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
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.message || `Request failed ${res.status}`);
    return json;
  };

  const load = async () => {
    try {
      const rows = await fetch(`${API}/groups`).then(r => r.json());
      setGroups(rows);
    } catch (e) {
      setMsg(`❌ ${e.message}`);
    }
  };

  useEffect(() => { load(); }, []);

  const createGroup = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true); setMsg('');
    try {
      await authedFetch('/groups', { method: 'POST', body: { name: name.trim() } });
      setName('');
      await load();
      setMsg('✅ Group created');
    } catch (e) {
      setMsg(`❌ ${e.message}`);
    } finally { setLoading(false); }
  };

  const deleteGroup = async (id) => {
    if (!window.confirm('Delete this group?')) return;
    setLoading(true); setMsg('');
    try {
      await authedFetch(`/groups/${id}`, { method: 'DELETE' });
      await load();
      setMsg('🗑️ Group deleted');
    } catch (e) {
      setMsg(`❌ ${e.message}`);
    } finally { setLoading(false); }
  };

  return (
    <div className="mt-6 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] text-white font-sans">
      <h2 className="text-xl font-semibold mb-4 text-white/90">Groups</h2>

      {msg && <p className="text-emerald-400 text-sm mb-3">{msg}</p>}

      <form onSubmit={createGroup} className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          type="text"
          placeholder="New group name"
          className="flex-1 text-sm py-2 px-3 rounded-lg outline-none bg-[#0b1020]/50 border border-white/20 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 px-5 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-emerald-500/20 transition disabled:opacity-60"
        >
          {loading ? '...' : 'Create'}
        </button>
      </form>

      <div className="grid md:grid-cols-3 gap-3">
        {groups.map(g => (
          <div
            key={g.id}
            className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-[#0b1020]/50 backdrop-blur hover:bg-[#0b1020]/70 transition"
          >
            <span className="text-white text-sm font-medium">{g.name}</span>
            <button
              onClick={() => deleteGroup(g.id)}
              disabled={loading}
              className="text-red-400 hover:text-red-300 text-xs font-medium transition"
            >
              Delete
            </button>
          </div>
        ))}
        {groups.length === 0 && (
          <p className="text-gray-400 col-span-full">No groups yet.</p>
        )}
      </div>
    </div>
  );
};

export default GroupsPanel;
