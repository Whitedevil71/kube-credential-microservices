import React from 'react';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [dark, setDark] = React.useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  React.useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark((d) => !d)}
      className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
      title="Toggle theme"
    >
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};
