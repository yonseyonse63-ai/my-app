import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, Mail, Smartphone, Shield, Zap, Info, CheckCircle2, User, Key, Globe, Camera } from 'lucide-react';
import { cn } from '../lib/utils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'account'>('profile');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [transactionAlerts, setTransactionAlerts] = useState(true);
  const [threshold, setThreshold] = useState(100);
  const [isSaved, setIsSaved] = useState(false);

  const [profileData, setProfileData] = useState({
    name: 'يونس المطور',
    email: 'yonseyonse63@gmail.com',
    bio: 'مطور واجهات أمامية متخصص في التصميم النيوني والتقني'
  });

  useEffect(() => {
    if (isSaved) {
      const timer = setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSaved, onClose]);

  const handleSave = () => {
    // Here we would typically persist the settings
    setIsSaved(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background-base/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-surface-base border border-on-background/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header with Tabs */}
            <div className="border-b border-on-background/5 bg-surface-high">
              <div className="p-6 flex justify-between items-center pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary-base/10 text-primary-base">
                    {activeTab === 'profile' ? <User className="w-5 h-5" /> : activeTab === 'notifications' ? <Bell className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-headline">
                      {activeTab === 'profile' ? 'الملف الشخصي' : activeTab === 'notifications' ? 'الإشعارات' : 'إعدادات الحساب'}
                    </h3>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">تحكم في هويتك وتجربتك</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-on-background/5 text-on-surface-variant transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex px-6 pb-0 gap-8">
                {[
                  { id: 'profile', label: 'الملف الشخصي' },
                  { id: 'notifications', label: 'الإشعارات' },
                  { id: 'account', label: 'الحساب والأمان' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "pb-4 text-[11px] font-black uppercase tracking-wider transition-all relative",
                      activeTab === tab.id ? "text-primary-base" : "text-on-surface-variant hover:text-on-background"
                    )}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeSettingTab"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-primary-base rounded-t-full shadow-[0_-5px_15px_rgba(186,158,255,0.4)]"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8 overflow-y-auto max-h-[60vh] relative min-h-[400px]">
              <AnimatePresence mode="wait">
                {isSaved ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-surface-base/90 backdrop-blur-sm p-8"
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-secondary-base/20 flex items-center justify-center text-secondary-base">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold font-headline text-on-background">تم حفظ التغييرات</h4>
                        <p className="text-xs text-on-surface-variant font-medium mt-1">تحديث إعداداتك بنجاح</p>
                      </div>
                    </div>
                  </motion.div>
                ) : activeTab === 'profile' ? (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Profile Header */}
                    <div className="flex items-center gap-6 mb-8">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-base to-secondary-base flex items-center justify-center text-background-base text-4xl font-headline font-black shadow-2xl">
                          {profileData.name.charAt(0)}
                        </div>
                        <button className="absolute -bottom-2 -left-2 p-2 rounded-xl bg-surface-high border border-on-background/10 text-primary-base shadow-xl group-hover:scale-110 transition-transform">
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-on-background">{profileData.name}</h4>
                        <p className="text-xs text-on-surface-variant font-medium">عضو منذ أبريل 2024</p>
                        <div className="mt-2 flex gap-2">
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-secondary-base/10 text-secondary-base border border-secondary-base/20 uppercase tracking-widest">برو</span>
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-primary-base/10 text-primary-base border border-primary-base/20 uppercase tracking-widest">موثق</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] text-on-surface-variant font-black uppercase tracking-widest mb-2 mr-2">الاسم الكامل</label>
                        <input 
                          type="text" 
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          className="w-full bg-surface-high border border-on-background/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-primary-base transition-all font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-on-surface-variant font-black uppercase tracking-widest mb-2 mr-2">البريد الإلكتروني</label>
                        <input 
                          type="email" 
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className="w-full bg-surface-high border border-on-background/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-primary-base transition-all font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-on-surface-variant font-black uppercase tracking-widest mb-2 mr-2">نبذة تعريفية</label>
                        <textarea 
                          rows={3}
                          value={profileData.bio}
                          onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                          className="w-full bg-surface-high border border-on-background/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-primary-base transition-all font-medium resize-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : activeTab === 'notifications' ? (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    {/* Previous Notification Content */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-on-surface-variant uppercase tracking-[0.2em] mb-4">قنوات التواصل</h4>
                      <ToggleItem 
                        icon={Mail} 
                        title="تنبيهات البريد الإلكتروني" 
                        description="تلقي ملخصات يومية وتقارير العمليات الكبيرة"
                        enabled={emailAlerts}
                        onChange={setEmailAlerts}
                      />
                      <ToggleItem 
                        icon={Smartphone} 
                        title="إشعارات المتصفح" 
                        description="تنبيهات فورية عند حدوث مبيعات أو تحويلات"
                        enabled={pushNotifications}
                        onChange={setPushNotifications}
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-on-surface-variant uppercase tracking-[0.2em] mb-4">تنبيهات المعاملات</h4>
                      <ToggleItem 
                        icon={Zap} 
                        title="تنبيهات المعاملات الكبيرة" 
                        description="إرسال إشعار فوري عند تجاوز المعاملة مبلغاً معيناً"
                        enabled={transactionAlerts}
                        onChange={setTransactionAlerts}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="account"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-on-surface-variant uppercase tracking-[0.2em] mb-4">الأمان والحماية</h4>
                      <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-surface-high border border-on-background/5 hover:bg-on-background/5 transition-all text-right">
                        <div className="flex items-center gap-3">
                          <Key className="w-5 h-5 text-primary-base" />
                          <div>
                            <p className="text-sm font-bold">تغيير كلمة المرور</p>
                            <p className="text-[10px] text-on-surface-variant">آخر تغيير قبل ٣ أشهر</p>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-primary-base">تحديث</div>
                      </button>

                      <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-surface-high border border-on-background/5 hover:bg-on-background/5 transition-all text-right">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-secondary-base" />
                          <div>
                            <p className="text-sm font-bold">المصادقة الثنائية (2FA)</p>
                            <p className="text-[10px] text-on-surface-variant">قم بحماية حسابك بطبقة أمان إضافية</p>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-secondary-base">تفعيل</div>
                      </button>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-on-surface-variant uppercase tracking-[0.2em] mb-4">اللغة والمنطقة</h4>
                      <div className="p-4 rounded-2xl bg-surface-high border border-on-background/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-on-surface-variant" />
                          <div>
                            <p className="text-sm font-bold">لغة الواجهة</p>
                            <p className="text-[10px] text-on-surface-variant">العربية (الافتراضية)</p>
                          </div>
                        </div>
                        <select className="bg-transparent text-xs font-bold font-sans outline-none">
                          <option>العربية</option>
                          <option>English</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-6">
                      <button className="w-full py-4 text-xs font-black text-rose-500 bg-rose-500/5 border border-rose-500/10 rounded-2xl hover:bg-rose-500/10 transition-all uppercase tracking-widest">
                        حذف الحساب نهائياً
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-6 bg-surface-high border-t border-on-background/5 flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 py-3 px-6 rounded-xl border border-on-background/10 text-sm font-bold hover:bg-on-background/5 transition-all outline-none"
              >
                إلغاء
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaved}
                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-primary-base to-primary-dim text-background-base text-sm font-black shadow-[0_10px_20px_rgba(186,158,255,0.2)] hover:shadow-[0_15px_30px_rgba(186,158,255,0.3)] transition-all outline-none disabled:opacity-50"
              >
                {isSaved ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ToggleItem({ icon: Icon, title, description, enabled, onChange }: { icon: any, title: string, description: string, enabled: boolean, onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-high hover:bg-on-background/2 transition-colors border border-transparent hover:border-on-background/5 group">
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-xl border transition-colors", enabled ? "bg-primary-base/10 border-primary-base/20 text-primary-base" : "bg-on-background/5 border-on-background/5 text-on-surface-variant")}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-right">
          <p className="text-sm font-bold group-hover:text-on-background transition-colors">{title}</p>
          <p className="text-[10px] text-on-surface-variant font-medium leading-relaxed">{description}</p>
        </div>
      </div>
      <button 
        onClick={() => onChange(!enabled)}
        className={cn(
          "relative w-12 h-7 rounded-full transition-all duration-300 outline-none flex items-center px-1",
          enabled ? "bg-primary-base shadow-[0_0_15px_rgba(186,158,255,0.4)]" : "bg-on-background/10"
        )}
      >
        <motion.div 
          animate={{ x: enabled ? 20 : 0 }}
          className="w-5 h-5 bg-white rounded-full shadow-lg"
        />
      </button>
    </div>
  );
}
