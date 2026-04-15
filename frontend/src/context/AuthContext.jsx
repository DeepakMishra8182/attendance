import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

 const fetchUser = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/auth/me", {
      withCredentials: true,
    });
    setUser(res.data);
    return res.data; 
  } catch (error) {
    setUser(null);
    return null;
  }
};

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);