import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    // Use View Transition API if available
    if (!document.startViewTransition) {
      updateTheme(newTheme);
      return;
    }

    document.startViewTransition(() => updateTheme(newTheme));
  };

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <>
      <style>
        {`
          ::view-transition-group(root) {
            animation-timing-function: ease-in-out;
          }
          
          ::view-transition-new(root) {
            mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="white"/></svg>') center / 0 no-repeat;
            mask-origin: content-box;
            animation: scale-up 0.5s;
          }
          
          ::view-transition-old(root) {
            animation: scale-down 0.5s;
            z-index: -1;
          }
          
          @keyframes scale-up {
            to {
              mask-size: 200vmax;
            }
          }
          
          @keyframes scale-down {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }
        `}
      </style>
      <button
        onClick={toggleTheme}
        className="fixed top-20 right-6 z-[100] p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 border-2 border-primary-200 dark:border-primary-700"
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <Moon className="w-6 h-6 text-primary-600" />
        ) : (
          <Sun className="w-6 h-6 text-lemon-400" />
        )}
      </button>
    </>
  );
};

export default ThemeToggle;
