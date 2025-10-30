import React from 'react';
import { Database } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-300">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Database className="w-6 h-6 sm:w-7 sm:h-7 text-brand-primary" />
              <span className="font-semibold text-base sm:text-lg tracking-tight">Kube Credential</span>
            </Link>
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center space-x-2">
              <NavLink
                to="/issue"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-primary text-white'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`
                }
              >
                Issue
              </NavLink>
              <NavLink
                to="/verify"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-accent text-white'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`
                }
              >
                Verify
              </NavLink>
              <ThemeToggle />
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {mobileOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
          {/* Mobile nav panel */}
          {mobileOpen && (
            <div className="md:hidden py-2 border-t border-slate-200 dark:border-slate-800">
              <nav className="flex flex-col gap-1">
                <NavLink
                  to="/issue"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-primary text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                    }`
                  }
                >
                  Issue
                </NavLink>
                <NavLink
                  to="/verify"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-accent text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                    }`
                  }
                >
                  Verify
                </NavLink>
                <div className="px-1 py-2">
                  <ThemeToggle />
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-10">
        {children}
      </main>

      <footer className="border-t border-slate-200 mt-10">
        <div className="container mx-auto px-4 py-6 text-sm text-slate-500">
          <span>© {new Date().getFullYear()} Kube Credential</span>
        </div>
      </footer>
    </div>
  );
};
