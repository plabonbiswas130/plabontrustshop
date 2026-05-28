import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Users, 
  BarChart3, 
  Megaphone, 
  Percent, 
  Globe, 
  Mail, 
  Bot, 
  Crown, 
  Settings, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  TrendingUp, 
  ShieldCheck, 
  ArrowLeft,
  DollarSign,
  ShoppingCart,
  Send,
  Sparkles,
  RefreshCw,
  Bell,
  Star,
  Layers,
  Moon,
  Sun,
  LayoutGrid
} from 'lucide-react';
import { AutopilotControlPanel } from './AutopilotControlPanel';

interface EcommerceDashboardProps {
  onBack: () => void;
  t: any;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  sales: number;
  category: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  status: 'VIP' | 'Regular' | 'New';
}

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: 'Active' | 'Paused' | 'Draft';
  reached: number;
}

interface DiscountCode {
  id: string;
  code: string;
  type: 'Percentage' | 'Fixed';
  value: number;
  status: 'Active' | 'Expired';
}

interface MailMessage {
  id: string;
  sender: string;
  subject: string;
  body: string;
  time: string;
  isRead: boolean;
}

export function EcommerceDashboard({ onBack, t }: EcommerceDashboardProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'customers' | 'analytics' | 'marketing' | 'discounts' | 'store' | 'mailbox' | 'ai' | 'apps' | 'settings'>('products');
  const [unreadMailCount, setUnreadMailCount] = useState(3);
  const [currency, setCurrency] = useState<'৳' | '$'>('৳');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  
  // --- Products State ---
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Netflix Premium 1 Month', price: 599, stock: 45, sales: 120, category: 'Streaming' },
    { id: '2', name: 'Spotify Family Plan', price: 374, stock: 12, sales: 85, category: 'Music' },
    { id: '3', name: 'YouTube Premium 1 Year', price: 239, stock: 90, sales: 310, category: 'Streaming' },
    { id: '4', name: 'Canva Pro LifeTime', price: 199, stock: 8, sales: 440, category: 'Design' },
  ]);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('');
  const [newProdCat, setNewProdCat] = useState('Streaming');

  // --- Customers State ---
  const [customers, setCustomers] = useState<Customer[]>([
    { id: 'C1', name: 'MD Plabon Biswas', email: 'plabon@example.com', totalOrders: 12, totalSpent: 8450, status: 'VIP' },
    { id: 'C2', name: 'Karim Ahmed', email: 'karim@example.com', totalOrders: 5, totalSpent: 2390, status: 'Regular' },
    { id: 'C3', name: 'Sadia Rahman', email: 'sadia@example.com', totalOrders: 1, totalSpent: 599, status: 'New' },
    { id: 'C4', name: 'Yeasin Arafat', email: 'yeasin@example.com', totalOrders: 8, totalSpent: 4120, status: 'VIP' },
  ]);

  // --- Campaigns State ---
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: '1', name: 'Eid Premium Bash Promo', type: 'Email Campaign', status: 'Active', reached: 11200 },
    { id: '2', name: 'Facebook Auto-Ad Campaign', type: 'Social Media', status: 'Active', reached: 45200 },
    { id: '3', name: 'Unused Account Clearance', type: 'SMS Gateway', status: 'Paused', reached: 4500 },
  ]);
  const [newCampName, setNewCampName] = useState('');
  const [newCampType, setNewCampType] = useState('Email Campaign');

  // --- Discounts State ---
  const [discounts, setDiscounts] = useState<DiscountCode[]>([
    { id: '1', code: 'ROYAL50', type: 'Percentage', value: 50, status: 'Active' },
    { id: '2', code: 'PTSFREE', type: 'Fixed', value: 100, status: 'Active' },
    { id: '3', code: 'EID2026', type: 'Percentage', value: 20, status: 'Expired' },
  ]);
  const [newDiscCode, setNewDiscCode] = useState('');
  const [newDiscValue, setNewDiscValue] = useState('');
  const [newDiscType, setNewDiscType] = useState<'Percentage' | 'Fixed'>('Percentage');

  // --- Mailbox State ---
  const [mails, setMails] = useState<MailMessage[]>([
    { id: '1', sender: 'Yeasin (Customer)', subject: 'Netflix Login Issue', body: 'The shared password for Netflix profile 3 says incorrect credentials. Please fix immediately.', time: '10 mins ago', isRead: false },
    { id: '2', sender: 'Plabon (CEO)', subject: 'Gateway Security Update', body: 'Excellent work implementing the AI monitor panel. Let\'s ensure the SSL key is auto-rotating.', time: '1 hour ago', isRead: false },
    { id: '3', sender: 'Mayra Support Robot', subject: 'Pending Activation Ticket', body: 'A warehouse partner from Chittagong submitted an ID verification. Please review.', time: '5 hours ago', isRead: false },
    { id: '4', sender: 'Farhan Islam', subject: 'Refund Request #9921', body: 'Order #9921 was unsuccessful but money debited from Bkash. ID details attached.', time: '1 day ago', isRead: true },
  ]);
  const [activeMail, setActiveMail] = useState<MailMessage | null>(null);
  const [mailReplyText, setMailReplyText] = useState('');

  // --- Add-ons/Apps State ---
  const [addons, setAddons] = useState([
    { id: 'bkash', name: 'bKash Auto Gateway', icon: '📱', desc: 'Instant automated payment & service clearance.', enabled: true },
    { id: 'sms', name: 'BulksmsBD Alert', icon: '💬', desc: 'Triggers instant credentials via SMS upon buy.', enabled: false },
    { id: 'invoice', name: 'PDF Invoice Generator', icon: '📄', desc: 'Generates professional print-ready sales PDFs.', enabled: true },
    { id: 'tele', name: 'Telegram Post Bot', icon: '🤖', desc: 'Syncs new auto-listings to public channel.', enabled: true },
  ]);

  // --- Online Store Settings ---
  const [storeOnlineState, setStoreOnlineState] = useState(true);
  const [storeThemeColor, setStoreThemeColor] = useState('#db2777'); // default pink-600
  const [storeCustomTitle, setStoreCustomTitle] = useState('Royal Palace Bangladesh');

  // Add Product Handler
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;
    const priceNum = parseFloat(newProdPrice) || 0;
    const stockNum = parseInt(newProdStock) || 0;
    
    const newProd: Product = {
      id: Date.now().toString(),
      name: newProdName,
      price: priceNum,
      stock: stockNum,
      sales: 0,
      category: newProdCat
    };
    setProducts([newProd, ...products]);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdStock('');
  };

  // Delete Product Handler
  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Add Campaign Handler
  const handleAddCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampName) return;
    const newCamp: Campaign = {
      id: Date.now().toString(),
      name: newCampName,
      type: newCampType,
      status: 'Active',
      reached: 0
    };
    setCampaigns([newCamp, ...campaigns]);
    setNewCampName('');
  };

  // Add Discount Handler
  const handleAddDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscCode || !newDiscValue) return;
    const valNum = parseFloat(newDiscValue) || 0;
    const idx = Date.now().toString();
    const newDisc: DiscountCode = {
      id: idx,
      code: newDiscCode.toUpperCase(),
      type: newDiscType,
      value: valNum,
      status: 'Active'
    };
    setDiscounts([newDisc, ...discounts]);
    setNewDiscCode('');
    setNewDiscValue('');
  };

  // Toggle Add-on Enabled
  const toggleAddon = (id: string) => {
    setAddons(addons.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  // Open & Read Mail Panel
  const readMailMsg = (mail: MailMessage) => {
    setActiveMail(mail);
    if (!mail.isRead) {
      setMails(mails.map(m => m.id === mail.id ? { ...m, isRead: true } : m));
      setUnreadMailCount(Math.max(0, unreadMailCount - 1));
    }
  };

  // Send Mail Reply
  const sendMailResponse = () => {
    if (!mailReplyText.trim()) return;
    alert(`✉️ Reply sent successfully to:\n${activeMail?.sender}\nResponse text: "${mailReplyText}"`);
    setMailReplyText('');
    setActiveMail(null);
  };

  // Calculate stats
  const totalRevenue = products.reduce((acc, p) => acc + (p.sales * p.price), 0);
  const totalSalesCount = products.reduce((acc, p) => acc + p.sales, 0);
  const averageTicket = totalSalesCount ? Math.round(totalRevenue / totalSalesCount) : 0;

  return (
    <div className={`min-h-screen text-slate-800 transition-colors duration-300 ${themeMode === 'dark' ? 'bg-[#0f172a] text-[#f8fafc]' : 'bg-[#f8fafc]'}`}>
      <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
        
        {/* ================= SIDEBAR MENU ================= */}
        <aside className={`w-full lg:w-72 flex flex-col justify-between shrink-0 shadow-2xl transition-all ${themeMode === 'dark' ? 'bg-[#1e293b] border-r border-slate-800/80 text-white' : 'bg-[#1e293b] text-white'}`} id="dashboardSidebar">
          
          <div className="menu-group overflow-y-auto max-h-[85vh] scrollbar-thin">
            {/* Elegant Header Banner */}
            <div className="p-6 bg-gradient-to-r from-pink-600 to-rose-600 flex items-center justify-between text-white border-b border-white/10">
              <div className="flex items-center gap-3">
                <Crown className="w-7 h-7 text-yellow-300 animate-pulse" />
                <div>
                  <h1 className="font-extrabold text-[#fdf2f8] text-base leading-none">PTS Dashboard</h1>
                  <span className="text-[10px] text-pink-200 mt-1 block">Custom E-Commerce</span>
                </div>
              </div>
              <button 
                onClick={onBack} 
                className="p-1.5 hover:bg-white/15 rounded-lg transition" 
                title="Back to Shop Hub"
              >
                <ArrowLeft size={16} />
              </button>
            </div>

            {/* Sidebar Active Navigation Items */}
            <nav className="mt-6 space-y-1 px-3">
              
              {/* Products Item */}
              <button
                id="menuItemProducts"
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 text-left cursor-pointer ${
                  activeTab === 'products' 
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold shadow-md shadow-pink-500/10 scale-102 border-l-4 border-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Package size={20} className={activeTab === 'products' ? 'text-white' : 'text-slate-400'} />
                <span className="text-sm font-semibold">পণ্য (Products)</span>
              </button>

              {/* Customers Item */}
              <button
                id="menuItemCustomers"
                onClick={() => setActiveTab('customers')}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 text-left cursor-pointer ${
                  activeTab === 'customers' 
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold shadow-md shadow-pink-500/10 scale-102 border-l-4 border-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Users size={20} className={activeTab === 'customers' ? 'text-white' : 'text-slate-400'} />
                <span className="text-sm font-semibold flex-1">গ্রাহক (Customers)</span>
              </button>

              {/* Analytics Item */}
              <button
                id="menuItemAnalytics"
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 text-left cursor-pointer ${
                  activeTab === 'analytics' 
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold shadow-md shadow-pink-500/10 scale-102 border-l-4 border-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <BarChart3 size={20} className={activeTab === 'analytics' ? 'text-white' : 'text-slate-400'} />
                <span className="text-sm font-semibold">বিশ্লেষণ (Analytics)</span>
              </button>

              {/* Marketing Item */}
              <button
                id="menuItemMarketing"
                onClick={() => setActiveTab('marketing')}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 text-left cursor-pointer ${
                  activeTab === 'marketing' 
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold shadow-md shadow-pink-500/10 scale-102 border-l-4 border-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Megaphone size={20} className={activeTab === 'marketing' ? 'text-white' : 'text-slate-400'} />
                <span className="text-sm font-semibold">বিপণন (Marketing)</span>
              </button>

              {/* Discounts Item */}
              <button
                id="menuItemDiscounts"
                onClick={() => setActiveTab('discounts')}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 text-left cursor-pointer ${
                  activeTab === 'discounts' 
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold shadow-md shadow-pink-500/10 scale-102 border-l-4 border-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Percent size={20} className={activeTab === 'discounts' ? 'text-white' : 'text-slate-400'} />
                <span className="text-sm font-semibold">ছাড় (Discounts)</span>
              </button>

              {/* Online Store Item */}
              <button
                id="menuItemOnlineStore"
                onClick={() => setActiveTab('store')}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 text-left cursor-pointer ${
                  activeTab === 'store' 
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold shadow-md shadow-pink-500/10 scale-102 border-l-4 border-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Globe size={20} className={activeTab === 'store' ? 'text-white' : 'text-slate-400'} />
                <span className="text-sm font-semibold">অনলাইন স্টোর</span>
              </button>

              {/* Mailbox Item */}
              <button
                id="menuItemMailbox"
                onClick={() => setActiveTab('mailbox')}
                className={`w-full flex items-center justify-between gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 text-left cursor-pointer ${
                  activeTab === 'mailbox' 
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold shadow-md shadow-pink-500/10 scale-102 border-l-4 border-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Mail size={20} className={activeTab === 'mailbox' ? 'text-white' : 'text-slate-400'} />
                  <span className="text-sm font-semibold">মেইল বক্স</span>
                </div>
                {unreadMailCount > 0 && (
                  <span className="bg-[#ef4444] text-white text-[11px] font-bold px-2 py-0.5 rounded-full select-none shadow">
                    {unreadMailCount}
                  </span>
                )}
              </button>

              {/* AI Auto Listing Item */}
              <button
                id="menuItemAiListing"
                onClick={() => setActiveTab('ai')}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 text-left cursor-pointer ${
                  activeTab === 'ai' 
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold shadow-md shadow-pink-500/15 scale-102 border-l-4 border-white animate-pulse' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Bot size={20} className={activeTab === 'ai' ? 'text-white animate-bounce' : 'text-slate-400'} />
                <span className="text-sm font-black flex items-center gap-1.5">
                  AI অটো লিস্টিং 
                  <Sparkles size={12} className="text-yellow-300 shrink-0" />
                </span>
              </button>

              {/* Apps Addons Item */}
              <button
                id="menuItemApps"
                onClick={() => setActiveTab('apps')}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 text-left cursor-pointer ${
                  activeTab === 'apps' 
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold shadow-md shadow-pink-500/10 scale-102 border-l-4 border-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Crown size={20} className={activeTab === 'apps' ? 'text-white' : 'text-slate-400'} />
                <span className="text-sm font-semibold">অ্যাড-অনস (Apps)</span>
              </button>

            </nav>
          </div>

          {/* Bottom Settings & Theme Tab */}
          <div className="p-3 border-t border-slate-700 bg-slate-900/60 flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 text-left cursor-pointer ${
                activeTab === 'settings' 
                  ? 'bg-pink-600 text-white font-bold border-l-4 border-white' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Settings size={20} className="text-slate-400" />
              <span className="text-sm font-semibold">সেটিংস ও থিম</span>
            </button>
            
            <div className="flex items-center justify-between p-3 border-t border-slate-800/80 mt-1">
              <span className="text-xs text-slate-400">বাংলাদেশ সময় (UTC+6)</span>
              <button 
                onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')} 
                className="p-1 px-2 text-slate-300 hover:bg-slate-800 rounded-lg text-xs font-bold transition flex items-center gap-1"
              >
                {themeMode === 'light' ? <Moon size={14} /> : <Sun size={14} />}
                {themeMode.toUpperCase()}
              </button>
            </div>
          </div>
        </aside>

        {/* ================= MAIN INTERACTIVE BODY CONTAINER ================= */}
        <main className="flex-1 overflow-y-auto px-6 lg:px-12 py-10">
          
          {/* Header Area */}
          <div className="header border-b border-gray-200/50 pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4" id="dashboardHeaderSec">
            <div>
              <h2 className={`text-3xl font-black ${themeMode === 'dark' ? 'text-[#f8fafc]' : 'text-slate-800'}`} id="dashboardMainTitle">
                আপনার কাস্টম ই-কমার্স ড্যাশবোর্ড
              </h2>
              <p className={`text-sm mt-1 font-medium ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} id="dashboardSubtitle">
                এখানে আপনার এআই অটো লিস্টিং এবং গেটওয়ে প্যানেলের কাজ নিয়ন্ত্রণ করা যাবে।
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={onBack} 
                className={`py-2.5 px-5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 border cursor-pointer ${themeMode === 'dark' ? 'bg-slate-800/60 border-slate-700/80 text-slate-200 hover:bg-slate-800' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
              >
                <ArrowLeft size={14} /> {t.backToDashboard || 'ফিরে যান'}
              </button>

              <span className="bg-pink-100 text-pink-700 text-xs font-black px-4 py-2 rounded-2xl flex items-center gap-1.5 shadow-sm">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block animate-ping" />
                সচল (ONLINE)
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              
              {/* ================= TAB 1: PRODUCTS (পণ্য) ================= */}
              {activeTab === 'products' && (
                <div className="space-y-8" id="tabContentProducts">
                  {/* Top Stats Cards specific to products */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`p-6 rounded-3xl border ${themeMode === 'dark' ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-gray-100'}`}>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">রানিং ইনভেন্টোরি</p>
                      <h3 className="text-3xl font-black mt-2 text-pink-600">{products.length} টি লাইভ আইটেম</h3>
                      <p className="text-slate-400 text-[11px] mt-1">সবগুলো পণ্য যেকোনো সময় ডিলিট বা প্রাইস এডিট সম্ভব</p>
                    </div>
                    <div className={`p-6 rounded-3xl border ${themeMode === 'dark' ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-gray-100'}`}>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">মোট প্রোডাক্ট বিক্রি</p>
                      <h3 className="text-3xl font-black mt-2 text-rose-500">{totalSalesCount} টি সফল অর্ডার</h3>
                      <p className="text-slate-400 text-[11px] mt-1">বিগত ৩০ দিনে আপনার প্লাবন ট্রাস্ট শপের ডেলিভারি</p>
                    </div>
                    <div className={`p-6 rounded-3xl border ${themeMode === 'dark' ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-gray-100'}`}>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        এআই জেনারেটেড ডেসক্রিপশন
                        <Sparkles size={11} className="text-yellow-500" />
                      </p>
                      <h3 className="text-3xl font-black mt-2 text-cyan-500">১০০% রেডি</h3>
                      <p className="text-slate-400 text-[11px] mt-1">AI অটো লিস্টিং ট্যাবে গিয়ে এআই কে ডিরেক্ট নির্দেশনা দিন</p>
                    </div>
                  </div>

                  {/* Add New Product Form */}
                  <div className={`p-6 md:p-8 rounded-3xl border ${themeMode === 'dark' ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-gray-100 shadow-xl shadow-gray-100/40'}`}>
                    <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                      <Plus className="text-pink-600" /> নতুন ই-কমার্স প্রোডাক্ট যোগ করুন
                    </h3>
                    
                    <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div>
                        <label className="block text-xs font-black text-slate-500 mb-1.5 uppercase">প্রোডাক্টের নাম *</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Netflix VIP 1 Profile"
                          value={newProdName}
                          onChange={(e) => setNewProdName(e.target.value)}
                          className={`w-full p-3 text-xs font-bold rounded-xl outline-none border focus:ring-4 focus:ring-pink-500/10 transition-all ${themeMode === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-500 mb-1.5 uppercase">মূল্য ({currency}) *</label>
                        <input 
                          type="number" 
                          placeholder="Ex: 599"
                          value={newProdPrice}
                          onChange={(e) => setNewProdPrice(e.target.value)}
                          className={`w-full p-3 text-xs font-bold rounded-xl outline-none border focus:ring-4 focus:ring-pink-500/10 transition-all ${themeMode === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-500 mb-1.5 uppercase">স্টক পরিমাণ</label>
                        <input 
                          type="number" 
                          placeholder="Ex: 50"
                          value={newProdStock}
                          onChange={(e) => setNewProdStock(e.target.value)}
                          className={`w-full p-3 text-xs font-bold rounded-xl outline-none border focus:ring-4 focus:ring-pink-500/10 transition-all ${themeMode === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold py-3.5 rounded-xl text-xs uppercase shadow-lg shadow-pink-600/10 transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Plus size={16} /> স্টোরে পাবলিশ করুন
                      </button>
                    </form>
                  </div>

                  {/* Products Table */}
                  <div className={`rounded-3xl border overflow-hidden ${themeMode === 'dark' ? 'bg-[#1e293b]/40 border-slate-800' : 'bg-white border-gray-100 shadow-md'}`}>
                    <div className="p-5 border-b border-gray-100/10 bg-slate-500/5 flex items-center justify-between">
                      <h4 className="font-extrabold text-sm uppercase text-slate-500 tracking-wider">রানিং ইনভেন্টরি তালিকা</h4>
                      <span className="text-xs bg-pink-100 text-pink-700 font-bold px-3 py-1 rounded-xl">সবগুলো রেডি</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className={`border-b ${themeMode === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50/50 border-slate-100'} text-slate-500 font-black uppercase`}>
                            <th className="p-4 pl-6">প্রোডাক্টের নাম</th>
                            <th className="p-4">ক্যারিয়ার / ক্যাটাগরি</th>
                            <th className="p-4">মূল্য</th>
                            <th className="p-4">সচল স্টক</th>
                            <th className="p-4 text-center">অগ্রগতি (বিক্রি)</th>
                            <th className="p-4 pr-6 text-center">অ্যাকশন</th>
                          </tr>
                        </thead>
                        <tbody className="font-medium text-slate-700 divide-y divide-gray-100/10">
                          {products.map((p) => (
                            <tr key={p.id} className={`hover:bg-slate-500/5 transition ${themeMode === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                              <td className="p-4 pl-6 font-extrabold text-sm">{p.name}</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${themeMode === 'dark' ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-pink-50 text-pink-700'}`}>{p.category}</span>
                              </td>
                              <td className="p-4 font-black text-rose-500 text-sm">{currency}{p.price}</td>
                              <td className="p-4">
                                <span className={`font-black ${p.stock <= 10 ? 'text-amber-500' : 'text-slate-500'}`}>{p.stock} টি অবশিষ্ট</span>
                              </td>
                              <td className="p-4 text-center font-bold text-slate-500">
                                <span className="bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 rounded-lg font-black">{p.sales} Sold</span>
                              </td>
                              <td className="p-4 pr-6 text-center">
                                <button 
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                                  title="স্টোর থেকে সরান"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 2: CUSTOMERS (গ্রাহক) ================= */}
              {activeTab === 'customers' && (
                <div className="space-y-8" id="tabContentCustomers">
                  <div className={`p-6 rounded-3xl border ${themeMode === 'dark' ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-gray-100'}`}>
                    <h3 className="text-lg font-black mb-1.5">আপনার রানিং ক্লায়েন্ট পোর্টাল</h3>
                    <p className="text-slate-500 text-xs">যারা ইতিমধ্যে bKash / রকেট গেটওয়ে ফিনিশ করে সফল লাইভ সাইন ইন সম্পন্ন করেছেন।</p>
                  </div>

                  <div className={`rounded-3xl border overflow-hidden ${themeMode === 'dark' ? 'bg-[#1e293b]/40 border-slate-800' : 'bg-white border-gray-100 shadow-md'}`}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className={`border-b ${themeMode === 'dark' ? 'bg-slate-805 bg-slate-800/50 border-slate-700' : 'bg-slate-50/50 border-slate-100'} text-slate-500 font-black uppercase`}>
                            <th className="p-4 pl-6">গ্রাহকের নাম (Customer)</th>
                            <th className="p-4">ইমেইল অ্যাড্রেস</th>
                            <th className="p-4 text-center">মোট অর্ডার</th>
                            <th className="p-4">মোট পেমেন্ট করেছেন</th>
                            <th className="p-4">স্ট্যাটাস</th>
                            <th className="p-4 pr-6 text-center">ইউজার প্যানেল</th>
                          </tr>
                        </thead>
                        <tbody className="font-medium text-slate-700 divide-y divide-gray-100/10">
                          {customers.map((c) => (
                            <tr key={c.id} className={`hover:bg-slate-500/5 transition ${themeMode === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                              <td className="p-4 pl-6 font-extrabold text-sm flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 font-black flex items-center justify-center text-xs">
                                  {c.name.charAt(0)}
                                </div>
                                {c.name}
                              </td>
                              <td className="p-4 font-mono font-bold text-slate-500">{c.email}</td>
                              <td className="p-4 text-center font-black">{c.totalOrders} টি</td>
                              <td className="p-4 font-black text-emerald-600 text-sm">{currency}{c.totalSpent}</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                                  c.status === 'VIP' ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/30' :
                                  c.status === 'Regular' ? 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/30' :
                                  'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                                }`}>
                                  {c.status}
                                </span>
                              </td>
                              <td className="p-4 pr-6 text-center">
                                <button 
                                  onClick={() => alert(`📧 Direct communication pipeline set up for ${c.email}`)}
                                  className="text-pink-600 bg-pink-50 hover:bg-pink-100 text-xs font-black px-4 py-1.5 rounded-xl transition cursor-pointer"
                                >
                                  কমিউনিকেশন
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 3: ANALYTICS (বিশ্লেষণ) ================= */}
              {activeTab === 'analytics' && (
                <div className="space-y-8" id="tabContentAnalytics">
                  
                  {/* Basic Stats Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className={`p-6 rounded-3xl border text-left ${themeMode === 'dark' ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-gray-100'}`}>
                      <p className="text-slate-500 text-xs font-black uppercase">মোট সেলস রেভিনিউ</p>
                      <h3 className="text-3xl font-black text-emerald-600 mt-2">{currency}{totalRevenue.toLocaleString()}</h3>
                      <p className="text-slate-400 text-[10px] mt-1">bKash % চার্জ সহ মোট রেভিনিউ</p>
                    </div>
                    <div className={`p-6 rounded-3xl border text-left ${themeMode === 'dark' ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-gray-100'}`}>
                      <p className="text-slate-500 text-xs font-black uppercase">অর্ডার কনভার্সন রেট</p>
                      <h3 className="text-3xl font-black text-pink-600 mt-2">৭.৪%</h3>
                      <p className="text-slate-400 text-[10px] mt-1">গ্লোবাল এভারেজ ৩.২% এর চেয়ে বৃদ্ধি পেয়েছে</p>
                    </div>
                    <div className={`p-6 rounded-3xl border text-left ${themeMode === 'dark' ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-gray-100'}`}>
                      <p className="text-slate-500 text-xs font-black uppercase">এভারেজ শপিং টিকেট</p>
                      <h3 className="text-3xl font-black text-rose-500 mt-2">{currency}{averageTicket}</h3>
                      <p className="text-slate-400 text-[10px] mt-1">প্রতিটি গ্রাহকের এভারেজ ব্যয়িত টাকা</p>
                    </div>
                    <div className={`p-6 rounded-3xl border text-left ${themeMode === 'dark' ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-gray-100'}`}>
                      <p className="text-slate-500 text-xs font-black uppercase">এআই অপ্টিমাইজড এফিটমেন্ট</p>
                      <h3 className="text-3xl font-black text-cyan-500 mt-2">৯৯.৮%</h3>
                      <p className="text-slate-400 text-[10px] mt-1">অটোমেটেড ইনভয়েস সাকসেস রেট</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Visual Mock-Chart Container */}
                    <div className={`p-6 md:p-8 rounded-3xl border ${themeMode === 'dark' ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-gray-100 shadow'}`}>
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-sm font-black uppercase text-slate-500 flex items-center gap-2">
                          <TrendingUp className="text-emerald-500" /> রেভিনিউ প্রবৃদ্ধি (গত ৬ মাস)
                        </h4>
                        <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-xl">+৪২% বাড়তি</span>
                      </div>

                      {/* Mock Chart representation using beautifully styled elements */}
                      <div className="h-56 flex items-end justify-between gap-2.5 pt-6 font-mono text-[9px] font-bold text-slate-400">
                        <div className="flex flex-col items-center flex-1 h-full justify-end">
                          <span className="mb-2">৳32.4K</span>
                          <div className="w-full bg-pink-100 hover:bg-pink-200 transition-all rounded-t-lg" style={{ height: '35%' }} />
                          <span className="mt-2">December</span>
                        </div>
                        <div className="flex flex-col items-center flex-1 h-full justify-end">
                          <span className="mb-2">৳41.9K</span>
                          <div className="w-full bg-pink-200 hover:bg-pink-300 transition-all rounded-t-lg" style={{ height: '45%' }} />
                          <span className="mt-2">January</span>
                        </div>
                        <div className="flex flex-col items-center flex-1 h-full justify-end">
                          <span className="mb-2">৳48.0K</span>
                          <div className="w-full bg-pink-300 hover:bg-pink-400 transition-all rounded-t-lg" style={{ height: '52%' }} />
                          <span className="mt-2">February</span>
                        </div>
                        <div className="flex flex-col items-center flex-1 h-full justify-end">
                          <span className="mb-2">৳64.5K</span>
                          <div className="w-full bg-pink-400 hover:bg-pink-500 transition-all rounded-t-lg" style={{ height: '70%' }} />
                          <span className="mt-2">March</span>
                        </div>
                        <div className="flex flex-col items-center flex-1 h-full justify-end">
                          <span className="mb-2">৳78.1K</span>
                          <div className="w-full bg-pink-500 hover:bg-pink-600 transition-all rounded-t-lg" style={{ height: '82%' }} />
                          <span className="mt-2">April</span>
                        </div>
                        <div className="flex flex-col items-center flex-1 h-full justify-end">
                          <span className="mb-2">৳94.5K</span>
                          <div className="w-full bg-gradient-to-t from-pink-600 to-rose-600 hover:opacity-90 transition-all rounded-t-lg" style={{ height: '98%' }} />
                          <span className="mt-2">May (Live)</span>
                        </div>
                      </div>
                    </div>

                    {/* Sales breakdown by Category */}
                    <div className={`p-6 md:p-8 rounded-3xl border ${themeMode === 'dark' ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-gray-100 shadow'}`}>
                      <h4 className="text-sm font-black uppercase text-slate-500 mb-6 font-sans">টপ সেলিং অ্যাকাউন্ট ক্যাটাਗরি</h4>
                      
                      <div className="space-y-4 text-xs">
                        <div className="space-y-1">
                          <div className="flex justify-between font-bold">
                            <span>Streaming Accounts (Netflix, YouTube Premium)</span>
                            <span className="font-mono text-pink-600 font-extrabold">৫৭%</span>
                          </div>
                          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-pink-600 rounded-full" style={{ width: '57%' }} />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between font-bold">
                            <span>Gaming License Keys (GTA, Minecraft)</span>
                            <span className="font-mono text-pink-600 font-extrabold">২৬%</span>
                          </div>
                          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-500 rounded-full" style={{ width: '26%' }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between font-bold">
                            <span>Design Tools (Canva Pro)</span>
                            <span className="font-mono text-pink-600 font-extrabold">১২%</span>
                          </div>
                          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500 rounded-full" style={{ width: '12%' }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between font-bold">
                            <span>Music Subscriptions & Others</span>
                            <span className="font-mono text-pink-600 font-extrabold">৫%</span>
                          </div>
                          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: '5%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 4: MARKETING (বিপণন) ================= */}
              {activeTab === 'marketing' && (
                <div className="space-y-8" id="tabContentMarketing">
                  
                  {/* Create New Campaign */}
                  <div className={`p-6 md:p-8 rounded-3xl border ${themeMode === 'dark' ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-gray-100 shadow'}`}>
                    <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                      <Megaphone className="text-pink-600" /> নতুন বিপণন ক্যাম্পেইন চালু করুন
                    </h3>
                    
                    <form onSubmit={handleAddCampaign} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div>
                        <label className="block text-xs font-black text-slate-500 mb-1.5 uppercase">ক্যাম্পেইন নাম *</label>
                        <input 
                          type="text" 
                          placeholder="Example: Eid-ul-Adha Discount"
                          value={newCampName}
                          onChange={(e) => setNewCampName(e.target.value)}
                          className={`w-full p-3 text-xs font-bold rounded-xl outline-none border focus:ring-4 focus:ring-pink-500/10 transition-all ${themeMode === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-500 mb-1.5 uppercase">ক্যাম্পেইন মাধ্যম </label>
                        <select 
                          value={newCampType}
                          onChange={(e) => setNewCampType(e.target.value)}
                          className={`w-full p-3 text-xs font-bold rounded-xl outline-none border focus:ring-4 focus:ring-pink-500/10 transition-all ${themeMode === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                        >
                          <option value="Email Campaign">Email Campaign</option>
                          <option value="Social Media">Social Media</option>
                          <option value="SMS Gateway">SMS Gateway</option>
                          <option value="Push Notifications">Push Notifications</option>
                        </select>
                      </div>
                      <button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold py-3.5 rounded-xl text-xs uppercase shadow cursor-pointer"
                      >
                        ক্যাম্পেইন রেডি করুন
                      </button>
                    </form>
                  </div>

                  {/* Active Campaigns list */}
                  <div className={`p-6 rounded-3xl border ${themeMode === 'dark' ? 'bg-[#1e293b]/55 border-slate-800' : 'bg-white border-gray-100 shadow-md'}`}>
                    <h4 className="text-sm font-black uppercase text-slate-500 mb-4 tracking-wider">চলমান বিপণন ক্যাম্পেইন সমূহ</h4>
                    <div className="space-y-4">
                      {campaigns.map((camp) => (
                        <div 
                          key={camp.id} 
                          className={`p-4 rounded-2xl border flex flex-col sm:flex-row justify-between sm:items-center gap-3 transition ${
                            themeMode === 'dark' ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' : 'bg-gray-50 border-gray-200 hover:border-pink-200'
                          }`}
                        >
                          <div className="space-y-1">
                            <h5 className="font-extrabold text-sm flex items-center gap-2">
                              {camp.name}
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-lg bg-pink-100 text-pink-700">
                                {camp.type}
                              </span>
                            </h5>
                            <p className="text-slate-400 text-[11px]">টার্গেটেড রিস কাস্টমার: <span className="font-extrabold text-slate-500">{camp.reached.toLocaleString()} জন</span></p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" /> {camp.status}
                            </span>
                            <button 
                              onClick={() => alert(`Campaign ${camp.name} is running smoothly`)}
                              className="text-xs font-black bg-pink-100 text-pink-700 px-4 py-2 rounded-xl"
                            >
                              ট্র্যাক
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 5: DISCOUNTS (ছাড়) ================= */}
              {activeTab === 'discounts' && (
                <div className="space-y-8" id="tabContentDiscounts">
                  
                  {/* Create Coupon Code */}
                  <div className={`p-6 md:p-8 rounded-3xl border ${themeMode === 'dark' ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-gray-100 shadow'}`}>
                    <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                      <Percent className="text-pink-600" /> নতুন ডিসকাউন্ট প্রোমো কোড তৈরি
                    </h3>
                    
                    <form onSubmit={handleAddDiscount} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div>
                        <label className="block text-xs font-black text-slate-500 mb-1.5 uppercase">কুপন কোড (Coupon Code) *</label>
                        <input 
                          type="text" 
                          placeholder="Ex: EID50, VIP20"
                          value={newDiscCode}
                          onChange={(e) => setNewDiscCode(e.target.value)}
                          className={`w-full p-3 text-xs font-bold rounded-xl outline-none border focus:ring-4 focus:ring-pink-500/10 transition-all ${themeMode === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-500 mb-1.5 uppercase">ছাড় পরিমাণ *</label>
                        <input 
                          type="number" 
                          placeholder="Ex: 50"
                          value={newDiscValue}
                          onChange={(e) => setNewDiscValue(e.target.value)}
                          className={`w-full p-3 text-xs font-bold rounded-xl outline-none border focus:ring-4 focus:ring-pink-500/10 transition-all ${themeMode === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-500 mb-1.5 uppercase">ছাড়ের ধরন</label>
                        <select 
                          value={newDiscType}
                          onChange={(e) => setNewDiscType(e.target.value as 'Percentage' | 'Fixed')}
                          className={`w-full p-3 text-xs font-bold rounded-xl outline-none border focus:ring-4 focus:ring-pink-500/10 transition-all ${themeMode === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                        >
                          <option value="Percentage">পার্সেন্টেজ (%) Off</option>
                          <option value="Fixed">ফ্ল্যাট ক্যাশ টাকা Off (৳)</option>
                        </select>
                      </div>
                      <button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold py-3.5 rounded-xl text-xs uppercase shadow cursor-pointer"
                      >
                        ডিসকাউন্ট জেনারেট কর
                      </button>
                    </form>
                  </div>

                  {/* Active Discount Codes list */}
                  <div className={`p-6 rounded-3xl border ${themeMode === 'dark' ? 'bg-[#1e293b]/55 border-slate-800' : 'bg-white border-gray-100 shadow-md'}`}>
                    <h4 className="text-sm font-black uppercase text-slate-500 mb-4 tracking-wider">সক্রিয় কুপন ও ছাড় সমূহ</h4>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className={`border-b ${themeMode === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50/50 border-slate-100'} text-slate-500 font-black uppercase`}>
                            <th className="p-4 pl-6">কুপন কোড (Coupon Code)</th>
                            <th className="p-4">ছাড়ের টাইপ</th>
                            <th className="p-4">পরিমাণ (ডিসকাউন্ট)</th>
                            <th className="p-4">অবস্থা (স্ট্যাটাস)</th>
                            <th className="p-4 text-center pr-6">অ্যাকশন</th>
                          </tr>
                        </thead>
                        <tbody className="font-medium text-slate-700 divide-y divide-gray-100/10">
                          {discounts.map((disc) => (
                            <tr key={disc.id} className={`hover:bg-slate-500/5 transition ${themeMode === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                              <td className="p-4 pl-6 font-extrabold text-sm text-pink-600 font-mono tracking-wide">{disc.code}</td>
                              <td className="p-4">{disc.type} Off</td>
                              <td className="p-4 font-black">
                                {disc.type === 'Percentage' ? `${disc.value}%` : `${currency}${disc.value}`}
                              </td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                                  disc.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 animate-pulse' : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
                                }`}>
                                  {disc.status}
                                </span>
                              </td>
                              <td className="p-4 text-center pr-6">
                                <button 
                                  onClick={() => setDiscounts(discounts.filter(d => d.id !== disc.id))}
                                  className="text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition cursor-pointer"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 6: ONLINE STORE (অনলাইন স্টোর) ================= */}
              {activeTab === 'store' && (
                <div className="space-y-8" id="tabContentOnlineStore">
                  <div className={`p-6 md:p-8 rounded-3xl border ${themeMode === 'dark' ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-gray-100 shadow'}`}>
                    <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                      <Globe className="text-pink-600 animate-spin-slow" /> অনলাইন স্টোর ব্র্যান্ডিং ও কুফিগুরেশন
                    </h3>
                    
                    <div className="space-y-6 text-xs max-w-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-black text-slate-500 mb-1.5 uppercase">স্টোর নাম শিরোনাম *</label>
                          <input 
                            type="text" 
                            value={storeCustomTitle}
                            onChange={(e) => setStoreCustomTitle(e.target.value)}
                            className={`w-full p-3.5 text-xs font-bold rounded-xl outline-none border focus:ring-4 focus:ring-pink-500/10 transition-all ${themeMode === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-slate-500 mb-1.5 uppercase">স্টোর প্রধান থিম কালার</label>
                          <div className="flex gap-2.5 items-center">
                            <input 
                              type="color" 
                              value={storeThemeColor}
                              onChange={(e) => setStoreThemeColor(e.target.value)}
                              className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0 focus:outline-none"
                            />
                            <span className="font-mono text-xs font-bold text-slate-500 uppercase">{storeThemeColor}</span>
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-2xl border flex items-center justify-between ${themeMode === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="space-y-1">
                          <p className="font-extrabold text-sm mb-0.5">সব গ্রাহকের জন্য ওয়েবসাইট সচল রাখুন</p>
                          <p className="text-slate-400 text-[11px]">নিষ্ক্রিয় করলে গ্রাহকেরা সাময়িক মেইনটেনেন্স ব্যানার দেখতে পাবে।</p>
                        </div>
                        
                        <button 
                          onClick={() => setStoreOnlineState(!storeOnlineState)}
                          className={`px-5 py-2.5 rounded-xl font-black text-xs transition duration-200 cursor-pointer ${
                            storeOnlineState 
                              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-500' 
                              : 'bg-rose-500/10 border border-rose-500/30 text-rose-500'
                          }`}
                        >
                          {storeOnlineState ? 'ONLINE / LIVE' : 'MAINTENANCE MODE'}
                        </button>
                      </div>

                      <div className="pt-4 border-t border-gray-100/10 flex justify-end">
                        <button 
                          onClick={() => alert('✅ Store config options updated successfully!')}
                          className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold px-8 py-3.5 rounded-xl text-xs uppercase shadow"
                        >
                          সেটিংস আপডেট করুন
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 7: MAILBOX (মেইল বক্স) ================= */}
              {activeTab === 'mailbox' && (
                <div className="space-y-8" id="tabContentMailbox">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Mailbox List */}
                    <div className={`lg:col-span-5 p-6 rounded-3xl border flex flex-col ${themeMode === 'dark' ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-gray-100'}`}>
                      <div className="pb-4 border-b border-gray-100/10 mb-4 flex justify-between items-center">
                        <h4 className="font-black text-sm uppercase text-slate-500">ইনকামিং অভিযোগ ও মেইলসমূহ</h4>
                        {unreadMailCount > 0 && (
                          <span className="bg-rose-100 text-rose-600 text-[10px] font-black px-3 py-1 rounded-full">{unreadMailCount} টি অবিক্রিত</span>
                        )}
                      </div>

                      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                        {mails.map((m) => (
                          <div 
                            key={m.id} 
                            onClick={() => readMailMsg(m)}
                            className={`p-4 rounded-2xl border text-left cursor-pointer transition ${
                              activeMail?.id === m.id ? 'border-pink-500 bg-pink-50/10' :
                              !m.isRead ? (themeMode === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-pink-50/50 border-pink-100') :
                              (themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-gray-50/50 border-gray-200/50')
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-black text-xs text-pink-600 truncate max-w-[140px]">{m.sender}</span>
                              <span className="font-mono text-[9px] text-slate-400 font-bold">{m.time}</span>
                            </div>
                            <h5 className={`font-bold text-xs truncate ${!m.isRead ? 'font-black text-slate-800 dark:text-white' : 'text-slate-500'}`}>{m.subject}</h5>
                            <p className="text-slate-400 text-[11px] truncate mt-1">{m.body}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Active Mail View & Reply Panel */}
                    <div className={`lg:col-span-7 p-6 md:p-8 rounded-3xl border flex flex-col justify-between ${themeMode === 'dark' ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-gray-100 shadow'}`}>
                      {activeMail ? (
                        <div className="space-y-6 flex flex-col justify-between h-full">
                          
                          <div className="space-y-4">
                            <div className="flex justify-between items-start pb-4 border-b border-gray-100/10">
                              <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">প্রেরক (SENDER)</p>
                                <p className="font-extrabold text-sm text-pink-600">{activeMail.sender}</p>
                              </div>
                              <span className="text-[10px] font-bold text-slate-400 font-mono">{activeMail.time}</span>
                            </div>
                            
                            <div>
                              <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">বিষয় (SUBJECT)</p>
                              <h5 className="font-extrabold text-sm">{activeMail.subject}</h5>
                            </div>

                            <div className={`p-4 rounded-2xl text-xs font-medium leading-relaxed ${themeMode === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-gray-50 border border-gray-100'}`}>
                              {activeMail.body}
                            </div>
                          </div>

                          <div className="pt-6 border-t border-gray-100/10 space-y-3">
                            <label className="block text-xs font-black text-slate-500 uppercase">গ্রাহকের রিপ্লাই মেসেজ টাইপ করুন *</label>
                            <textarea 
                              rows={3} 
                              placeholder="ভেরিফাইড Bkash পেমেন্ট কোড জেনারেট সম্পন্ন করা হয়েছে। কোডটি আপনার ওয়ালেট..."
                              value={mailReplyText}
                              onChange={(e) => setMailReplyText(e.target.value)}
                              className={`w-full p-3 text-xs font-bold rounded-xl outline-none border focus:ring-4 focus:ring-pink-500/10 transition-all ${themeMode === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                            />
                            
                            <div className="flex justify-end gap-3.5">
                              <button 
                                onClick={() => setActiveMail(null)}
                                className={`text-xs font-bold px-5 py-2.5 rounded-xl border ${themeMode === 'dark' ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 text-slate-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                              >
                                ডিসমিস
                              </button>
                              <button 
                                onClick={sendMailResponse}
                                className="bg-pink-600 hover:bg-pink-500 text-white text-xs font-extrabold px-6 py-2.5 rounded-xl flex items-center gap-1.5 shadow"
                              >
                                <Send size={12} /> জবাব দিন
                              </button>
                            </div>
                          </div>

                        </div>
                      ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400">
                          <Mail size={48} className="mb-3 opacity-20" />
                          <p className="font-black text-sm">কোনো মেইল সিলেক্ট করা নেই</p>
                          <p className="text-[11px] mt-1 max-w-xs">বামপাশ থেকে যেকোনো পেন্ডিং অভিযোগ বা ভেরিফিকেশন মেইল সিলেক্ট করে উত্তর দিন।</p>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* ================= TAB 8: AI AUTO LISTING (AI অটো লিস্টিং) ================= */}
              {activeTab === 'ai' && (
                <div className="space-y-6" id="tabContentAiListing">
                  
                  {/* Brief introduction card to connect with AutopilotControlPanel */}
                  <div className={`p-6 rounded-3xl border text-left ${themeMode === 'dark' ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-black text-pink-600 flex items-center gap-1.5">
                          <Bot className="animate-bounce" /> এআই অটো লিস্টিং পোর্টাল
                        </h3>
                        <p className="text-slate-400 text-xs mt-1">
                          এটি জেমিনি এআই মডেল এবং অটো-পাইলট স্যান্ডবক্স এর সাথে সরাসরি সংযুক্ত। এখানে কোড ড্রাফটিং ও সার্ভার ফিক্স করা সম্ভব।
                        </p>
                      </div>
                      <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 px-3 py-1 rounded-full font-black animate-pulse flex items-center gap-1">
                        ✓ AI SANDBOX CONNETION ACTIVE
                      </span>
                    </div>
                  </div>

                  {/* Render the full AutopilotControlPanel inside here! */}
                  <div id="aiControlPanelWrapper">
                    <AutopilotControlPanel />
                  </div>
                </div>
              )}

              {/* ================= TAB 9: ADDONS/APPS (অ্যাড-অনস) ================= */}
              {activeTab === 'apps' && (
                <div className="space-y-8" id="tabContentApps">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addons.map((add) => (
                      <div 
                        key={add.id} 
                        className={`p-6 rounded-3xl border flex gap-4 transition-all ${
                          themeMode === 'dark' ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' : 'bg-white border-gray-100 hover:shadow-lg'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-2xl bg-pink-100 text-2xl flex items-center justify-center shrink-0 shadow-inner">
                          {add.icon}
                        </div>
                        
                        <div className="space-y-2 flex-1 text-left">
                          <div className="flex justify-between items-center">
                            <h5 className="font-extrabold text-sm">{add.name}</h5>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${
                              add.enabled ? 'bg-emerald-50 text-emerald-600 border-emerald-500/20' : 'bg-gray-100 text-gray-500 border-gray-200'
                            }`}>
                              {add.enabled ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                          </div>
                          
                          <p className="text-slate-400 text-[11px] leading-relaxed">{add.desc}</p>
                          
                          <div className="pt-2 flex justify-end">
                            <button 
                              onClick={() => toggleAddon(add.id)}
                              className={`text-xs font-black px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
                                add.enabled 
                                  ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30' 
                                  : 'bg-pink-600 hover:bg-pink-500 text-white'
                              }`}
                            >
                              {add.enabled ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= TAB 10: SETTINGS (সেটিংস ও থিম) ================= */}
              {activeTab === 'settings' && (
                <div className="space-y-8" id="tabContentSettings">
                  <div className={`p-6 md:p-8 rounded-3xl border ${themeMode === 'dark' ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-gray-100 shadow'}`}>
                    <h3 className="text-lg font-black mb-6">সেটিংস ও থিম অপশন</h3>
                    
                    <div className="space-y-6 text-xs max-w-xl">
                      <div className="flex items-center justify-between p-4 rounded-xl border border-pink-100/10">
                        <div className="space-y-0.5">
                          <p className="font-bold text-sm">ড্যাশবোর্ড কালার থিম</p>
                          <p className="text-slate-400 text-[11px]">লাইট বা ডার্ক অপশন টগল করুন।</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setThemeMode('light')}
                            className={`px-4 py-2 rounded-xl border font-bold text-[11px] ${themeMode === 'light' ? 'bg-pink-600 border-pink-500 text-white' : 'bg-transparent text-slate-400 border-slate-700/60'}`}
                          >
                            LIGHT
                          </button>
                          <button 
                            onClick={() => setThemeMode('dark')}
                            className={`px-4 py-2 rounded-xl border font-bold text-[11px] ${themeMode === 'dark' ? 'bg-pink-600 border-pink-500 text-white' : 'bg-transparent text-slate-400 border-slate-700/60'}`}
                          >
                            DARK
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl border border-pink-100/10">
                        <div className="space-y-0.5">
                          <p className="font-bold text-sm">কারেন্সি সিম্বল (Currency)</p>
                          <p className="text-slate-400 text-[11px]">বাংলাদেশ টাকা (৳) বা আমেরিকান ডলার ($) সিলেক্ট করুন।</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setCurrency('৳')}
                            className={`px-4 py-2 rounded-xl border font-bold text-[11px] ${currency === '৳' ? 'bg-pink-600 border-pink-500 text-white' : 'bg-transparent text-slate-400 border-slate-700/60'}`}
                          >
                            ৳ BDT
                          </button>
                          <button 
                            onClick={() => setCurrency('$')}
                            className={`px-4 py-2 rounded-xl border font-bold text-[11px] ${currency === '$' ? 'bg-pink-600 border-pink-500 text-white' : 'bg-transparent text-slate-400 border-slate-700/60'}`}
                          >
                            $ USD
                          </button>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100/10 flex justify-end">
                        <button 
                          onClick={() => alert('✅ Settings Saved Successfully!')}
                          className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold px-8 py-3.5 rounded-xl text-xs uppercase shadow"
                        >
                          সংরক্ষণ করুন (Save)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </main>
      </div>
    </div>
  );
}
