/**
 * Main Layout component with modern glass navigation
 */

import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Squares2X2Icon,
  FolderIcon,
  Cog6ToothIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: ReactNode;
  organizationSlug: string;
}

export function Layout({ children, organizationSlug }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Squares2X2Icon, label: 'Dashboard' },
    { path: '/projects', icon: FolderIcon, label: 'Projects' },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">
      {/* Floating Sidebar (Light Glass) */}
      <aside className="w-72 m-6 flex flex-col glass-card bg-white/80 border-white/60">
        {/* Brand */}
        <div className="p-8 pb-6">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow duration-500">
                <BuildingOfficeIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight font-heading">Sprintly</h1>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{organizationSlug}</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 font-heading">Menu</p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link key={item.path} to={item.path} className="block relative group">
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-emerald-50 rounded-xl border border-emerald-100"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}

                <div className={`
                  relative flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300
                  ${isActive ? 'text-emerald-700' : 'text-slate-500 group-hover:text-slate-800'}
                `}>
                  <item.icon className={`
                    w-6 h-6 transition-colors duration-300
                    ${isActive ? 'text-emerald-500' : 'text-slate-400 group-hover:text-emerald-500'}
                  `} />
                  <span className="font-semibold">{item.label}</span>

                  {isActive && (
                    <motion.div
                      layoutId="activeGlow"
                      className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full"
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User / Footer */}
        <div className="p-4 mt-auto">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-white border-2 border-transparent flex items-center justify-center">
                  <span className="text-xs font-bold text-emerald-600">US</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">Demo User</p>
                <p className="text-xs text-slate-500 truncate">admin@demo.org</p>
              </div>
              <Cog6ToothIcon className="w-5 h-5 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-6 pl-0">
        <div className="h-full glass-card overflow-auto p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;
