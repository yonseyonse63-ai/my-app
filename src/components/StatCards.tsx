import { TrendingUp, ShoppingCart, Users, Banknote, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';

export function BalanceHero({ 
  amount, 
  onDeposit, 
  onWithdraw 
}: { 
  amount: number;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
}) {
  const { formatAmount } = useCurrency();
  const [actionAmount, setActionAmount] = useState('100');

  return (
    <div className="lg:col-span-2 relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-surface-high to-surface-base border border-on-background/10 group">
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-base/10 blur-[100px] rounded-full group-hover:bg-primary-base/20 transition-all duration-700"></div>
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-secondary-base/10 blur-[100px] rounded-full group-hover:bg-secondary-base/20 transition-all duration-700"></div>
      
      <div className="relative z-10 flex flex-col h-full justify-between gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-on-surface-variant text-sm font-medium mb-2 opacity-80 uppercase tracking-widest">إجمالي الرصيد القابل للسحب</p>
            <h2 className="text-5xl md:text-6xl font-headline font-bold text-on-background flex items-baseline gap-2">
              {formatAmount(amount)}
            </h2>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mr-1">المبلغ للعملية</label>
            <div className="flex items-center gap-2 bg-on-background/5 p-1 rounded-2xl border border-on-background/10">
              <input 
                type="number"
                value={actionAmount}
                onChange={(e) => setActionAmount(e.target.value)}
                className="bg-transparent w-24 text-center font-mono font-bold text-sm focus:outline-none"
              />
              <span className="text-[10px] font-black text-on-surface-variant uppercase ml-2">USD</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onWithdraw(parseFloat(actionAmount))}
            className="flex items-center gap-2 bg-gradient-to-r from-primary-base to-primary-dim text-background-base px-8 py-4 rounded-full font-extrabold shadow-[0_10px_30px_rgba(186,158,255,0.3)] transition-all"
          >
            <ArrowUpCircle className="w-5 h-5" />
            سحب الرصيد
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDeposit(parseFloat(actionAmount))}
            className="flex items-center gap-2 bg-surface-high border border-on-background/10 text-on-background px-8 py-4 rounded-full font-extrabold hover:bg-on-background/5 transition-all"
          >
            <ArrowDownCircle className="w-5 h-5 text-secondary-base" />
            إيداع رصيد
          </motion.button>

          <div className="flex items-center gap-2 text-secondary-base text-sm font-bold ml-auto">
            <TrendingUp className="w-4 h-4" />
            <span>+12.5% منذ الشهر الماضي</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatCardsColumn() {
  const { formatAmount } = useCurrency();
  const stats = [
    { label: 'أرباح هذا الشهر', value: formatAmount(3120), icon: Banknote, color: 'text-secondary-base', bgColor: 'bg-secondary-base/10' },
    { label: 'عدد المبيعات', value: '1,402', icon: ShoppingCart, color: 'text-primary-base', bgColor: 'bg-primary-base/10' },
    { label: 'متوسط العائد', value: formatAmount(2.24), icon: Users, color: 'text-tertiary-base', bgColor: 'bg-tertiary-base/10' },
  ];
  return (
    <div className="flex flex-col gap-4">
      {stats.map((stat, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass p-5 rounded-2xl flex items-center justify-between hover:border-on-background/20 transition-colors"
        >
          <div>
            <p className="text-[10px] text-on-surface-variant mb-1 font-bold">{stat.label}</p>
            <p className="text-xl font-headline font-extrabold tracking-tight">{stat.value}</p>
          </div>
          <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center ${stat.color}`}>
            <stat.icon className="w-6 h-6" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
