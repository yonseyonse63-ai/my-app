import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, Tooltip, Cell, YAxis, CartesianGrid } from 'recharts';
import { Calendar, ChevronRight, ChevronLeft, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const monthlyData = [
  { label: 'يناير', amount: 1200 },
  { label: 'فبراير', amount: 1800 },
  { label: 'مارس', amount: 3100 },
  { label: 'ابريل', amount: 2100 },
  { label: 'مايو', amount: 1400 },
  { label: 'يونيو', amount: 2500 },
];

const dailyData = [
  { label: 'السبت', amount: 450 },
  { label: 'الأحد', amount: 620 },
  { label: 'الاثنين', amount: 580 },
  { label: 'الثلاثاء', amount: 710 },
  { label: 'الأربعاء', amount: 890 },
  { label: 'الخميس', amount: 520 },
  { label: 'الجمعة', amount: 950 },
];

const yearlyTrend = [
  { label: 'يناير', amount: 12000, trend: 11000 },
  { label: 'فبراير', amount: 18000, trend: 15000 },
  { label: 'مارس', amount: 31000, trend: 28000 },
  { label: 'ابريل', amount: 21000, trend: 24000 },
  { label: 'مايو', amount: 14000, trend: 18000 },
  { label: 'يونيو', amount: 25000, trend: 22000 },
  { label: 'يوليو', amount: 28000, trend: 26000 },
  { label: 'أغسطس', amount: 32000, trend: 30000 },
  { label: 'سبتمبر', amount: 29000, trend: 31000 },
  { label: 'أكتوبر', amount: 34000, trend: 33000 },
  { label: 'نوفمبر', amount: 41000, trend: 38000 },
  { label: 'ديسمبر', amount: 45000, trend: 42000 },
];

export function RevenueChart() {
  const [view, setView] = useState<'monthly' | 'daily' | 'custom'>('monthly');
  const [trendPeriod, setTrendPeriod] = useState<'7days' | 'month' | 'year'>('month');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState({ start: '2026-04-01', end: '2026-04-16' });

  // Generate simulated data for custom range
  const customData = useMemo(() => {
    if (view !== 'custom') return [];
    
    // Just a fun mock sequence based on date range string lengths/keys to keep it stable
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return Array.from({ length: Math.min(diffDays, 14) }).map((_, i) => {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      const label = date.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
      return {
        label,
        amount: Math.floor(Math.random() * 800) + 200
      };
    });
  }, [view, dateRange]);

  const activeData = view === 'monthly' ? monthlyData : (view === 'daily' ? dailyData : customData);

  const trendData = useMemo(() => {
    if (trendPeriod === '7days') return dailyData;
    if (trendPeriod === 'year') return yearlyTrend;
    // Mock 30 days for month
    return Array.from({ length: 30 }).map((_, i) => ({
      label: `يوم ${30 - i}`,
      amount: Math.floor(Math.sin(i * 0.5) * 200) + 600 + (Math.random() * 100),
    })).reverse();
  }, [trendPeriod]);

  const handleMouseEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="glass p-8 rounded-3xl h-full border-on-background/5">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <h3 className="text-xl font-bold font-headline">اتجاهات العوائد</h3>
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-1">تتبع التدفق المالي عبر الزمن</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <AnimatePresence mode="wait">
            {view === 'custom' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 bg-surface-high/50 p-1.5 rounded-xl border border-on-background/5 text-[10px] font-bold"
              >
                <div className="flex items-center gap-2 px-2">
                  <input 
                    type="date" 
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="bg-transparent outline-none text-on-background cursor-pointer"
                  />
                  <ChevronLeft className="w-3 h-3 text-on-surface-variant" />
                  <input 
                    type="date" 
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="bg-transparent outline-none text-on-background cursor-pointer"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-1 bg-surface-high/50 p-1 rounded-xl border border-on-background/5">
            <ViewBtn active={view === 'monthly'} onClick={() => setView('monthly')}>شهري</ViewBtn>
            <ViewBtn active={view === 'daily'} onClick={() => setView('daily')}>آخر 7 أيام</ViewBtn>
            <ViewBtn active={view === 'custom'} onClick={() => setView('custom')}>
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                <span>مخصص</span>
              </div>
            </ViewBtn>
          </div>
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={activeData}>
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#a3aac4', fontSize: 10, fontWeight: 'bold' }}
              dy={10}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(186, 158, 255, 0.05)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-surface-base border border-primary-base/30 p-3 rounded-xl shadow-2xl backdrop-blur-md animate-in fade-in zoom-in duration-200">
                      <p className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest">{payload[0].payload.label}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary-base shadow-[0_0_5px_rgba(186,158,255,0.8)]" />
                        <p className="text-sm font-black text-on-background">
                          {payload[0].value?.toLocaleString()} <span className="text-[10px] text-on-surface-variant">د.إ</span>
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="amount" 
              radius={[6, 6, 0, 0]}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {activeData.map((entry, index) => {
                const isHovered = activeIndex === index;
                const isDefaultActive = activeIndex === null && (
                  view === 'monthly' ? entry.label === 'مارس' : 
                  view === 'daily' ? entry.label === 'الجمعة' :
                  index === activeData.length - 1
                );
                const isActive = isHovered || isDefaultActive;

                return (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={isActive ? '#ba9eff' : '#1f2b49'} 
                    className={`transition-all duration-300 cursor-pointer ${isActive ? 'drop-shadow-[0_0_12px_rgba(186,158,255,0.6)]' : 'opacity-80 hover:opacity-100'}`}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* New Revenue Trends Section */}
      <div className="mt-12 pt-8 border-t border-on-background/5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-secondary-base/10 text-secondary-base shadow-[0_0_15px_rgba(0,255,240,0.1)]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-black text-on-background uppercase tracking-widest">تحليل الاتجاهات المتقدم</h4>
              <p className="text-[9px] text-on-surface-variant font-bold mt-0.5">مقارنة الأداء التشغيلي عبر الفترات الزمنية</p>
            </div>
          </div>

          <div className="flex gap-1 bg-surface-high/50 p-1 rounded-xl border border-on-background/5">
            <ViewBtn active={trendPeriod === '7days'} onClick={() => setTrendPeriod('7days')}>آخر الأسبوع</ViewBtn>
            <ViewBtn active={trendPeriod === 'month'} onClick={() => setTrendPeriod('month')}>الشهر الحالي</ViewBtn>
            <ViewBtn active={trendPeriod === 'year'} onClick={() => setTrendPeriod('year')}>السنة</ViewBtn>
          </div>
        </div>

        <div className="h-48 w-full group">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00fff0" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00fff0" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="label" 
                hide={trendPeriod === 'month'} // Hide labels for daily month points to avoid clutter
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#a3aac4', fontSize: 9, fontWeight: 'bold' }}
                dy={10}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-surface-base border border-secondary-base/30 p-2 rounded-lg shadow-2xl backdrop-blur-md">
                        <p className="text-[9px] font-black text-secondary-base mb-1 uppercase tracking-widest">{payload[0].payload.label}</p>
                        <p className="text-xs font-black text-on-background">
                          {payload[0].value?.toLocaleString()} د.إ
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#00fff0" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#trendGradient)" 
                className="drop-shadow-[0_0_8px_rgba(0,255,240,0.4)] transition-all duration-300 group-hover:drop-shadow-[0_0_15px_rgba(0,255,240,0.6)]"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <AnimatePresence>
        {view === 'daily' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8 pt-8 border-t border-on-background/5"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-4 bg-secondary-base rounded-full" />
              <h4 className="text-[11px] font-black text-on-background uppercase tracking-widest">إحصائيات الأسبوع التفصيلية (٧ أيام)</h4>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {dailyData.map((day, i) => (
                <div key={i} className="bg-surface-high/30 p-3 rounded-2xl border border-on-background/5 text-right hover:border-primary-base/30 transition-all group">
                  <p className="text-[8px] text-on-surface-variant font-bold uppercase mb-1 group-hover:text-primary-base transition-colors">{day.label}</p>
                  <p className="text-xs font-black text-on-background tracking-tight">{day.amount.toLocaleString()} د.إ</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ViewBtn({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all whitespace-nowrap",
        active 
          ? "bg-primary-base text-background-base shadow-[0_5px_15px_rgba(186,158,255,0.3)]" 
          : "text-on-surface-variant hover:text-on-background"
      )}
    >
      {children}
    </button>
  );
}
