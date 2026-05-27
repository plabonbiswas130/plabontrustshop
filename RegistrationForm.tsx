import React, { useState } from 'react';
import { 
  ArrowLeft, 
  IdCard, 
  Image as ImageIcon, 
  Mail, 
  User, 
  MapPin, 
  Globe, 
  Send, 
  CheckCircle,
  Home,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { motion } from 'motion/react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface RegistrationFormProps {
  t: any;
  onBack: () => void;
  mode: 'dropshipping' | 'warehouse';
  onSubmitSuccess?: (data: any) => void;
  currentUser?: any;
}

export function RegistrationForm({ t, onBack, mode, onSubmitSuccess, currentUser }: RegistrationFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState<string | undefined>();
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState({ text: '', color: '' });
  const [formData, setFormData] = useState({
    idNumber: '',
    email: currentUser?.email || '',
    password: '',
    name: currentUser?.name || '',
    district: '',
    city: '',
    country: '',
    usernameVerify: ''
  });

  const isDropship = mode === 'dropshipping';
  const focusBorderClass = isDropship ? 'focus:border-pink-500' : 'focus:border-blue-500';
  const buttonBgClass = isDropship ? 'bg-[#FF1493] hover:bg-pink-600' : 'bg-blue-600 hover:bg-blue-700';
  const shadowClass = isDropship ? 'shadow-pink-100' : 'shadow-blue-100';

  const title = isDropship ? t.dropshippingRegTitle : t.warehouseRegTitle;
  const successMsg = isDropship ? t.appSuccess : t.warehouseSuccess;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'usernameVerify') {
      checkUsername(value);
    }
  };

  const checkUsername = (username: string) => {
    const cleanUsername = username.trim();
    if (cleanUsername.length < 3) {
      setUsernameStatus({ text: "Username must be at least 3 characters long.", color: "red" });
      setIsUsernameValid(false);
      return;
    }
    const existingUsernames = ["admin", "shop123", "myshop", "shakil", "dropship99"];
    setTimeout(() => {
      if (!existingUsernames.includes(cleanUsername.toLowerCase())) {
        setUsernameStatus({ text: "✓ This username is available.", color: "green" });
        setIsUsernameValid(true);
      } else {
        setUsernameStatus({ text: "✗ This username is already taken.", color: "red" });
        setIsUsernameValid(false);
      }
    }, 300);
  };

  const handleSuggest = () => {
    const currentName = formData.usernameVerify.trim() || formData.name.trim().toLowerCase().replace(/\s+/g, '') || "user";
    const randomNumber = Math.floor(100 + Math.random() * 900); 
    const suggested = currentName.replace(/[0-9]/g, '') + randomNumber;
    handleInputChange('usernameVerify', suggested);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUsernameValid) {
      setUsernameStatus({ text: "Please fix the username error before submitting.", color: "red" });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onSubmitSuccess) {
        onSubmitSuccess({
          ...formData,
          whatsapp: whatsappNumber,
          type: mode
        });
      }
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-[500px] mx-auto mt-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="success-card bg-white rounded-[25px] shadow-2xl p-8 text-center"
        >
          <div className="flex justify-center mb-6">
            <CheckCircle size={80} className="text-green-500" />
          </div>
          <h3 className="text-3xl font-bold text-green-600 mb-4">{t.verifiedOk}</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {successMsg}
          </p>
          <button 
            onClick={onBack}
            className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-4 rounded-2xl font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-200 cursor-pointer"
          >
            <Home size={20} />
            {t.backToDashboard}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[500px] mx-auto mt-6 mb-20 px-4">
      {/* Universal Page Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-medium transition"
        >
          <ArrowLeft size={18} />
          <span>Dashboard</span>
        </button>
        <div className="text-slate-500 font-bold text-xs bg-slate-50 py-2 px-4 rounded-xl border">
          Role: <span className="text-[#FF1493]">{currentUser?.role || 'Verified User'}</span>
        </div>
      </div>

      <div className="text-center mb-10">
        <p className="text-sm text-slate-500 font-extrabold tracking-wide uppercase">{title}</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="registration-container bg-white p-6 md:p-8 rounded-[30px] border border-slate-100 shadow-xl"
      >
        <form onSubmit={handleSubmit} className="registration-form space-y-6 text-left">
          
          {/* NID number */}
          <div className="form-group">
            <label className="text-xs font-black text-slate-600 mb-2 flex items-center gap-1.5"><IdCard size={15} /> {t.idNumber}</label>
            <input 
              type="text" 
              placeholder="Enter your NID or ID Number" 
              required 
              className={`w-full p-3.5 bg-slate-50 border border-slate-200 outline-none text-xs font-semibold rounded-xl text-slate-800 transition ${focusBorderClass}`}
              value={formData.idNumber}
              onChange={(e) => handleInputChange('idNumber', e.target.value)}
            />
          </div>

          {/* Upload ID files */}
          <div className="form-group">
            <label className="text-xs font-black text-slate-600 mb-2 flex items-center gap-1.5"><ImageIcon size={15} /> {t.uploadId}</label>
            <input type="file" accept="image/*,.pdf" className="w-full text-xs p-1" />
            <small className="text-gray-400 block mt-1 text-[10px]">{t.uploadHint}</small>
          </div>

          {/* Dynamic Username Verify */}
          <div className="form-group relative">
            <label htmlFor="username_verify" className="text-xs font-black text-slate-600 mb-2 flex items-center gap-1.5">
              Username Verify
            </label>
            <div className="flex gap-2 items-center">
              <input 
                type="text" 
                id="username_verify" 
                name="username_verify" 
                placeholder="Enter username" 
                required
                className={`w-full p-3.5 bg-slate-50 border rounded-xl text-xs font-semibold text-slate-800 outline-none transition`}
                style={{ 
                  borderColor: usernameStatus.color === 'red' ? 'red' : usernameStatus.color === 'green' ? 'green' : '#cbd5e1' 
                }}
                value={formData.usernameVerify}
                onChange={(e) => handleInputChange('usernameVerify', e.target.value)}
              />
              <button 
                type="button" 
                title="Suggest Username"
                onClick={handleSuggest}
                className="p-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl cursor-pointer text-sm transition"
              >
                🔄
              </button>
            </div>
            {usernameStatus.text && (
              <div 
                className="text-[11px] mt-1.5 font-bold"
                style={{ color: usernameStatus.color === 'green' ? '#10b981' : '#ef4444' }}
              >
                {usernameStatus.text}
              </div>
            )}
          </div>

          {/* WhatsApp Phone Input */}
          <div className="whatsapp-group">
            <label className="text-xs font-black text-slate-600 mb-2 flex items-center gap-1.5">
              <Smartphone size={15} /> WhatsApp Number
            </label>
            <div className="phone-input-pts border p-2 rounded-xl bg-slate-50">
              <PhoneInput
                placeholder="Enter WhatsApp number"
                value={whatsappNumber}
                onChange={setWhatsappNumber}
                defaultCountry="BD"
                required
              />
            </div>
          </div>

          {/* Email address */}
          <div className="form-group">
            <label className="text-xs font-black text-slate-600 mb-2 flex items-center gap-1.5"><Mail size={15} /> {t.email}</label>
            <input 
              type="email" 
              placeholder="your.email@example.com" 
              required 
              className={`w-full p-3.5 bg-slate-50 border border-slate-200 outline-none text-xs font-semibold rounded-xl text-slate-800 transition ${focusBorderClass}`}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>

          {/* Account Password */}
          <div className="form-group">
            <label className="text-xs font-black text-slate-600 mb-2 flex items-center gap-1.5"><ShieldCheck size={15} /> {t.accountPassword}</label>
            <input 
              type="password" 
              placeholder="একটি পাসওয়ার্ড দিন" 
              required 
              className={`w-full p-3.5 bg-slate-50 border border-slate-200 outline-none text-xs font-semibold rounded-xl text-slate-800 transition ${focusBorderClass}`}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label className="text-xs font-black text-slate-600 mb-2 flex items-center gap-1.5"><User size={15} /> {t.name}</label>
            <input 
              type="text" 
              placeholder="Enter your full name" 
              required 
              className={`w-full p-3.5 bg-slate-50 border border-slate-200 outline-none text-xs font-semibold rounded-xl text-slate-800 transition ${focusBorderClass}`}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>

          {/* District & City */}
          <div className="form-row-grid grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="text-xs font-black text-slate-600 mb-2 flex items-center gap-1.5"><MapPin size={15} /> {t.district}</label>
              <input 
                type="text" 
                placeholder="District" 
                className={`w-full p-3.5 bg-slate-50 border border-slate-200 outline-none text-xs font-semibold rounded-xl text-slate-800 transition ${focusBorderClass}`}
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="text-xs font-black text-slate-600 mb-2 flex items-center gap-1.5"><MapPin size={15} /> {t.city}</label>
              <input 
                type="text" 
                placeholder="Village / City" 
                className={`w-full p-3.5 bg-slate-50 border border-slate-200 outline-none text-xs font-semibold rounded-xl text-slate-800 transition ${focusBorderClass}`}
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            </div>
          </div>

          {/* Country Selection */}
          <div className="form-group">
            <label className="text-xs font-black text-slate-600 mb-2 flex items-center gap-1.5"><Globe size={15} /> {t.country}</label>
            <select 
              value={formData.country}
              className={`w-full p-3.5 bg-slate-50 border border-slate-200 outline-none text-xs font-semibold rounded-xl bg-white text-slate-800 transition ${focusBorderClass}`}
              onChange={(e) => handleInputChange('country', e.target.value)}
            >
              <option value="">{t.selectCountry}</option>
              <option value="BD">Bangladesh</option>
              <option value="IN">India</option>
              <option value="PK">Pakistan</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="SA">Saudi Arabia</option>
              <option value="AE">UAE</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isLoading}
            className={`mt-4 w-full text-white font-extrabold py-4 px-6 rounded-2xl text-xs transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg ${buttonBgClass} ${shadowClass} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="inline-block">
                <Send size={18} />
              </motion.div>
            ) : (
              <Send size={18} />
            )}
            {t.submitBtn}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
