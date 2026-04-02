import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("mindbrain_theme") || "dark";
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Apply theme to document when theme changes
  useEffect(() => {
    localStorage.setItem("mindbrain_theme", theme);
    
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("bg-gradient-to-b", "from-slate-900", "to-slate-950");
      document.body.classList.remove("bg-white", "bg-gradient-to-b", "from-slate-50", "to-slate-100");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.add("bg-gradient-to-b", "from-slate-50", "to-slate-100");
      document.body.classList.remove("bg-gradient-to-b", "from-slate-900", "to-slate-950");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
