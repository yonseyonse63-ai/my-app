import { LogOut, LayoutDashboard, Store, BarChart3, Settings, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Tooltip } from './ui/Tooltip';

const navItems = [
  { icon: LayoutDashboard, label: 'لوحة التحكم', active: false, id: 'dash' },
  { icon: Store, label: 'المتجر', active: false, id: 'store' },
  { icon: BarChart3, label: 'الإحصائيات', active: true, id: 'stats' },
];

interface SidebarProps {
  onSettingsClick?: () => void;
}

export function Sidebar({ onSettingsClick }: SidebarProps) {
  return (
    <aside className="fixed top-0 right-0 h-screen w-64 z-40 bg-surface-base border-l border-on-background/10 shadow-2xl hidden md:flex flex-col">
      <div className="p-8">
        <h1 className="text-xl font-bold text-primary-base tracking-tight font-headline">
          Luminescent Workshop
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <Tooltip key={item.label} content={item.label} position="left" className="w-full">
            <button
              onClick={item.id === 'settings' ? onSettingsClick : undefined}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                item.active 
                  ? "text-primary-base bg-primary-base/10 font-bold border-r-4 border-secondary-base shadow-[0_0_20px_rgba(186,158,255,0.15)]" 
                  : "text-on-background/50 hover:text-on-background hover:bg-on-background/5"
              )}
            >
              <item.icon className={cn("w-5 h-5", item.active && "text-secondary-base")} />
              <span className="text-sm">{item.label}</span>
            </button>
          </Tooltip>
        ))}
      </nav>

      <div className="p-4 space-y-4">
        {/* User Profile Hook */}
        <button 
          onClick={onSettingsClick}
          className="w-full flex items-center gap-3 p-3 rounded-2xl bg-on-background/[0.03] border border-on-background/5 hover:bg-on-background/5 transition-all group text-right"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-base to-secondary-base flex items-center justify-center text-background-base shadow-[0_5px_15px_rgba(186,158,255,0.3)] group-hover:scale-105 transition-transform">
              <User className="w-6 h-6" />
            </div>
            <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 bg-secondary-base border-2 border-surface-base rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-on-background truncate">يونس المطور</p>
            <p className="text-[9px] text-on-surface-variant font-bold truncate">yonseyonse63@gmail.com</p>
          </div>
          <Settings className="w-4 h-4 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        <Tooltip content="إنهاء الجلسة الحالية" position="left" className="w-full">
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-tertiary-base hover:bg-tertiary-base/5 transition-all">
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-bold">تسجيل الخروج</span>
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}
