import React, { createContext, useEffect, useState } from 'react';
import { API } from '../lib/api'; 
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${API}/users?role=employee`);
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error('Failed to fetch employee data:', err);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div>
      <AuthContext.Provider value={[userData, setUserData]}>
        {children}
      </AuthContext.Provider>
    </div>
  );
};

export default AuthProvider;
