import React, { useState, useEffect } from 'react';

const Login = ({ handleLogin, onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Lock body scroll
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    handleLogin(email, password);
    setEmail('');
    setPassword('');
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
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
  RAMP
</h1>

          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-white">Login</h2>
          <p className="text-xs md:text-sm text-gray-300/90">Welcome back — sign in to continue</p>
        </div>

        {/* form */}
        <form onSubmit={submitHandler} className="flex flex-col gap-3.5 md:gap-4">
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
  