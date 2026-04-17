import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, className, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'top': return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom': return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left': return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right': return 'left-full top-1/2 -translate-y-1/2 ml-2';
      default: return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  };

  return (
    <div 
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: position === 'top' ? 4 : position === 'bottom' ? -4 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: position === 'top' ? 4 : position === 'bottom' ? -4 : 0 }}
            className={cn(
              "absolute z-[100] px-3 py-1.5 rounded-lg bg-surface-high border border-on-background/10 text-[10px] font-bold text-on-background whitespace-nowrap shadow-xl pointer-events-none",
              getPositionClasses()
            )}
          >
            {content}
            <div className={cn(
              "absolute w-2 h-2 bg-surface-high border-on-background/10 rotate-45",
              position === 'top' && "bottom-[-5px] left-1/2 -translate-x-1/2 border-r border-b",
              position === 'bottom' && "top-[-5px] left-1/2 -translate-x-1/2 border-l border-t",
              position === 'left' && "right-[-5px] top-1/2 -translate-y-1/2 border-r border-t",
              position === 'right' && "left-[-5px] top-1/2 -translate-y-1/2 border-l border-b",
            )} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
