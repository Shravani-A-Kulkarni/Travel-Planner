import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user") || "null");

      if (token && userData) {
        try {
          const response = await fetch(
            "http://localhost:5000/api/verify-token",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.ok) {
            setAuthState({
              user: userData,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
          } else {
            logout();
          }
        } catch (err) {
          logout();
        }
      } else {
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.userId,
          username: data.username,
        })
      );

      setAuthState({
        user: data.user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      navigate("/");
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
      }}
    >
      {!authState.loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
