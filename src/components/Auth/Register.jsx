import React, { useEffect, useState } from 'react';
import { API } from '../../lib/api';

const Register = ({ onSwitch }) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ✅ ADDED: groups + selected group
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ✅ ADDED: fetch groups for dropdown
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // ✅ Frontend validation (unchanged)
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(firstName)) {
      return setError('First name must only contain letters.');
    }

    if (!email.endsWith('@ramp.mem')) {
      return setError('Email must end with @ramp.mem');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return setError(
        'Password must be at least 8 chars, include 1 uppercase, 1 lowercase, and 1 number.'
      );
    }

    // ✅ ADDED: require a group
    if (!groupId) {
      return setError('Please choose a group.');
    }

    try {
      const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          email,
          password,
          group_id: Number(groupId), // ✅ send selected group
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Registration failed');
      } else {
        setSuccess('Account created successfully! Redirecting to login...');
        setFirstName('');
        setEmail('');
        setPassword('');
        setGroupId(''); // ✅ clear selection

        // ⏳ Auto-redirect to login after 2 seconds (unchanged)
        setTimeout(() => {
          if (onSwitch) onSwitch();
        }, 2000);
      }
    } catch (err) {
      console.error('Error registering:', err);
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#1c1c1c]">
      <div className="border-2 rounded-xl border-emerald-600 p-10 w-[400px]">
        <h2 className="text-2xl text-white mb-6 text-center">Register</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-3">{success}</p>}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            type="text"
            placeholder="First Name"
            className="outline-none bg-transparent border-2 border-emerald-600 text-lg py-2 px-4 rounded-full text-white placeholder-gray-400"
            required
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email (@ramp.mem)"
            className="outline-none bg-transparent border-2 border-emerald-600 text-lg py-2 px-4 rounded-full text-white placeholder-gray-400"
            required
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="outline-none bg-transparent border-2 border-emerald-600 text-lg py-2 px-4 rounded-full text-white placeholder-gray-400"
            required
          />

          {/* ✅ ADDED: Group dropdown */}
          <select
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            className="outline-none bg-transparent border-2 border-emerald-600 text-lg py-2 px-4 rounded-full text-white"
            required
          >
            <option value="" className="bg-[#1C1C1C]">Select Group</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id} className="bg-[#1C1C1C]">
                {g.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 py-2 rounded-full text-white text-lg"
          >
            Create Account
          </button>
        </form>

        {/* Back to login button */}
        <p className="text-gray-400 mt-4 text-center">
          Already have an account?{' '}
          <span
            className="text-emerald-500 cursor-pointer"
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
