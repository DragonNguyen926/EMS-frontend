import React, { useEffect, useState } from 'react';

import { API } from '../../../lib/api';

const MembersPanel = ({ devId }) => {
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const authedFetch = async (path) => {
    const res = await fetch(`${API}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': String(devId || ''),
      }
    });
    const ct = res.headers.get('content-type') || '';
    const text = await res.text();
    const data = ct.includes('application/json') ? JSON.parse(text || '{}') : null;
    if (!res.ok) throw new Error((data && data.message) || text || `Request failed ${res.status}`);
    if (!data) throw new Error(`Expected JSON but got ${ct}`);
    return data;
  };

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API}/groups`);
        const ct = r.headers.get('content-type') || '';
        if (!ct.includes('application/json')) {
          const txt = await r.text();
          throw new Error(`GET /groups returned non-JSON: ${txt.slice(0,120)}`);
        }
        setGroups(await r.json());
      } catch (e) {
        setMsg(`❌ ${e.message}`);
      }
    })();
  }, []);

  const loadMembers = async (id) => {
    if (!id) return setMembers([]);
    setLoading(true); setMsg('');
    try {
      const rows = await authedFetch(`/groups/${id}/members`);
      setMembers(rows);
    } catch (e) {
      setMsg(`❌ ${e.message}`);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (groupId) loadMembers(groupId); }, [groupId]);

  const changeRole = async (userId, newRole) => {
    try {
      const url = `${API}/groups/${groupId}/members/${userId}/role`;
      console.log('🔍 changeRole ->', { url, newRole });

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': String(devId || ''),
        },
        body: JSON.stringify({ newRole }),
      });

      const rawText = await res.text();
      console.log('📥 Response status:', res.status);
      console.log('📥 Response text:', rawText);

      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { message: rawText };
      }

      if (!res.ok) {
        throw new Error(data.message || `HTTP ${res.status}`);
      }

      await loadMembers(groupId);
    } catch (err) {
      console.error('❌ changeRole error:', err);
      setMsg(`❌ ${err.message}`);
    }
  };

  return (
    <div className="mt-6 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] text-white font-sans">
      <h2 className="text-xl font-semibold mb-4 text-white/90">Group Members (Dev Only)</h2>
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
          onClick={() => loadMembers(groupId)}
          disabled={!groupId || loading}
          className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 px-5 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-emerald-500/20 transition disabled:opacity-60"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {members.map(u => (
          <div
            key={u.id}
            className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border border-white/10 bg-[#0b1020]/50 backdrop-blur hover:bg-[#0b1020]/70 transition"
          >
            <div>
              <p className="text-white text-sm font-medium">{u.first_name}</p>
              <p className="text-gray-400 text-xs">{u.email}</p>
            </div>
            <div className="text-xs md:text-sm mt-2 md:mt-0">
              <span className="text-gray-300">Role: </span>
              <span className="text-white">{u.role}</span>
              <span className="text-gray-500 mx-2">•</span>
              <span className="text-gray-300">Status: </span>
              <span className="text-white">{u.status}</span>
            </div>
            <div className="text-xs md:text-sm flex items-center gap-2 mt-2 md:mt-0">
              <span className="text-gray-300">Change Role:</span>
              <select
                value={u.role}
                onChange={(e) => {
                  if (u.id === devId && e.target.value !== 'dev') {
                    setMsg('❌ You cannot change your own role from dev.');
                    return;
                  }
                  changeRole(u.id, e.target.value);
                }}
                className="bg-[#0b1020] border border-white/20 rounded px-2 py-1 text-white text-xs md:text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition"
              >
                <option value="employee">employee</option>
                <option value="admin">leader</option>
                <option value="dev">dev</option>
              </select>
            </div>
          </div>
        ))}
        {groupId && members.length === 0 && (
          <p className="text-gray-400">No members in this group.</p>
        )}
      </div>
    </div>
  );
};

export default MembersPanel;
