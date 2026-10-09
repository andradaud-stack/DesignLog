import React from 'react';
import {
  LayoutDashboard,
  Images,
  Calendar,
  BarChart3,
  Building2,
  CheckSquare,
} from 'lucide-react';
import { useWorks } from '../../context/WorksContext';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab } = useWorks();

  const navItems = [
    { id: 'dashboard', label: 'Dash', icon: LayoutDashboard },
    { id: 'my-works', label: 'Works', icon: Images },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Cal', icon: Calendar },
    { id: 'statistics', label: 'Stats', icon: BarChart3 },
    { id: 'hotels', label: 'Hotels', icon: Building2 },
  ] as const;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-navy-950/90 backdrop-blur-xl z-40 flex items-center justify-around px-2 border-t border-slate-200/80 dark:border-navy-800/80 shadow-lg">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl transition-all ${
              isActive
                ? 'bg-electric-500 text-white font-bold shadow-sm shadow-electric-500/25 scale-105'
                : 'text-slate-500 dark:text-slate-400 hover:text-navy-950 dark:hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
