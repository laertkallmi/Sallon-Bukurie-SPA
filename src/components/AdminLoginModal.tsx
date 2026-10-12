import React, { useState, useEffect } from 'react';
import { Lock, X, AlertCircle } from 'lucide-react';
import { verifyAdminCode } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { t } = useLanguage();
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(null);
    }
  }, [isOpen]);

  // Auto-verify when 6 digits are typed
  useEffect(() => {
    if (pin.length === 6) {
      handleVerify(pin);
    }
  }, [pin]);

  const handleVerify = async (codeToVerify: string) => {
    setIsVerifying(true);
    setError(null);

    const isValid = await verifyAdminCode(codeToVerify);
    setIsVerifying(false);

    if (isValid) {
      onSuccess();
    } else {
      setError(t.wrongPinError);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPin('');
    }
  };

  const handleDigitClick = (digit: string) => {
    if (pin.length < 6) {
      const next = pin + digit;
      setPin(next);
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const handleClear = () => {
    setPin('');
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className={`relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border-2 border-pink-200 overflow-hidden ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            aria-label="Mbyll"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-6 h-6 text-white" />
          </div>

          <h3 className="font-serif-luxury text-xl font-bold tracking-wide">
            {t.adminLoginTitle}
          </h3>
          <p className="text-xs text-pink-100 mt-1">
            {t.adminLoginDesc}
          </p>
        </div>

        {/* PIN Input Dots */}
        <div className="p-6">
          <div className="flex justify-center items-center gap-3 my-4">
            {[0, 1, 2, 3, 4, 5].map(index => {
              const isFilled = index < pin.length;
              return (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    isFilled
                      ? 'bg-gradient-to-tr from-pink-500 to-rose-500 scale-125 shadow-sm'
                      : 'border-2 border-pink-200 bg-pink-50/50'
                  }`}
                />
              );
            })}
          </div>

          {error && (
            <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 justify-center">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => handleDigitClick(num)}
                disabled={isVerifying}
                className="h-14 rounded-2xl bg-rose-50/60 hover:bg-pink-100 text-stone-800 font-bold text-lg transition-colors border border-pink-100 flex items-center justify-center active:scale-95"
              >
                {num}
              </button>
            ))}

            <button
              type="button"
              onClick={handleClear}
              disabled={isVerifying}
              className="h-14 rounded-2xl bg-white hover:bg-stone-50 text-stone-500 font-medium text-xs border border-pink-100 flex items-center justify-center transition-colors"
            >
              {t.clearBtn}
            </button>

            <button
              type="button"
              onClick={() => handleDigitClick('0')}
              disabled={isVerifying}
              className="h-14 rounded-2xl bg-rose-50/60 hover:bg-pink-100 text-stone-800 font-bold text-lg transition-colors border border-pink-100 flex items-center justify-center active:scale-95"
            >
              0
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isVerifying}
              className="h-14 rounded-2xl bg-white hover:bg-rose-50 text-rose-600 font-semibold text-xs border border-pink-100 flex items-center justify-center transition-colors"
            >
              {t.deleteBtn}
            </button>
          </div>

          {isVerifying && (
            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-pink-600">
              <div className="w-3.5 h-3.5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
              <span>{t.adminLoginVerifying}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
