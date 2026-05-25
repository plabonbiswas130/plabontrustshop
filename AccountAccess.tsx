import React, { useState } from 'react';
import { Key, ArrowLeft, ShieldCheck, Globe, Warehouse } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AccountVerification } from './AccountVerification';

interface AccountAccessProps {
  onBack: () => void;
  onAdminSuccess?: () => void;
  t: any;
}

export function AccountAccess({ onBack, onAdminSuccess, t }: AccountAccessProps) {
  const [view, setView] = useState<'selection' | 'verification' | 'admin-login'>('selection');
  const [verificationType, setVerificationType] = useState<string>('');
  const [adminKey, setAdminKey] = useState('');

  const handleVerify = (type: string) => {
    setVerificationType(type);
    setView('verification');
  };

  const handleAdminVerify = () => {
    setView('admin-login');
  };

  const checkAdminKey = () => {
    if (adminKey === 'PTS') {
      onAdminSuccess?.();
    } else {
      alert('ভুল এডমিন কি! সঠিক কি দিয়ে পুনরায় চেষ্টা করুন।');
    }
  };

  if (view === 'verification') {
    return (
      <div className="relative min-h-screen bg-[#f4f7f6]">
        <button 
          onClick={() => setView('selection')}
          className="fixed top-6 left-6 z-[2000] flex items-center gap-2 px-4 py-2 bg-white text-primary rounded-full font-bold shadow-xl hover:-translate-y-1 transition-all"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <AccountVerification 
          title={verificationType === 'global' ? 'Global Account Verification' : 'Warehouse Account Verification'}
          onVerify={(data) => {
            alert('ভেরিফিকেশন সফল হয়েছে!');
            setView('selection');
          }} 
        />
      </div>
    );
  }

  if (view === 'admin-login') {
    return (
      <div className="min-h-screen bg-[#f4f7f6] flex flex-col items-center justify-center p-4">
        <button 
          onClick={() => setView('selection')}
          className="mb-8 flex items-center gap-2 px-6 py-2.5 bg-white text-primary rounded-full font-bold shadow-lg hover:-translate-y-1 transition-all self-start md:ml-[10%]"
        >
          <ArrowLeft size={20} />
          <span>Back to Selection</span>
        </button>
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Admin Verification</h2>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <div className="text-center mb-6">
               <Key size={48} className="mx-auto mb-2 text-primary" />
               <p className="text-gray-500">প্যানেলে প্রবেশের জন্য এডমিন ভেরিফিকেশন করুন</p>
            </div>
            <input 
              type="password" 
              placeholder="Admin Access Key" 
              className="w-full p-4 bg-gray-50 border-none rounded-xl mb-6 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold tracking-widest text-center" 
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
            />
            <button 
               onClick={checkAdminKey}
               className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
            >
              Verify & Enter Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f6] py-10 px-4">
      <div className="max-w-[1000px] mx-auto mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-2.5 bg-white text-primary rounded-full font-bold shadow-lg hover:-translate-y-1 transition-all"
        >
          <ArrowLeft size={20} />
          <span>Dashboard</span>
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="access-container"
      >
        <h2 className="section-title-access flex items-center justify-center gap-3 mb-10">
          <ShieldCheck size={32} />
          Account Access & Verification
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
          <VerificationOption 
            title="গ্লোবাল অ্যাকাউন্ট ভেরিফিকেশন"
            description="আপনার গ্লোবাল ড্রপশিপিং অ্যাকাউন্ট ভেরিফাই করুন"
            icon={<Globe size={40} />}
            color="bg-blue-500"
            onClick={() => handleVerify('global')}
          />
          <VerificationOption 
            title="ওয়্যারহাউজ অ্যাকাউন্ট ভেরিফিকেশন"
            description="আপনার ওয়্যারহাউজ শপিং অ্যাকাউন্ট ভেরিফাই করুন"
            icon={<Warehouse size={40} />}
            color="bg-emerald-500"
            onClick={() => handleVerify('warehouse')}
          />
          <VerificationOption 
            title="এডমিন ভেরিফিকেশন"
            description="সিস্টেম প্যানেলে প্রবেশের জন্য এডমিন ভেরিফিকেশন"
            icon={<Key size={40} />}
            color="bg-indigo-600"
            onClick={handleAdminVerify}
          />
        </div>
      </motion.div>
    </div>
  );
}

function VerificationOption({ title, description, icon, color, onClick }: any) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 cursor-pointer text-center group transition-all"
    >
      <div className={`w-20 h-20 ${color} rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg group-hover:rotate-6 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </motion.div>
  );
}
