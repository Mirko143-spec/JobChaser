import { useState } from 'react';
import { Outlet, Link } from 'react-router';
import { useTheme } from './contexts/ThemeContext';
import { useAuthStore } from './stores/authStore';

function App() {
  const { theme, toggleTheme } = useTheme();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const logout = useAuthStore(state => state.logout);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="h-full bg-white text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-white">
        <header className="flex items-center justify-between bg-slate-600 px-4 py-4 text-white dark:bg-slate-800">
          <div className="flex-1">
            <Link to="/" className="cursor-pointer text-2xl font-bold">
              Jobchaser
            </Link>
          </div>

          <nav className="flex flex-1 items-center justify-center space-x-4">
            <Link to="/jobs" className="cursor-pointer hover:underline">
              Jobs
            </Link>
            <button
              onClick={toggleTheme}
              className="rounded-md bg-white px-3 py-1 text-sm font-medium text-slate-600 hover:bg-gray-100 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </nav>

          <div className="flex flex-1 justify-end">
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-600 hover:bg-gray-100 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
              {isMenuOpen && (
                <div className="ring-opacity-5 absolute top-full right-0 mt-2 w-40 rounded-md bg-white py-2 shadow-lg ring-1 ring-black dark:bg-gray-800">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/saved"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Saved Jobs
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/signin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/signup"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="h-full w-screen">
          <Outlet />
        </main>

        <footer className="bg-slate-600 p-4 text-center text-white dark:bg-slate-800">
          @2026 Jobchaser
        </footer>
      </div>
    </div>
  );
}
export default App;
