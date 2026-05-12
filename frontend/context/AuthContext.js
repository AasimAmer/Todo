'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { usePathname } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children, initialUser = null, initialJwt = null }) {
  const [user, setUser] = useState(initialUser);
  const [jwt, setJwt] = useState(initialJwt);
  const loading = false;
  const pathname = usePathname();

  useEffect(() => {
    // Keep client state in sync with client-readable cookies.
    const savedJwt = Cookies.get('jwt');
    const savedUser = Cookies.get('user');

    if (savedJwt && savedUser) {
      setJwt(savedJwt);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    } else {
      setJwt(null);
      setUser(null);
    }
  }, [pathname]);

  const login = (jwtToken, userData) => {
    // Save to cookies so session survives page refresh
    Cookies.set('jwt', jwtToken, { expires: 7 }); // expires in 7 days
    Cookies.set('user', JSON.stringify(userData), { expires: 7 });
    setJwt(jwtToken);
    setUser(userData);
  };

  const logout = () => {
    Cookies.remove('jwt');
    Cookies.remove('user');
    setJwt(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, jwt, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy consumption
export function useAuth() {
  return useContext(AuthContext);
}
