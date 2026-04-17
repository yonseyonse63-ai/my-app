/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { BalanceHero, StatCardsColumn } from './components/StatCards';
import { RevenueChart } from './components/RevenueChart';
import { TransactionVolumeChart } from './components/TransactionVolumeChart';
import { IncomeBreakdown } from './components/IncomeBreakdown';
import { TransactionList } from './components/Transactions';
import { PaymentMethods } from './components/PaymentMethods';
import { RevenueGoal } from './components/RevenueGoal';
import { NewTransactionModal } from './components/NewTransactionModal';
import { SettingsModal } from './components/SettingsModal';
import { CurrencyProvider } from './context/CurrencyContext';
import { Home, BarChart2, Wallet, User, Plus, Zap, ArrowUpRight, Crown, RefreshCw, MinusCircle } from 'lucide-react';
import { SaleNeonIcon, WithdrawalNeonIcon, RewardNeonIcon, RefundNeonIcon, ExpenseNeonIcon } from './components/CustomIcons';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { socketService } from './services/socketService';
import { Transaction } from './types';

const getIconForType = (type: string) => {
  switch (type) {
    case 'sale': return SaleNeonIcon;
    case 'withdrawal': return WithdrawalNeonIcon;
    case 'reward': return RewardNeonIcon;
    case 'refund': return RefundNeonIcon;
    case 'expense': return ExpenseNeonIcon;
    default: return SaleNeonIcon;
  }
};

const getColorForType = (type: string) => {
  switch (type) {
    case 'sale': return 'text-secondary-base';
    case 'withdrawal': return 'text-primary-base';
    case 'reward': return 'text-tertiary-base';
    case 'refund': return 'text-orange-400';
    case 'expense': return 'text-rose-500';
    default: return 'text-on-background';
  }
};

const getBgColorForType = (type: string) => {
  switch (type) {
    case 'sale': return 'bg-secondary-base/10';
    case 'withdrawal': return 'bg-primary-base/10';
    case 'reward': return 'bg-tertiary-base/10';
    case 'refund': return 'bg-orange-400/10';
    case 'expense': return 'bg-rose-500/10';
    default: return 'bg-on-background/10';
  }
};

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Real-time state
  const [revenue, setRevenue] = useState(2450);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    document.documentElement.dir = 'rtl';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Connect to WebSocket
    socketService.connect();

    socketService.onInitialData((data) => {
      setRevenue(data.revenue);
      const enhancedTxs = data.transactions.map((tx: any) => ({
        ...tx,
        icon: getIconForType(tx.type),
        color: getColorForType(tx.type),
        bgColor: getBgColorForType(tx.type)
      }));
      setTransactions(enhancedTxs);
      setIsLoading(false);
    });

    socketService.onDataUpdate((data) => {
      if (data.revenue !== undefined) setRevenue(data.revenue);
      if (data.transactions) {
        const enhancedTxs = data.transactions.map((tx: any) => ({
          ...tx,
          icon: getIconForType(tx.type),
          color: getColorForType(tx.type),
          bgColor: getBgColorForType(tx.type)
        }));
        setTransactions(enhancedTxs);
      }
    });

    return () => {
      socketService.disconnect();
    };
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const handleDeposit = (amount: number) => {
    socketService.deposit(amount);
  };

  const handleWithdraw = (amount: number) => {
    socketService.withdraw(amount);
  };

  if (!mounted) return null;

  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-background-base text-on-background pb-24 md:pb-0 md:pr-64 transition-colors duration-300">
        <Sidebar onSettingsClick={() => setIsSettingsOpen(true)} />
        
        <main className="relative z-10">
          <TopBar 
            isDark={isDark} 
            toggleTheme={toggleTheme} 
            onNotificationsClick={() => setIsSettingsOpen(true)} 
          />
          
          <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Hero Section */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <BalanceHero 
                amount={revenue} 
                onDeposit={handleDeposit}
                onWithdraw={handleWithdraw}
              />
              <StatCardsColumn />
            </section>

            {/* Charts Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart />
              <TransactionVolumeChart />
            </section>

            {/* Breakdown & Goals */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <RevenueGoal current={revenue} />
              <IncomeBreakdown />
              <PaymentMethods />
            </section>

            {/* Transactions */}
            <section className="pb-8">
              <TransactionList transactions={transactions} isLoading={isLoading} />
            </section>
          </div>
        </main>

        {/* New Transaction Modal */}
        <NewTransactionModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={(tx) => socketService.createTransaction(tx)}
        />

        {/* Settings / Notifications Modal */}
        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />

        {/* Mobile Bot Nav */}
        <nav className="md:hidden fixed bottom-6 left-6 right-6 z-50 flex justify-around items-center h-16 glass rounded-2xl shadow-2xl border-on-background/10">
          <MobileNavItem icon={Home} label="الرئيسية" />
          <MobileNavItem icon={BarChart2} label="الأرباح" active />
          <MobileNavItem icon={Wallet} label="المحفظة" />
          <MobileNavItem icon={User} label="حسابي" />
        </nav>

        {/* Floating Action Button */}
        <motion.button 
          onClick={() => setIsModalOpen(true)}
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-24 left-6 md:bottom-12 md:left-12 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary-base to-primary-dim shadow-[0_10px_30px_rgba(186,158,255,0.4)] flex items-center justify-center text-background-base cursor-pointer"
        >
          <Plus className="w-8 h-8 font-bold" />
        </motion.button>
      </div>
    </CurrencyProvider>
  );
}

function MobileNavItem({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-primary-base' : 'text-on-background/40'}`}>
      <Icon className={`w-5 h-5 ${active ? 'drop-shadow-[0_0_8px_rgba(186,158,255,0.6)]' : ''}`} />
      <span className="text-[8px] font-bold uppercase tracking-widest">{label}</span>
      {active && <motion.div layoutId="nav-line" className="w-1 h-1 bg-primary-base rounded-full" />}
    </button>
  );
}
