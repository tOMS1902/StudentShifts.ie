
import React from 'react';
import { UserMode, User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  activeMode: UserMode;
  onModeSwitch: (mode: UserMode) => void;
  onLogout: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onAuthClick: () => void;
  currentScreen: string;
  setScreen: (screen: any) => void;
  onFooterLinkClick: (type: string) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children, user, activeMode, onModeSwitch, onLogout, darkMode, toggleDarkMode, onAuthClick, currentScreen, setScreen, onFooterLinkClick
}) => {
  const isEmployer = user?.mode === UserMode.EMPLOYER;

  return (
    <div className="min-h-screen flex flex-col bg-warm-50 dark:bg-zinc-950 transition-colors duration-300">
      <header className="sticky top-0 z-50 glass border-b border-warm-200 dark:border-zinc-800 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setScreen(isEmployer ? 'dashboard' : 'feed')}
          >
            <div className="w-10 h-10 bg-magenta flex items-center justify-center rounded-2xl shadow-lg shadow-magenta/20 transition-transform group-hover:scale-110">
              <span className="material-symbols-outlined text-white text-2xl font-bold">work_history</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight leading-none bg-gradient-to-r from-magenta to-magenta-300 bg-clip-text text-transparent">
                StudentShifts<span className="text-magenta-500">.ie</span>
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-0.5">Campus Marketplace</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 ml-12 flex-1">
            {!user ? (
              <>
                <HeaderLink icon="search" label="Find Shifts" active={activeMode === UserMode.STUDENT} onClick={() => { onModeSwitch(UserMode.STUDENT); setScreen('feed'); }} />
                <HeaderLink icon="business" label="Hire Talent" active={activeMode === UserMode.EMPLOYER} onClick={() => { onModeSwitch(UserMode.EMPLOYER); setScreen('feed'); }} />
              </>
            ) : isEmployer ? (
              <>
                <HeaderLink icon="dashboard" label="Console" active={currentScreen === 'dashboard'} onClick={() => setScreen('dashboard')} />
                <HeaderLink icon="mail" label="Inbox" active={currentScreen === 'inbox'} onClick={() => setScreen('inbox')} />
                <HeaderLink icon="add_box" label="Post Shift" active={currentScreen === 'create-job'} onClick={() => setScreen('create-job')} />
              </>
            ) : (
              <>
                <HeaderLink icon="explore" label="Explore" active={currentScreen === 'feed'} onClick={() => setScreen('feed')} />
                <HeaderLink icon="assignment" label="My Applications" active={currentScreen === 'tracker'} onClick={() => setScreen('tracker')} />
                <HeaderLink icon="person" label="My Profile" active={currentScreen === 'profile'} onClick={() => setScreen('profile')} />
              </>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl hover:bg-warm-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
              aria-label="Toggle dark mode"
            >
              <span className="material-symbols-outlined text-xl">
                {darkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            <div className="h-6 w-px bg-warm-200 dark:border-zinc-800 hidden sm:block"></div>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-bold truncate max-w-[120px]">{user.firstName}</span>
                  <span className="text-[9px] uppercase font-black text-magenta/60">{user.mode}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="bg-magenta hover:bg-magenta-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-lg shadow-magenta/10"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation View (Horizontal Scroll) */}
        <div className="md:hidden flex items-center gap-4 overflow-x-auto mt-4 pb-1 scrollbar-hide border-t border-warm-100 dark:border-zinc-800 pt-3">
          {user && (isEmployer ? (
            <>
              <HeaderLink icon="dashboard" label="Console" active={currentScreen === 'dashboard'} onClick={() => setScreen('dashboard')} />
              <HeaderLink icon="mail" label="Inbox" active={currentScreen === 'inbox'} onClick={() => setScreen('inbox')} />
              <HeaderLink icon="add_box" label="Post" active={currentScreen === 'create-job'} onClick={() => setScreen('create-job')} />
            </>
          ) : (
            <>
              <HeaderLink icon="explore" label="Explore" active={currentScreen === 'feed'} onClick={() => setScreen('feed')} />
              <HeaderLink icon="assignment" label="Apps" active={currentScreen === 'tracker'} onClick={() => setScreen('tracker')} />
              <HeaderLink icon="person" label="Profile" active={currentScreen === 'profile'} onClick={() => setScreen('profile')} />
            </>
          ))}
          {!user && (
            <>
              <HeaderLink icon="search" label="Find" active={activeMode === UserMode.STUDENT} onClick={() => { onModeSwitch(UserMode.STUDENT); setScreen('feed'); }} />
              <HeaderLink icon="business" label="Hire" active={activeMode === UserMode.EMPLOYER} onClick={() => { onModeSwitch(UserMode.EMPLOYER); setScreen('feed'); }} />
            </>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-8">
        {children}
      </main>

      <footer className="py-12 px-4 border-t border-warm-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-magenta">work_history</span>
            <span className="font-bold text-sm">StudentShifts.ie</span>
          </div>
          <div className="flex gap-8 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
            <button onClick={() => onFooterLinkClick('privacy')} className="hover:text-magenta transition-colors">Privacy</button>
            <button onClick={() => onFooterLinkClick('terms')} className="hover:text-magenta transition-colors">Terms</button>
            <button onClick={() => onFooterLinkClick('contact')} className="hover:text-magenta transition-colors">Contact</button>
            <button onClick={() => onFooterLinkClick('about')} className="hover:text-magenta transition-colors">About Us</button>
          </div>
          <p className="text-[11px] text-zinc-400">© 2025 StudentShifts.ie — Made for Irish Students</p>
        </div>
      </footer>
    </div>
  );
};

interface HeaderLinkProps {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

const HeaderLink: React.FC<HeaderLinkProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${active ? 'text-magenta bg-magenta/5 font-bold' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
  >
    <span className={`material-symbols-outlined text-xl ${active ? 'material-symbols-fill' : ''}`}>
      {icon}
    </span>
    <span className="text-xs">{label}</span>
  </button>
);

export default Layout;
