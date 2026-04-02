import { createContext, useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";

export const Authcontext = createContext()
export const AuthProvider =({children})=> {

    // Set axios authorization header synchronously
    const token = localStorage.getItem("mindbrain_token");
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }

    const [currentUser, setCurrentUser] = useState(() => {
      try {
        return JSON.parse(localStorage.getItem("mindbrain_user")) || null;
      } catch {
        return null;
      }
    });

    const [loggedin,setloggedin] = useState(() => !!localStorage.getItem("mindbrain_token"));
    const [loading, setLoading] = useState(true);

    // ✅ Validate token and fetch user profile
    const validateToken = async () => {
      const storedToken = localStorage.getItem("mindbrain_token");
      const storedUser = localStorage.getItem("mindbrain_user");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        // Set axios header for this request
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

        // Validate token by fetching profile
        const response = await axios.get("/api/auth/profile");

        // Token is valid, update user data
        setCurrentUser(response.data);
        setloggedin(true);

        // Update localStorage with fresh user data
        localStorage.setItem("mindbrain_user", JSON.stringify(response.data));

      } catch (error) {
        console.log("Token validation failed:", error?.response?.data?.message || error.message);

        // Token is invalid/expired, clear everything
        setCurrentUser(null);
        setloggedin(false);
        localStorage.removeItem("mindbrain_token");
        localStorage.removeItem("mindbrain_user");
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

     const login = (user) => {
            setloggedin(true);
            if (user) setCurrentUser(user);
        }

        const logout = () => {
            setloggedin(false);
            setCurrentUser(null);
            localStorage.removeItem("mindbrain_token");
            localStorage.removeItem("mindbrain_user");
            delete axios.defaults.headers.common['Authorization'];
        }

    // ✅ Validate token on app startup
    useEffect(() => {
      validateToken();
    }, []);

    // Update axios header when login state changes
    useEffect(() => {
      const token = localStorage.getItem("mindbrain_token");
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        delete axios.defaults.headers.common['Authorization'];
      }
    }, [loggedin]);

    // Add response interceptor to handle 401 errors
    useEffect(() => {
      const interceptor = axios.interceptors.response.use(
        (response) => response,
(error) => {
          if (error.response?.status === 401 && !error.config.url?.includes('/login')) {
            logout();
            window.location.href = '/';
          }
          return Promise.reject(error);
        }
      );

      return () => {
        axios.interceptors.response.eject(interceptor);
      };
    }, []);

    return(
        <Authcontext.Provider value={{loggedin,login,logout,currentUser, setCurrentUser, loading}}>
            {children}
        </Authcontext.Provider>
    )
}
