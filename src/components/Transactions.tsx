import { ArrowLeft, Tag, CreditCard, Star, Filter, ChevronDown, ChevronUp, Hash, Activity, ShieldCheck, User, Search, FileDown, Table, Calendar, Code, TrendingUp, RotateCcw, Clock, ArrowUpDown, ArrowUpNarrowWide, ArrowDownWideNarrow, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency } from '../context/CurrencyContext';
import { jsPDF } from 'jspdf';
import { Tooltip } from './ui/Tooltip';

import { Transaction } from '../types';

export function TransactionList({ transactions, isLoading }: { transactions: Transaction[], isLoading?: boolean }) {
  const { formatAmount } = useCurrency();
  const [activeType, setActiveType] = useState<string | 'all'>('all');
  const [activeStatus, setActiveStatus] = useState<string | 'all'>('all');
  const [activeUser, setActiveUser] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailQuery, setDetailQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statsPeriod, setStatsPeriod] = useState<'7days' | 'month' | 'all'>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortField, setSortField] = useState<'date' | 'amount' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const stats = useMemo(() => {
    const now = new Date();
    const filteredByTime = transactions.filter(tx => {
      if (statsPeriod === 'all') return true;
      const txDate = new Date(tx.date);
      const diffTime = Math.abs(now.getTime() - txDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (statsPeriod === '7days') return diffDays <= 7;
      if (statsPeriod === 'month') return diffDays <= 30;
      return true;
    });

    return {
      totalSales: filteredByTime.filter(tx => tx.type === 'sale').reduce((acc, tx) => acc + tx.amount, 0),
      totalExpenses: filteredByTime.filter(tx => tx.type === 'expense').reduce((acc, tx) => acc + Math.abs(tx.amount), 0),
      totalRefunds: filteredByTime.filter(tx => tx.type === 'refund').reduce((acc, tx) => acc + Math.abs(tx.amount), 0),
      pendingCount: filteredByTime.filter(tx => tx.status === 'pending').length,
    };
  }, [transactions, statsPeriod]);

  const users = useMemo(() => {
    const uniqueUsers = Array.from(new Set(transactions.map(tx => tx.user).filter(Boolean) as string[]));
    return uniqueUsers;
  }, [transactions]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'sale': return 'بيع منتج';
      case 'withdrawal': return 'سحب رصيد';
      case 'reward': return 'مكافأة';
      case 'refund': return 'استرداد نقدي';
      case 'expense': return 'مصروفات';
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    return status === 'completed' ? 'مكتمل وناجح' : 'قيد التدقيق والمعالجة';
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Transaction Report', 105, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 22, { align: 'center' });

    // Table Header
    doc.setFontSize(12);
    doc.rect(10, 30, 190, 8);
    doc.text('ID', 15, 35);
    doc.text('Type', 40, 35);
    doc.text('Amount', 90, 35);
    doc.text('Status', 130, 35);
    doc.text('User', 170, 35);

    // Data
    doc.setFontSize(10);
    filteredTransactions.forEach((tx, index) => {
      const y = 45 + (index * 8);
      doc.text(`#TX-${tx.id.padStart(6, '0')}`, 15, y);
      doc.text(tx.type.toUpperCase(), 40, y);
      doc.text(`${tx.amount > 0 ? '+' : ''}${tx.amount.toFixed(2)}`, 90, y);
      doc.text(tx.status.toUpperCase(), 130, y);
      doc.text(tx.user, 170, y);
    });

    doc.save(`Transactions_Report_${new Date().getTime()}.pdf`);
  };

  const generateJSON = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Transactions_Full_Export_${new Date().getTime()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCSV = () => {
    const headers = ['Transaction ID', 'Title', 'Detail', 'Amount', 'Status', 'Type', 'User'];
    const rows = filteredTransactions.map(tx => [
      `TX-${tx.id.padStart(6, '0')}`,
      tx.title,
      tx.detail,
      tx.amount.toFixed(2),
      tx.status,
      tx.type,
      tx.user
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Transactions_Report_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (field: 'date' | 'amount' | 'type') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredTransactions = useMemo(() => {
    const result = transactions.filter(tx => {
      const typeMatch = activeType === 'all' || tx.type === activeType;
      const statusMatch = activeStatus === 'all' || tx.status === activeStatus;
      const userMatch = activeUser === 'all' || tx.user === activeUser;
      
      const txDate = new Date(tx.date).getTime();
      const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : -Infinity;
      const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : Infinity;
      const dateMatch = txDate >= start && txDate <= end;

      const searchLower = searchQuery.toLowerCase();
      const detailLower = detailQuery.toLowerCase();
      
      const searchMatch = searchQuery === '' || 
        tx.title.toLowerCase().includes(searchLower) || 
        (tx.detail && tx.detail.toLowerCase().includes(searchLower));
        
      const detailMatch = detailQuery === '' ||
        (tx.detail && tx.detail.toLowerCase().includes(detailLower));

      return typeMatch && statusMatch && userMatch && searchMatch && detailMatch && dateMatch;
    });

    return [...result].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'date') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else if (sortField === 'amount') {
        valA = Math.abs(Number(valA));
        valB = Math.abs(Number(valB));
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [activeType, activeStatus, activeUser, searchQuery, transactions, startDate, endDate, sortField, sortOrder]);

  return (
    <div className="glass rounded-3xl overflow-hidden flex flex-col">
      <div className="p-6 border-b border-on-background/5">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold font-headline">آخر المعاملات</h3>
          <Tooltip content="عرض كافة السجلات التاريخية" position="right">
            <button className="text-primary-base text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
              عرض الكل <ArrowLeft className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        {/* Aggregated Stats Section */}
        <div className="mb-8 p-1 bg-on-background/[0.02] rounded-[32px] border border-on-background/5">
          <div className="p-5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-primary-base rounded-full shadow-[0_0_10px_rgba(186,158,255,0.5)]" />
                <div>
                  <h4 className="text-xs font-black text-on-background uppercase tracking-[0.2em]">ملخص الأداء المالي</h4>
                  <p className="text-[9px] text-on-surface-variant font-bold mt-0.5">موجز العمليات المحاسبية للفترة المختارة</p>
                </div>
              </div>
              <div className="flex gap-1 bg-surface-high p-1 rounded-xl border border-on-background/10">
                {(['all', 'month', '7days'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setStatsPeriod(p)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all duration-300",
                      statsPeriod === p 
                        ? "bg-primary-base text-background-base shadow-[0_0_15px_rgba(186,158,255,0.4)] scale-105" 
                        : "text-on-surface-variant hover:text-on-background hover:bg-on-background/5"
                    )}
                  >
                    {p === 'all' ? 'الكل' : p === 'month' ? 'الشهر' : 'الأسبوع'}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-secondary-base/5 group-hover:bg-secondary-base/10 transition-colors" />
                <div className="relative p-5 rounded-2xl border border-secondary-base/20 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary-base/10 flex items-center justify-center text-secondary-base shadow-[inset_0_0_10px_rgba(83,221,252,0.2)]">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-secondary-base/70 uppercase tracking-widest mb-1">إجمالي المبيعات</p>
                    <p className="text-2xl font-black text-on-background truncate font-mono tracking-tighter">
                      {formatAmount(stats.totalSales)}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-orange-400/5 group-hover:bg-orange-400/10 transition-colors" />
                <div className="relative p-5 rounded-2xl border border-orange-400/20 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-400/10 flex items-center justify-center text-orange-400 shadow-[inset_0_0_10px_rgba(251,146,60,0.2)]">
                    <RotateCcw className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-orange-400/70 uppercase tracking-widest mb-1">إجمالي المرتجعات</p>
                    <p className="text-2xl font-black text-on-background truncate font-mono tracking-tighter">
                      {formatAmount(stats.totalRefunds)}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-primary-base/5 group-hover:bg-primary-base/10 transition-colors" />
                <div className="relative p-5 rounded-2xl border border-primary-base/20 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-base/10 flex items-center justify-center text-primary-base shadow-[inset_0_0_10px_rgba(186,158,255,0.2)]">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-primary-base/70 uppercase tracking-widest mb-1">معاملات معلقة</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-black text-on-background font-mono">{stats.pendingCount}</p>
                      <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">عملية</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Sales vs Expenses Progress Bar */}
        <div className="mb-8 p-4 rounded-2xl bg-on-background/[0.02] border border-on-background/5">
          <div className="flex justify-between items-end mb-3">
            <div className="text-right">
              <p className="text-[10px] font-black text-secondary-base uppercase tracking-widest mb-1">صافي المبيعات</p>
              <p className="text-sm font-black text-on-background font-mono">{formatAmount(stats.totalSales)}</p>
            </div>
            <div className="text-center">
              <span className="text-[9px] font-black px-3 py-1 rounded-lg bg-surface-high border border-on-background/10 text-on-surface-variant uppercase tracking-widest">
                مقارنة الإيرادات بالمصاريف
              </span>
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-primary-base uppercase tracking-widest mb-1">إجمالي المصروفات</p>
              <p className="text-sm font-black text-on-background font-mono">{formatAmount(stats.totalExpenses)}</p>
            </div>
          </div>
          
          <div className="relative h-2 w-full bg-on-background/10 rounded-full overflow-hidden flex shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)]">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(stats.totalSales + stats.totalExpenses) === 0 ? 0 : (stats.totalSales / (stats.totalSales + stats.totalExpenses)) * 100}%` }}
              className="h-full bg-secondary-base shadow-[0_0_15px_rgba(83,221,252,0.6)] z-10"
            />
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(stats.totalSales + stats.totalExpenses) === 0 ? 0 : (stats.totalExpenses / (stats.totalSales + stats.totalExpenses)) * 100}%` }}
              className="h-full bg-primary-base shadow-[0_0_15px_rgba(186,158,255,0.6)]"
            />
          </div>
          
          <div className="flex justify-between mt-2 text-[8px] font-bold uppercase tracking-tighter">
            <div className="text-secondary-base">
              {((stats.totalSales / (stats.totalSales + stats.totalExpenses || 1)) * 100).toFixed(1)}% من الإجمالي
            </div>
            <div className="text-primary-base">
              {((stats.totalExpenses / (stats.totalSales + stats.totalExpenses || 1)) * 100).toFixed(1)}% من الإجمالي
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <label className="block text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-1.5 mr-2">من تاريخ</label>
            <div className="relative">
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-base opacity-50 pointer-events-none" />
              <input 
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-surface-high/50 border border-on-background/10 rounded-2xl py-3 pr-11 pl-4 text-xs focus:outline-none focus:border-primary-base transition-all font-medium text-on-background appearance-none"
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-1.5 mr-2">إلى تاريخ</label>
            <div className="relative">
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-base opacity-50 pointer-events-none" />
              <input 
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-surface-high/50 border border-on-background/10 rounded-2xl py-3 pr-11 pl-4 text-xs focus:outline-none focus:border-primary-base transition-all font-medium text-on-background appearance-none"
              />
            </div>
          </div>
        </div>

        {/* Search & Detail Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-on-surface-variant" />
            </div>
            <Tooltip content="ابحث بالعنوان أو التفاصيل العامة" position="bottom" className="w-full">
              <input 
                type="text"
                placeholder="البحث العام (العنوان، النوع...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-high/50 border border-on-background/10 rounded-2xl py-3 pr-11 pl-4 text-sm focus:outline-none focus:border-primary-base/50 focus:ring-1 focus:ring-primary-base/20 transition-all font-medium placeholder:text-on-surface-variant/50"
              />
            </Tooltip>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <Tag className="w-4 h-4 text-primary-base opacity-60" />
            </div>
            <Tooltip content="ابحث في محتوى التفاصيل فقط (مثل معرف الطلب أو الوقت)" position="bottom" className="w-full">
              <input 
                type="text"
                placeholder="فلترة حسب التفاصيل (ID، الوقت...)"
                value={detailQuery}
                onChange={(e) => setDetailQuery(e.target.value)}
                className="w-full bg-surface-high/50 border border-on-background/10 rounded-2xl py-3 pr-11 pl-4 text-sm focus:outline-none focus:border-primary-base/50 focus:ring-1 focus:ring-primary-base/20 transition-all font-medium placeholder:text-on-surface-variant/50"
              />
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 bg-surface-high p-1 rounded-xl border border-on-background/5">
            <Filter className="w-3 h-3 text-on-surface-variant mx-2" />
            <FilterTab 
              label="الكل" 
              active={activeType === 'all'} 
              onClick={() => setActiveType('all')} 
            />
            <FilterTab 
              label="مبيعات" 
              active={activeType === 'sale'} 
              onClick={() => setActiveType('sale')} 
            />
            <FilterTab 
              label="سحب" 
              active={activeType === 'withdrawal'} 
              onClick={() => setActiveType('withdrawal')} 
            />
            <FilterTab 
              label="مكافآت" 
              active={activeType === 'reward'} 
              onClick={() => setActiveType('reward')} 
            />
            <FilterTab 
              label="استرداد" 
              active={activeType === 'refund'} 
              onClick={() => setActiveType('refund')} 
            />
            <FilterTab 
              label="مصروفات" 
              active={activeType === 'expense'} 
              onClick={() => setActiveType('expense')} 
            />
          </div>

          <div className="h-4 w-[1px] bg-on-background/10 hidden sm:block" />

          <div className="flex items-center gap-2 bg-surface-high p-1 rounded-xl border border-on-background/5">
            <FilterTab 
              label="أي حالة" 
              active={activeStatus === 'all'} 
              onClick={() => setActiveStatus('all')} 
            />
            <FilterTab 
              label="مكتمل" 
              active={activeStatus === 'completed'} 
              onClick={() => setActiveStatus('completed')} 
            />
            <FilterTab 
              label="معلق" 
              active={activeStatus === 'pending'} 
              onClick={() => setActiveStatus('pending')} 
            />
          </div>

          <div className="h-4 w-[1px] bg-on-background/10 hidden lg:block" />

          <div className="flex flex-wrap items-center gap-2 bg-surface-high p-1 rounded-xl border border-on-background/5">
            <FilterTab 
              label="كل المستخدمين" 
              active={activeUser === 'all'} 
              onClick={() => setActiveUser('all')} 
            />
            {users.map((user: string) => (
              <FilterTab 
                key={user}
                label={user} 
                active={activeUser === user} 
                onClick={() => setActiveUser(user)} 
              />
            ))}
          </div>
        </div>

        {/* Sorting Section */}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-surface-high p-1 rounded-xl border border-on-background/5">
            <div className="flex items-center gap-2 px-3">
              <ArrowUpDown className="w-3 h-3 text-on-surface-variant" />
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">الترتيب حسب:</span>
            </div>
            <SortTab 
              label="التاريخ" 
              active={sortField === 'date'} 
              order={sortOrder}
              onClick={() => handleSort('date')} 
            />
            <SortTab 
              label="المبلغ" 
              active={sortField === 'amount'} 
              order={sortOrder}
              onClick={() => handleSort('amount')} 
            />
            <SortTab 
              label="النوع" 
              active={sortField === 'type'} 
              order={sortOrder}
              onClick={() => handleSort('type')} 
            />
          </div>
        </div>

        {/* Generate PDF Button */}
        <div className="mt-6">
          <Tooltip content="استخراج تقرير رسمي بصيغة PDF" position="top" className="w-full">
            <button 
              onClick={generatePDF}
              disabled={filteredTransactions.length === 0}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-on-background/5 border border-on-background/10 text-on-background hover:bg-primary-base hover:text-background-base hover:border-transparent transition-all duration-300 font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <FileDown className="w-4 h-4 text-primary-base group-hover:text-background-base transition-colors" />
              توليد تقرير PDF للمعاملات المفلترة
            </button>
          </Tooltip>
        </div>

        {/* Generate CSV Button */}
        <div className="mt-3">
          <Tooltip content="تحميل البيانات بصيغة جدول Excel" position="top" className="w-full">
            <button 
              onClick={generateCSV}
              disabled={filteredTransactions.length === 0}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-on-background/5 border border-on-background/10 text-on-background hover:bg-secondary-base hover:text-background-base hover:border-transparent transition-all duration-300 font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <Table className="w-4 h-4 text-secondary-base group-hover:text-background-base transition-colors" />
              تصدير البيانات بصيغة CSV (Excel)
            </button>
          </Tooltip>
        </div>

        {/* Generate JSON Button (Full Export) */}
        <div className="mt-3">
          <Tooltip content="تصدير كافة البيانات (بدون فلترة) بصيغة JSON" position="top" className="w-full">
            <button 
              onClick={generateJSON}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-tertiary-base/10 border border-tertiary-base/30 text-tertiary-base hover:bg-tertiary-base hover:text-background-base hover:border-transparent transition-all duration-300 font-black text-xs group shadow-[0_4px_15px_rgba(186,255,158,0.1)]"
            >
              <Code className="w-4 h-4 text-tertiary-base group-hover:text-background-base transition-colors" />
              تصدير السجل الكامل بصيغة JSON
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="divide-y divide-on-background/5 min-h-[300px] relative">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background-base/50 backdrop-blur-sm z-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="mb-4"
            >
              <Loader2 className="w-12 h-12 text-primary-base" />
            </motion.div>
            <p className="text-sm font-bold text-on-surface-variant animate-pulse">جاري جلب المعاملات...</p>
          </div>
        ) : filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => {
            const isExpanded = expandedId === tx.id;
            return (
              <div key={tx.id} className="group transition-all duration-300">
                <button 
                  onClick={() => toggleExpand(tx.id)}
                  className={cn(
                    "w-full p-4 flex items-center justify-between hover:bg-on-background/2 px-6 transition-colors text-right",
                    isExpanded && "bg-on-background/5"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("w-11 h-11 rounded-full flex items-center justify-center transition-transform", tx.bgColor, tx.color, isExpanded && "scale-110")}>
                      <tx.icon 
                        className="w-5 h-5 transition-all duration-300" 
                        style={{ 
                          filter: `drop-shadow(0 0 6px currentColor)` 
                        }} 
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{tx.title}</p>
                      <p className="text-[10px] text-on-surface-variant font-medium">{tx.detail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-left flex flex-col items-end">
                      <p className={cn("font-headline font-bold mb-1", typeof tx.amount === 'number' ? (tx.amount > 0 ? 'text-secondary-base' : 'text-on-background') : 'text-on-background')}>
                        {formatAmount(tx.amount)}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[8px] px-2 py-0.5 rounded-full border",
                          tx.status === 'completed' 
                            ? "bg-secondary-base/10 text-secondary-base border-secondary-base/20" 
                            : "bg-on-background/5 text-on-surface-variant border-on-background/10"
                        )}>
                          {tx.status === 'completed' ? 'مكتمل' : 'معلق'}
                        </span>
                        {isExpanded ? <ChevronUp className="w-3 h-3 text-on-surface-variant" /> : <ChevronDown className="w-3 h-3 text-on-surface-variant" />}
                      </div>
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden bg-on-background/[0.01] border-t border-on-background/5"
                    >
                      <motion.div 
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                        className="px-6 pt-6"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-1 h-4 bg-primary-base rounded-full shadow-[0_0_8px_rgba(186,158,255,0.4)]" />
                          <h4 className="text-[11px] font-black text-on-background uppercase tracking-widest">موجز تفاصيل المعاملة</h4>
                        </div>
                      </motion.div>
                      
                      <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 text-right">
                        {[
                          { icon: Hash, label: 'رقم العملية', value: `#TX-${tx.id.padStart(6, '0')}`, valueClass: 'text-primary-base font-mono tracking-wider' },
                          { icon: Activity, label: 'التصنيف', value: getTypeLabel(tx.type) },
                          { icon: ShieldCheck, label: 'الحالة', value: getStatusLabel(tx.status), valueClass: tx.status === 'completed' ? "text-secondary-base" : "text-primary-base" },
                          { icon: User, label: 'الطرف الآخر', value: tx.user },
                          { icon: Calendar, label: 'تاريخ التنفيذ', value: (tx as any).date || 'غير متوفر' }
                        ].map((item, idx) => (
                          <motion.div 
                            key={item.label}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.15 + (idx * 0.05), duration: 0.3 }}
                            className="space-y-1.5 p-3 rounded-2xl bg-surface-high/20 border border-on-background/5 hover:border-primary-base/20 transition-colors group/item"
                          >
                            <div className="flex items-center gap-2 text-on-surface-variant group-hover/item:text-primary-base transition-colors">
                              <item.icon className="w-3 h-3" />
                              <span className="text-[9px] font-black uppercase tracking-wider">{item.label}</span>
                            </div>
                            <p className={cn("text-sm font-bold text-on-background", item.valueClass)}>{item.value}</p>
                          </motion.div>
                        ))}
                      </div>
                      
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.45 }}
                        className="px-6 pb-6 flex justify-end gap-3"
                      >
                        <Tooltip content="حفظ نسخة ورقية من هذه العملية">
                          <button className="text-[9px] font-bold px-3 py-1 rounded-lg border border-on-background/10 text-on-surface-variant hover:bg-on-background/5 hover:text-on-background transition-all">تحميل الإيصال</button>
                        </Tooltip>
                        <Tooltip content="عرض البيانات البرمجية للعملية">
                          <button className="text-[9px] font-bold px-3 py-1 rounded-lg bg-surface-high border border-primary-base/20 text-primary-base hover:bg-primary-base/10 transition-all">عرض التفاصيل التقنية</button>
                        </Tooltip>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant opacity-50">
            <Tag className="w-12 h-12 mb-4" />
            <p className="text-sm font-bold">لا توجد معاملات تطابق الفلترة</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface FilterTabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const FilterTab: React.FC<FilterTabProps> = ({ label, active, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all",
        active 
          ? "bg-primary-base text-background-base shadow-[0_0_10px_rgba(186,158,255,0.3)]" 
          : "text-on-surface-variant hover:text-on-background"
      )}
    >
      {label}
    </button>
  );
};

interface SortTabProps {
  label: string;
  active: boolean;
  order: 'asc' | 'desc';
  onClick: () => void;
}

const SortTab: React.FC<SortTabProps> = ({ label, active, order, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-2",
        active 
          ? "bg-secondary-base text-background-base shadow-[0_0_10px_rgba(83,221,252,0.3)]" 
          : "text-on-surface-variant hover:text-on-background"
      )}
    >
      {label}
      {active && (
        order === 'asc' 
          ? <ArrowUpNarrowWide className="w-3 h-3" /> 
          : <ArrowDownWideNarrow className="w-3 h-3" />
      )}
    </button>
  );
};
