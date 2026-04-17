import { Wallet, Bell, Sun, Moon, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency } from '../context/CurrencyContext';
import { Tooltip } from './ui/Tooltip';
import { cn } from '../lib/utils';

interface TopBarProps {
  isDark: boolean;
  toggleTheme: () => void;
  onNotificationsClick?: () => void;
  notificationCount?: number;
}

export function TopBar({ isDark, toggleTheme, onNotificationsClick, notificationCount = 3 }: TopBarProps) {
  const { currency, setCurrency, formatAmount } = useCurrency();

  return (
    <header className="sticky top-0 z-30 bg-background-base/80 backdrop-blur-md flex justify-between items-center px-6 py-4 border-b border-on-background/5 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-surface-high border border-primary-base/20 overflow-hidden">
          <img 
            src="https://picsum.photos/seed/artist/100/100" 
            alt="Profile" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="hidden sm:block">
          <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">مرحباً بك،</p>
          <p className="text-sm font-bold text-primary-base">The Neon Forge</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Currency Selector */}
        <Tooltip content="تغيير العملة المستخدمة">
          <div className="flex items-center gap-2 bg-surface-high px-3 py-1.5 rounded-xl border border-on-background/10">
            <Globe className="w-3.5 h-3.5 text-on-surface-variant" />
            <select 
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
              className="bg-transparent text-[10px] font-black text-on-background focus:outline-none cursor-pointer uppercase tracking-tighter"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </Tooltip>

        {/* Theme Toggle - Advanced Sliding Switch */}
        <Tooltip content={isDark ? 'التبديل للوضع المضيء' : 'التبديل للوضع الليلي'}>
          <button 
            onClick={toggleTheme}
            className={cn(
              "relative w-14 h-8 rounded-full transition-all duration-500 p-1 flex items-center shadow-lg border outline-none",
              isDark 
                ? "bg-surface-high border-primary-base/20 " 
                : "bg-surface-high border-secondary-base/20"
            )}
          >
            <motion.div
              animate={{ 
                x: isDark ? 24 : 0,
                backgroundColor: isDark ? '#ba9eff' : '#53ddfc',
                boxShadow: isDark 
                  ? '0 0 15px rgba(186, 158, 255, 0.5)' 
                  : '0 0 15px rgba(83, 221, 252, 0.5)'
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-6 h-6 rounded-full flex items-center justify-center z-10"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? 'moon' : 'sun'}
                  initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? (
                    <Moon className="w-3.5 h-3.5 text-background-base" />
                  ) : (
                    <Sun className="w-3.5 h-3.5 text-background-base" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
            
            {/* Background Icons */}
            <div className="absolute inset-0 flex justify-between items-center px-2.5 opacity-30 pointer-events-none">
              <Sun className={cn("w-3 h-3", !isDark ? "text-secondary-base" : "text-on-surface-variant")} />
              <Moon className={cn("w-3 h-3", isDark ? "text-primary-base" : "text-on-surface-variant")} />
            </div>
          </button>
        </Tooltip>

        <Tooltip content="رصيدك الإجمالي المتوفر">
          <div className="flex items-center gap-3 bg-surface-high px-4 py-2 rounded-full border border-on-background/10">
            <span className="text-secondary-base font-bold text-sm tracking-tighter">{formatAmount(12450.00)}</span>
            <Wallet className="w-4 h-4 text-primary-base" />
          </div>
        </Tooltip>

        <Tooltip content="عرض التنبيهات الجديدة">
          <button 
            onClick={onNotificationsClick}
            className="p-2 rounded-full bg-surface-high border border-on-background/10 text-on-background/60 hover:text-primary-base transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 border-2 border-background-base shadow-[0_0_10px_rgba(239,68,68,0.4)]"
              >
                {notificationCount}
              </motion.span>
            )}
          </button>
        </Tooltip>
      </div>
    </header>
  );
}
