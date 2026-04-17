import { CheckCircle2, ChevronLeft, Building2, PlusCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export function PaymentMethods() {
  return (
    <div className="glass p-8 rounded-3xl flex flex-col h-full">
      <h3 className="text-xl font-bold font-headline mb-6">طرق الدفع</h3>
      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-high border-2 border-primary-base shadow-[0_0_20px_rgba(186,158,255,0.1)] relative">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" 
                alt="PayPal" 
                className="w-6 h-6" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">PayPal</p>
              <p className="text-[10px] text-on-surface-variant">forge***@email.com</p>
            </div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-primary-base fill-primary-base/20" />
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-base border border-on-background/10 hover:border-secondary-base/40 transition-all cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center bg-surface-high rounded-lg text-on-background/70 group-hover:text-secondary-base transition-colors">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">بنك محلي</p>
              <p className="text-[10px] text-on-surface-variant">نهاية الحساب **** 4920</p>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-on-surface-variant" />
        </div>
      </div>

      <button className="mt-8 w-full py-4 border-2 border-dashed border-on-background/10 rounded-2xl text-on-surface-variant hover:border-primary-base/40 hover:text-primary-base transition-all flex items-center justify-center gap-2 text-sm font-bold">
        <PlusCircle className="w-4 h-4" />
        إضافة وسيلة دفع جديدة
      </button>
    </div>
  );
}
