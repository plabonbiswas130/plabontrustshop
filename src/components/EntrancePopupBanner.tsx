import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, ExternalLink, ChevronRight, BellRing } from 'lucide-react';
import { SiteConfig } from '../types';
import { sounds } from '../utils/sound';

interface EntrancePopupBannerProps {
  siteConfig: SiteConfig;
  onNavigateToRecharge?: () => void;
}

export const EntrancePopupBanner: React.FC<EntrancePopupBannerProps> = ({
  siteConfig,
  onNavigateToRecharge,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only show if banner image is uploaded/configured and not explicitly disabled
    if (siteConfig.showPopupBanner === false || !siteConfig.popupBannerImage) {
      setIsOpen(false);
      return;
    }

    // Automatically trigger entrance banner smoothly whenever loaded
    const timer = setTimeout(() => {
      setIsOpen(true);
      sounds.playReceive();
    }, 500);

    return () => clearTimeout(timer);
  }, [siteConfig.showPopupBanner, siteConfig.popupBannerImage]);

  const handleClose = () => {
    sounds.playClick();
    setIsOpen(false);
  };

  const handleActionClick = () => {
    handleClose();
    if (siteConfig.popupBannerLink) {
      if (siteConfig.popupBannerLink.startsWith('http')) {
        window.open(siteConfig.popupBannerLink, '_blank', 'noopener,noreferrer');
      }
    } else if (onNavigateToRecharge) {
      onNavigateToRecharge();
    }
  };

  // If no banner is uploaded, do not render anything
  if (siteConfig.showPopupBanner === false || !siteConfig.popupBannerImage) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          {/* Backdrop click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0"
          />

          {/* Modal Container - fully responsive across mobile, tablet & desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[360px] xs:max-w-sm sm:max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/10 z-10 flex flex-col my-auto max-h-[90vh]"
          >
            {/* Top Right Close [X] Button - High contrast, accessible on any screen */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/80 hover:bg-rose-600 text-white border border-white/20 transition-all duration-200 shadow-xl cursor-pointer hover:scale-110 active:scale-95 group"
              title="ব্যানারটি বন্ধ করুন"
              aria-label="Close banner"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>

            {/* Banner Image with responsive aspect ratio */}
            <div className="relative w-full h-44 xs:h-52 sm:h-64 bg-slate-950 overflow-hidden flex items-center justify-center shrink-0">
              <img
                src={siteConfig.popupBannerImage}
                alt="অফিসিয়াল ব্যানার"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition duration-300 hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/25 to-transparent" />

              {/* Tag / Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-amber-500/40 text-[10px] sm:text-[11px] font-bold text-amber-300 shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>অফিসিয়াল নোটিশ</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-5 pt-3 space-y-3 bg-slate-900 overflow-y-auto">
              {siteConfig.popupBannerTitle && (
                <h3 className="text-sm sm:text-base md:text-lg font-black text-white flex items-center gap-2">
                  <BellRing className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{siteConfig.popupBannerTitle}</span>
                </h3>
              )}

              {siteConfig.popupBannerSubtitle && (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {siteConfig.popupBannerSubtitle}
                </p>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleActionClick}
                  className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg shadow-orange-500/20 transition active:scale-[0.98] cursor-pointer"
                >
                  <span>{siteConfig.popupBannerButtonText || 'এখনই দেখুন'}</span>
                  {siteConfig.popupBannerLink ? (
                    <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs sm:text-sm border border-slate-700 transition active:scale-[0.98] cursor-pointer shrink-0"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

