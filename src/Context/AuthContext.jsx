import { createContext, useState, useEffect, useContext } from "react";
import { AuthAPI } from "../api/AuthAPI";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      setAuthenticated(false);
      const response = await AuthAPI.checkAuth(true);
      if (response.status === 200) {
        setUser(response.data);
        setAuthenticated(true);
      } else {
        setUser(null);
        setAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (usr, pwd) => {
    const response = await AuthAPI.login({
      usr,
      pwd,
    });
    setAuthenticated(true);
    await checkAuth();
    return response.data;
  };

  const logout = async () => {
    try {
      await AuthAPI.delete({ user: user?.user?.email }, true);
      setUser(null);
      setAuthenticated(false);
    } catch (error) {
      setUser(null);
      setAuthenticated(false);
      throw error;
    }
  };

  const handleAuthError = () => {
    setUser(null);
    setAuthenticated(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    authenticated,
    loading,
    handleAuthError,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
