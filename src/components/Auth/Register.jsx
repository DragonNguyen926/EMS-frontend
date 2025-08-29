import React, { useEffect, useState } from 'react';
import { API } from '../../lib/api';

const Register = ({ onSwitch }) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // fetch groups
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/groups`);
        const ct = res.headers.get('content-type') || '';
        if (!ct.includes('application/json')) {
          const txt = await res.text();
          throw new Error(`GET /groups returned non-JSON: ${txt.slice(0, 100)}`);
        }
        const data = await res.json();
        setGroups(data);
      } catch (e) {
        setError(e.message || 'Failed to load groups');
      }
    })();
  }, []);

  // lock scroll
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(firstName)) return setError('First name must only contain letters.');
    if (!email.endsWith('@ramp.mem')) return setError('Email must end with @ramp.mem');

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return setError('Password must be at least 8 chars, include 1 uppercase, 1 lowercase, and 1 number.');
    }
    if (!groupId) return setError('Please choose a group.');

    try {
      const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          email,
          password,
          group_id: Number(groupId),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Registration failed');
      } else {
        setSuccess('Account created successfully! Redirecting to login...');
        setFirstName(''); setEmail(''); setPassword(''); setGroupId('');
        setTimeout(() => { if (onSwitch) onSwitch(); }, 2000);
      }
    } catch (err) {
      console.error('Error registering:', err);
      setError('Server error. Please try again.');
    }
  };

  return (
    <div
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-x-hidden"
      style={{
        backgroundImage: "url('/img/logo.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0 bg-[#0b1020]/70" />

      {/* card */}
      <div className="relative z-10 w-[92vw] max-w-[400px] rounded-xl md:rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        {/* brand header - text only */}
        <div className="mb-5 md:mb-6 flex flex-col items-center gap-2 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
  RAMP
</h1>

          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-white">Create Account</h2>
          <p className="text-xs md:text-sm text-gray-300/90">Join the team — set up your access</p>
        </div>

        {/* alerts */}
        {error && (
          <div className="mb-3 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-3 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            {success}
          </div>
        )}

        {/* form */}
        <form onSubmit={handleRegister} className="flex flex-col gap-3.5 md:gap-4">
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            type="text"
            placeholder="First Name"
            className="outline-none bg-white/5 border border-white/15 text-base py-2.5 px-4 rounded-xl text-white placeholder-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition"
            required
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email (@ramp.mem)"
            className="outline-none bg-white/5 border border-white/15 text-base py-2.5 px-4 rounded-xl text-white placeholder-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition"
            required
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="outline-none bg-white/5 border border-white/15 text-base py-2.5 px-4 rounded-xl text-white placeholder-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition"
            required
          />

          {/* group dropdown */}
          <div className="relative">
            <select
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="appearance-none w-full outline-none bg-white/5 border border-white/15 text-base py-2.5 px-4 pr-10 rounded-xl text-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition"
              required
            >
              <option value="" className="bg-[#0b1020] text-gray-300">Select Group</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id} className="bg-[#0b1020] text-white">
                  {g.name}
                </option>
              ))}
            </select>
            {/* chevron */}
            <svg
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300/80"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 py-2.5 rounded-xl text-white text-base font-medium shadow-lg shadow-emerald-500/20 focus:outline-none focus:ring-4 focus:ring-emerald-400/30 transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-gray-300 mt-4 text-center text-sm">
          Already have an account?{' '}
          <span
            className="text-emerald-400 hover:text-emerald-300 cursor-pointer underline underline-offset-4"
            onClick={onSwitch}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
