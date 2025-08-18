import React, { useState } from 'react';

const Login = ({ handleLogin, onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    handleLogin(email, password);
    setEmail('');
    setPassword('');
  };

  return (
    <div
      className="relative flex h-screen w-screen items-center justify-center"
      style={{
        backgroundImage: "url('src/img/logo.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* dark overlay for readability */}
      <div className="absolute inset-0 bg-[#0b1020]/70" />

      {/* ambient accents (visual only) */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/20 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-blue-600/20 blur-[140px]" />

      {/* card */}
      <div className="relative z-10 w-[400px] rounded-2xl border border-white/10 bg-white/5 p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        {/* brand header with text badge (no image) */}
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="relative">
            <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-tr from-emerald-400/40 via-blue-500/30 to-transparent blur-xl" />
            <div className="relative grid h-24 w-24 place-items-center rounded-full border border-white/20 bg-white/10 shadow-inner">
              <span className="text-white text-xl font-bold tracking-widest">RAMP</span>
            </div>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Login</h2>
          <p className="text-sm text-gray-300/90">Welcome back — sign in to continue</p>
        </div>

        {/* your original form & logic (unchanged) */}
        <form onSubmit={submitHandler} className="flex flex-col gap-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
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
          <button
            type="submit"
            className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 py-2.5 rounded-xl text-white text-base font-medium shadow-lg shadow-emerald-500/20 focus:outline-none focus:ring-4 focus:ring-emerald-400/30 transition"
          >
            Login
          </button>
        </form>

        <p className="text-gray-300 mt-4 text-center text-sm">
          Don’t have an account?{' '}
          <span
            className="text-emerald-400 hover:text-emerald-300 cursor-pointer underline underline-offset-4"
            onClick={onSwitch}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
