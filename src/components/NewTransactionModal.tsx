import { X, Save, Tag, Banknote, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { Tooltip } from './ui/Tooltip';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (transaction: any) => void;
}

export function NewTransactionModal({ isOpen, onClose, onSave }: NewTransactionModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'sale',
    status: 'completed'
  });
  const [errors, setErrors] = useState<{ title?: string; amount?: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const validate = () => {
    const newErrors: { title?: string; amount?: string } = {};
    let generalErr: string | null = null;

    if (!formData.title.trim()) {
      newErrors.title = 'يرجى إدخال عنوان للمعاملة';
      generalErr = 'يرجى تصحيح الأخطاء قبل الحفظ';
    }

    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum)) {
      newErrors.amount = 'المبلغ غير صالح';
      generalErr = 'يرجى تصحيح الأخطاء قبل الحفظ';
    } else if (amountNum <= 0) {
      newErrors.amount = 'يجب أن يكون المبلغ أكبر من صفر';
      generalErr = 'المبلغ لا يمكن أن يكون سالباً أو صفراً';
    }

    setErrors(newErrors);
    setGeneralError(generalErr);
    return Object.keys(newErrors).length === 0 && !generalErr;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (onSave) onSave({ ...formData, amount: parseFloat(formData.amount) });
    onClose();
    // Reset form
    setFormData({ title: '', amount: '', type: 'sale', status: 'completed' });
    setErrors({});
    setGeneralError(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background-base/80 backdrop-blur-md z-[60]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[70] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass w-full max-w-lg rounded-3xl p-8 pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-primary-base/20"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black font-headline text-on-background">إضافة معاملة جديدة</h2>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-1">سجل مبيعاتك أو سحوباتك يدوياً</p>
                </div>
                <Tooltip content="إغلاق النافذة">
                  <button 
                    onClick={onClose}
                    className="p-2 rounded-xl bg-surface-high border border-on-background/5 text-on-surface-variant hover:text-tertiary-base transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </Tooltip>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Error */}
                <AnimatePresence>
                  {generalError && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-center gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      <p className="text-xs font-bold text-rose-500">{generalError}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Title */}
                <div>
                  <label className="block text-[10px] text-on-surface-variant font-black uppercase tracking-widest mb-2">عنوان المعاملة</label>
                  <div className="relative">
                    <Tag className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-base opacity-50" />
                    <input
                      required
                      type="text"
                      placeholder="مثال: بيع أصول رقمية"
                      className="w-full bg-surface-high border border-on-background/5 rounded-2xl py-4 pr-12 pl-4 text-on-background focus:outline-none focus:border-primary-base transition-all"
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({...formData, title: e.target.value});
                        if (errors.title) setErrors(prev => ({ ...prev, title: undefined }));
                      }}
                    />
                  </div>
                  {errors.title && (
                    <p className="text-[10px] text-rose-500 font-bold mt-2 mr-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-[10px] text-on-surface-variant font-black uppercase tracking-widest mb-2">المبلغ ($)</label>
                  <div className="relative">
                    <Banknote className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-base opacity-50" />
                    <input
                      required
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full bg-surface-high border border-on-background/5 rounded-2xl py-4 pr-12 pl-4 text-on-background focus:outline-none focus:border-secondary-base transition-all font-headline font-bold"
                      value={formData.amount}
                      onChange={(e) => {
                        setFormData({...formData, amount: e.target.value});
                        if (errors.amount) setErrors(prev => ({ ...prev, amount: undefined }));
                      }}
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-[10px] text-rose-500 font-bold mt-2 mr-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.amount}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Type */}
                  <div>
                    <label className="block text-[10px] text-on-surface-variant font-black uppercase tracking-widest mb-2">النوع</label>
                    <select
                      className="w-full bg-surface-high border border-on-background/5 rounded-2xl py-4 px-4 text-on-background focus:outline-none focus:border-primary-base transition-all appearance-none cursor-pointer"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option value="sale">بيع</option>
                      <option value="withdrawal">سحب</option>
                      <option value="reward">مكافأة</option>
                      <option value="refund">استرداد</option>
                      <option value="expense">مصروفات</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-[10px] text-on-surface-variant font-black uppercase tracking-widest mb-2">الحالة</label>
                    <select
                      className="w-full bg-surface-high border border-on-background/5 rounded-2xl py-4 px-4 text-on-background focus:outline-none focus:border-primary-base transition-all appearance-none cursor-pointer"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="completed">مكتمل</option>
                      <option value="pending">قيد المعالجة</option>
                    </select>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-4 flex gap-4">
                  <Tooltip content="تسجيل البيانات نهائياً" className="flex-1">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary-base to-primary-dim text-background-base py-4 rounded-2xl font-black shadow-[0_0_20px_rgba(186,158,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      حفظ المعاملة
                    </button>
                  </Tooltip>
                  <Tooltip content="تجاهل التغييرات">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-8 py-4 rounded-2xl bg-surface-high text-on-surface-variant font-bold hover:bg-on-background/5 transition-all"
                    >
                      إلغاء
                    </button>
                  </Tooltip>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
