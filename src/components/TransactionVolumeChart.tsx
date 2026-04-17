import React, { useState, useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Calendar, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { Tooltip } from './ui/Tooltip';

const DATA_DAY = [
  { time: '00:00', volume: 120 },
  { time: '04:00', volume: 80 },
  { time: '08:00', volume: 450 },
  { time: '12:00', volume: 890 },
  { time: '16:00', volume: 650 },
  { time: '20:00', volume: 920 },
  { time: '23:59', volume: 400 },
];

const DATA_WEEK = [
  { time: 'Sat', volume: 2400 },
  { time: 'Sun', volume: 1800 },
  { time: 'Mon', volume: 4200 },
  { time: 'Tue', volume: 3800 },
  { time: 'Wed', volume: 5100 },
  { time: 'Thu', volume: 4600 },
  { time: 'Fri', volume: 3200 },
];

const DATA_MONTH = [
  { time: 'Jan', volume: 45000 },
  { time: 'Feb', volume: 52000 },
  { time: 'Mar', volume: 48000 },
  { time: 'Apr', volume: 61000 },
  { time: 'May', volume: 55000 },
  { time: 'Jun', volume: 67000 },
];

export function TransactionVolumeChart() {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');

  const activeData = useMemo(() => {
    switch (timeframe) {
      case 'day': return DATA_DAY;
      case 'month': return DATA_MONTH;
      default: return DATA_WEEK;
    }
  }, [timeframe]);

  const totalVolume = useMemo(() => {
    return activeData.reduce((acc, curr) => acc + curr.volume, 0);
  }, [activeData]);

  return (
    <div className="glass rounded-3xl p-6 flex flex-col h-full border-on-background/5">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-base/10 flex items-center justify-center text-primary-base">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-headline">حجم التداول</h3>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">إحصائيات المعاملات والسيولة</p>
          </div>
        </div>

        <div className="flex bg-surface-high/50 p-1 rounded-xl border border-on-background/5">
          <TimeframeBtn active={timeframe === 'day'} onClick={() => setTimeframe('day')}>يومي</TimeframeBtn>
          <TimeframeBtn active={timeframe === 'week'} onClick={() => setTimeframe('week')}>أسبوعي</TimeframeBtn>
          <TimeframeBtn active={timeframe === 'month'} onClick={() => setTimeframe('month')}>شهري</TimeframeBtn>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-end gap-2">
          <span className="text-2xl font-black font-headline text-on-background">{totalVolume.toLocaleString()}</span>
          <span className="text-xs text-secondary-base font-bold mb-1">+12.4% متوقع</span>
        </div>
        <div className="w-full h-1 bg-on-background/5 rounded-full mt-2 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '65%' }}
            className="h-full bg-primary-base shadow-[0_0_10px_rgba(186,158,255,0.5)]"
          />
        </div>
      </div>

      <div className="flex-1 min-h-[250px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={activeData}>
            <defs>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#BA9EFF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#BA9EFF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#BA9EFF10" vertical={false} />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#BA9EFF50', fontSize: 10, fontWeight: 'bold' }}
              dy={10}
            />
            <YAxis hide />
            <RechartsTooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="volume" 
              stroke="#BA9EFF" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorVolume)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-surface-high/30 p-3 rounded-2xl border border-on-background/5 text-right">
          <p className="text-[10px] text-on-surface-variant font-bold uppercase mb-1">المتوسط</p>
          <p className="text-sm font-black text-on-background">{(totalVolume / activeData.length).toFixed(0)}</p>
        </div>
        <div className="bg-surface-high/30 p-3 rounded-2xl border border-on-background/5 text-right">
          <p className="text-[10px] text-on-surface-variant font-bold uppercase mb-1">أعلى قمة</p>
          <p className="text-sm font-black text-secondary-base">{Math.max(...activeData.map(d => d.volume))}</p>
        </div>
      </div>
    </div>
  );
}

function TimeframeBtn({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all",
        active 
          ? "bg-primary-base text-background-base shadow-[0_5px_15px_rgba(186,158,255,0.3)]" 
          : "text-on-surface-variant hover:text-on-background"
      )}
    >
      {children}
    </button>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-base border border-primary-base/30 p-3 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-tighter">{payload[0].payload.time}</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary-base pulse" />
          <p className="text-sm font-black text-on-background tracking-tighter">
            {payload[0].value.toLocaleString()} <span className="text-[10px] text-on-surface-variant">عملية</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
}
