import React, { useEffect, useState } from 'react';

const Header = ({ data, changeUser }) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (data && data.first_name) {
      setUsername(data.first_name);
    } else {
      setUsername('Guest'); 
    }
  }, [data]);

  const logOutUser = () => {
    localStorage.setItem('loggedInUser', '');
    changeUser('');
  };

  return (
    <div className="flex items-center justify-between w-full">
      {/* Left - Greeting */}
      <div>
        <p className="text-lg text-gray-300 font-light">Welcome back,</p>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          {username} <span className="animate-wave inline-block">👋</span>
        </h1>
      </div>

      {/* Center - RAMP Brand */}
      <div className="flex-1 flex justify-center">
        <h1
          className="
            text-6xl font-extrabold tracking-widest uppercase
            bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 
            bg-clip-text text-transparent
            drop-shadow-[0_0_15px_rgba(0,255,200,0.4)]
            select-none
          "
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          RAMP
        </h1>
      </div>

      {/* Right - Logout Button */}
      <button
        onClick={logOutUser}
        className="
          bg-gradient-to-r from-red-500 to-red-700 
          text-lg font-semibold text-white 
          px-6 py-3 rounded-xl
          shadow-lg shadow-red-500/30
          transform transition-all duration-200
          hover:scale-105 hover:from-red-400 hover:to-red-600
          active:scale-95
        "
      >
        Log Out
      </button>
    </div>
  );
};

export default Header;
