import { Store, MousePointer2, IdCard, ExternalLink, TrendingUp, TrendingDown, Layers } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useCurrency } from '../context/CurrencyContext';

const sources = [
  { 
    name: 'مبيعات المتجر', 
    amount: 7450, 
    percent: 65, 
    growth: 12.5,
    color: 'bg-secondary-base', 
    icon: Store, 
    iconColor: 'text-secondary-base' 
  },
  { 
    name: 'عائدات الإعلانات', 
    amount: 3200, 
    percent: 40, 
    growth: -2.4,
    color: 'bg-primary-base', 
    icon: MousePointer2, 
    iconColor: 'text-primary-base' 
  },
  { 
    name: 'مكافآت الاشتراكات', 
    amount: 1800, 
    percent: 25, 
    growth: 8.1,
    color: 'bg-tertiary-base', 
    icon: IdCard, 
    iconColor: 'text-tertiary-base' 
  },
  { 
    name: 'بيع الأصول الرقمية', 
    amount: 2150, 
    percent: 32, 
    growth: 15.3,
    color: 'bg-primary-dim', 
    icon: Layers, 
    iconColor: 'text-primary-dim' 
  },
];

export function IncomeBreakdown() {
  const { formatAmount } = useCurrency();
  const totalIncome = sources.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="lg:col-span-2 glass p-8 rounded-3xl flex flex-col h-full space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold font-headline mb-1">تفاصيل الدخل</h3>
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">تحليل مفصل حسب المصدر</p>
        </div>
        <button className="p-2 rounded-lg bg-surface-high border border-on-background/5 text-on-surface-variant hover:text-primary-base transition-colors">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-surface-high border border-on-background/5">
          <p className="text-[10px] text-on-surface-variant font-bold mb-1">إجمالي الدخل المحلل</p>
          <p className="text-2xl font-headline font-black text-on-background">{formatAmount(totalIncome)}</p>
        </div>
        <div className="p-4 rounded-2xl bg-surface-high border border-on-background/5">
          <p className="text-[10px] text-on-surface-variant font-bold mb-1">عدد المصادر</p>
          <p className="text-2xl font-headline font-black text-secondary-base">{sources.length}</p>
        </div>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto pr-1">
        {sources.map((source, index) => (
          <motion.div 
            key={source.name} 
            className="group"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-xl bg-surface-high border border-on-background/5 group-hover:bg-on-background/5 transition-colors")}>
                  <source.icon className={cn("w-5 h-5", source.iconColor)} />
                </div>
                <div>
                  <span className="text-sm font-bold block mb-0.5">{source.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-on-surface-variant">{source.percent}% من الإنتاج</span>
                    <div className={cn(
                      "flex items-center gap-0.5 text-[10px] font-black",
                      source.growth >= 0 ? "text-secondary-base" : "text-tertiary-base"
                    )}>
                      {source.growth >= 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                      {Math.abs(source.growth)}%
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-left">
                <span className="font-headline font-black text-on-background block">{formatAmount(source.amount)}</span>
                <span className="text-[9px] text-on-surface-variant font-bold tracking-tighter">صافي الإيرادات</span>
              </div>
            </div>
            <div className="w-full bg-surface-high h-2.5 rounded-full overflow-hidden border border-on-background/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${source.percent}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.1 + 0.5 }}
                className={cn(source.color, "h-full rounded-full transition-all shadow-[0_0_10px_currentColor]")}
              ></motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pt-4 border-t border-on-background/5">
        <button className="w-full py-3 bg-surface-high rounded-xl text-xs font-bold text-on-surface-variant hover:bg-on-background/5 hover:text-primary-base transition-all border border-on-background/5">
          تحميل تقرير الإيرادات الكامل (PDF)
        </button>
      </div>
    </div>
  );
}
