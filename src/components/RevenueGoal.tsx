import { Target, TrendingUp, Edit2, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { cn } from '../lib/utils';

export type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_CONFIG = {
  easy: { 
    label: 'سهل', 
    amount: 2500, 
    color: '#53ddfc', 
    secondary: '#ba9eff', 
    glow: 'rgba(83, 221, 252, 0.6)',
    strokeWidth: 16,
    subtle: false
  },
  medium: { 
    label: 'متوسط', 
    amount: 5000, 
    color: '#ba9eff', 
    secondary: '#53ddfc', 
    glow: 'rgba(186, 158, 255, 0.4)',
    strokeWidth: 14,
    subtle: false
  },
  hard: { 
    label: 'صعب جداً', 
    amount: 15000, 
    color: '#ffb95e', 
    secondary: '#ff6b6b', 
    glow: 'rgba(255, 185, 94, 0.2)',
    strokeWidth: 10,
    subtle: true
  },
};

export function RevenueGoal({ current }: { current: number }) {
  const { formatAmount } = useCurrency();
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [goal, setGoal] = useState(DIFFICULTY_CONFIG.medium.amount);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(goal.toString());

  const progress = Math.min((current / goal) * 100, 100);
  const isGoalReached = current >= goal;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const currentLevel = DIFFICULTY_CONFIG[difficulty];

  const handleDifficultyChange = (level: Difficulty) => {
    setDifficulty(level);
    const amount = DIFFICULTY_CONFIG[level].amount;
    setGoal(amount);
    setInputValue(amount.toString());
  };

  const handleSave = () => {
    const newGoal = parseFloat(inputValue);
    if (!isNaN(newGoal) && newGoal > 0) {
      setGoal(newGoal);
      setIsEditing(false);
    }
  };

  return (
    <div 
      className="glass p-8 rounded-3xl relative overflow-hidden h-full flex flex-col justify-between transition-all duration-500"
      style={{
        boxShadow: `0 20px 40px -15px ${currentLevel.glow}`
      }}
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Target className="w-32 h-32" />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <h3 className="text-xl font-bold font-headline">هدف الإيرادات</h3>
            <div className="flex gap-1 mt-1">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
                <button
                  key={level}
                  onClick={() => handleDifficultyChange(level)}
                  className={cn(
                    "text-[8px] font-black uppercase px-2 py-0.5 rounded-full transition-all border",
                    difficulty === level 
                      ? "bg-on-background text-background-base border-transparent" 
                      : "text-on-surface-variant border-on-background/10 hover:border-on-background/30"
                  )}
                >
                  {DIFFICULTY_CONFIG[level].label}
                </button>
              ))}
            </div>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={cn(
              "p-2 rounded-lg transition-all",
              isEditing ? "bg-primary-base text-background-base" : "bg-surface-high border border-on-background/10 text-primary-base hover:bg-primary-base/10"
            )}
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8"
            >
              <label className="block text-[10px] text-on-surface-variant mb-2 uppercase tracking-widest font-black">تعديل المبلغ المستهدف</label>
              <div className="flex gap-2">
                <input 
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="bg-surface-high border border-primary-base/20 rounded-xl px-4 py-2 w-full focus:outline-none focus:border-primary-base font-bold"
                />
                <button 
                  onClick={handleSave}
                  className="bg-primary-base text-background-base px-6 py-2 rounded-xl font-black text-xs uppercase tracking-wider shadow-[0_4px_15px_rgba(186,158,255,0.4)]"
                >
                  حفظ
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-end mb-8"
            >
              <div>
                <p className="text-[10px] text-on-surface-variant mb-1 font-bold uppercase tracking-widest">المحقق حالياً</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-headline font-extrabold" style={{ color: currentLevel.color }}>{formatAmount(current)}</p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-[10px] text-on-surface-variant mb-1 font-bold uppercase tracking-widest text-left">الهدف</p>
                <p className="text-xl font-headline font-bold text-on-background opacity-60">{formatAmount(goal)}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative flex items-center justify-center py-4">
        <svg className="w-48 h-48 transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth={currentLevel.strokeWidth}
            fill="transparent"
            className={cn(
              "text-surface-high transition-all duration-500",
              currentLevel.subtle ? "opacity-10" : "opacity-30"
            )}
          />
          <motion.circle
            cx="96"
            cy="96"
            r={radius}
            stroke={`url(#goalGradient-${difficulty})`}
            strokeWidth={currentLevel.strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "circOut" }}
            strokeLinecap="round"
            className={cn(
              "transition-all duration-700",
              isGoalReached ? "drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" : "drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
            )}
            style={{
              filter: isGoalReached ? `drop-shadow(0 0 15px ${currentLevel.color})` : `drop-shadow(0 0 8px ${currentLevel.color}44)`
            }}
          />
          <defs>
            <linearGradient id={`goalGradient-${difficulty}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={currentLevel.color} />
              <stop offset="100%" stopColor={currentLevel.secondary} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center">
          <motion.span 
            key={`${Math.round(progress)}-${difficulty}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-headline font-black text-on-background"
          >
            {Math.round(progress)}%
          </motion.span>
          <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">من الهدف</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isGoalReached ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 flex flex-col items-center gap-2 text-background-base p-4 rounded-2xl shadow-xl transition-colors duration-500"
            style={{ backgroundColor: currentLevel.color }}
          >
            <div className="flex items-center gap-2">
              <Star className={cn("w-5 h-5", currentLevel.subtle ? "animate-pulse" : "fill-current")} />
              <span className="font-black text-xs uppercase tracking-widest">
                {difficulty === 'hard' 
                  ? `أداء أسطوري! تم اجتياز المستوى الـ ${currentLevel.label}` 
                  : `تهانينا! تم تحقيق المستوى الـ ${currentLevel.label}`
                }
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="tracking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 flex items-center gap-3 text-[11px] p-4 rounded-xl border transition-all duration-500"
            style={{ 
              color: currentLevel.color,
              backgroundColor: `${currentLevel.color}08`,
              borderColor: `${currentLevel.color}22`
            }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${currentLevel.color}15` }}>
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="font-bold leading-relaxed">
              بناءً على وتيرتك الحالية، ستصل لـ {Math.min(Math.round(progress * 1.5), 100)}% من هدفك {currentLevel.label}.
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
