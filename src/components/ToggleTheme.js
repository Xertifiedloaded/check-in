import { useTheme } from '../context/ThemeContext';
import React from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={toggleTheme}
          className="sr-only"
        />
        <div className="w-14 bg-gray-300 dark:bg-gray-700 rounded-full shadow-inner transition-colors duration-300 ease-in-out">
          <div
            className={`${
              theme === 'dark' ? 'translate-x-7 bg-blue-500' : 'translate-x-0 bg-white'
            } w-6 h-6 rounded-full shadow transition-transform duration-300 ease-in-out flex items-center justify-center`}
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-white" />
            ) : (
              <Sun className="w-4 h-4 text-yellow-500" />
            )}
          </div>
        </div>
      </label>
    </div>
  );
};

export default ThemeToggleButton;
