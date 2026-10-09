import React, { useState, useEffect } from 'react';
import { Sparkles, X, RefreshCw, CheckCircle2, Lightbulb } from 'lucide-react';
import { sound, SpeechReader } from '../utils/audio';

interface ColorHintGadgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ColorHintGadget: React.FC<ColorHintGadgetProps> = ({ isOpen, onClose }) => {
  const [mixProgress, setMixProgress] = useState<number>(0);
  const [isMixed, setIsMixed] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      sound.playHintBell();
      setMixProgress(0);
      setIsMixed(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMix = () => {
    if (isMixed || isAnimating) return;
    setIsAnimating(true);
    sound.playMixSplash();

    let step = 0;
    const interval = setInterval(() => {
      step += 10;
      setMixProgress(step);
      if (step >= 100) {
        clearInterval(interval);
        setIsMixed(true);
        setIsAnimating(false);
        sound.playCorrect();
      }
    }, 120);
  };

  const handleReset = () => {
    sound.playClick();
    setMixProgress(0);
    setIsMixed(false);
    setIsAnimating(false);
  };

  const handleReadDeduction = () => {
    sound.playClick();
    SpeechReader.speak(
      'Red paint plus yellow paint makes orange! Annie painted her dog yellow. Harry painted red over it. That is how Harry made the orange monster!'
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#FFFDF8] rounded-3xl border-3 border-amber-400 shadow-2xl overflow-hidden p-6 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
          aria-label="Close Hint Gadget"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-2xl shadow-md animate-pulse">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700">
              <Sparkles className="w-3.5 h-3.5" /> Nate's Detective Hint Gadget
            </div>
            <h3 className="text-xl md:text-2xl font-bold font-display text-stone-900">
              The Color Mixing Secret
            </h3>
          </div>
        </div>

        {/* Description for Grade 3-4 */}
        <p className="text-sm text-stone-600 mb-5">
          Harry only has <strong className="text-red-600">RED paint</strong>! How did he paint an{' '}
          <strong className="text-orange-600">ORANGE monster</strong>? Test what happens when you mix colors!
        </p>

        {/* Interactive Mixing Canvas */}
        <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200/90 mb-5">
          <div className="flex items-center justify-around gap-2 text-center mb-6">
            {/* Paint 1: Red */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500 shadow-md border-2 border-red-600 flex items-center justify-center text-white font-bold text-sm">
                RED
              </div>
              <span className="text-xs font-semibold text-stone-700 mt-1.5">Harry's Paint</span>
            </div>

            <div className="text-2xl font-bold text-stone-400">+</div>

            {/* Paint 2: Yellow */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-yellow-400 shadow-md border-2 border-yellow-500 flex items-center justify-center text-amber-950 font-bold text-sm">
                YELLOW
              </div>
              <span className="text-xs font-semibold text-stone-700 mt-1.5">Annie's Dog Picture</span>
            </div>

            <div className="text-2xl font-bold text-stone-400">=</div>

            {/* Result: Orange */}
            <div className="flex flex-col items-center">
              <div
                className={`w-16 h-16 rounded-2xl shadow-md border-2 transition-all duration-700 flex items-center justify-center font-bold text-sm ${
                  isMixed
                    ? 'bg-orange-500 border-orange-600 text-white scale-110 shadow-orange-300'
                    : 'bg-stone-200 border-dashed border-stone-300 text-stone-400'
                }`}
              >
                {isMixed ? 'ORANGE!' : '?'}
              </div>
              <span className="text-xs font-semibold text-stone-700 mt-1.5">Result Color</span>
            </div>
          </div>

          {/* Mixing Tube Animation Area */}
          <div className="relative h-14 bg-white rounded-xl border border-stone-200 overflow-hidden flex items-center px-4 mb-4">
            <div
              className="absolute left-0 top-0 bottom-0 transition-all duration-300 rounded-xl"
              style={{
                width: `${mixProgress}%`,
                background:
                  mixProgress < 50
                    ? `linear-gradient(90deg, #ef4444 0%, #f59e0b ${mixProgress}%)`
                    : `linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #f97316 100%)`,
              }}
            />
            <div className="relative z-10 w-full flex items-center justify-between text-xs font-bold">
              <span className={mixProgress > 20 ? 'text-white' : 'text-stone-500'}>
                {isMixed ? 'Colors Mixed Successfully!' : 'Tap "Mix Paints" below'}
              </span>
              <span className={mixProgress > 80 ? 'text-white' : 'text-stone-500 font-mono'}>
                {mixProgress}%
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleMix}
              disabled={isMixed || isAnimating}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                isMixed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-red-500 via-amber-500 to-orange-500 text-white hover:opacity-95 active:scale-98'
              }`}
            >
              {isMixed ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Mixed: Red + Yellow = Orange!
                </>
              ) : isAnimating ? (
                'Mixing Paint...'
              ) : (
                'Mix Red & Yellow Paint!'
              )}
            </button>

            {isMixed && (
              <button
                onClick={handleReset}
                className="p-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors cursor-pointer"
                title="Reset color test"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Nate's Logical Deduction Box */}
        <div className="p-4 bg-amber-50/90 rounded-2xl border border-amber-200 mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
              🕵️‍♂️ Nate's Big Deduction:
            </h4>
            <button
              onClick={handleReadDeduction}
              className="text-xs text-amber-900 underline hover:text-amber-700 font-medium"
            >
              Read aloud
            </button>
          </div>
          <p className="text-stone-800 text-sm leading-relaxed font-medium">
            Annie painted her dog with <strong className="text-yellow-600">YELLOW</strong> paint.
            Harry had only <strong className="text-red-600">RED</strong> paint. When Harry painted over Annie's paper,
            <strong> RED + YELLOW turned into an ORANGE monster!</strong>
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors text-sm shadow-xs cursor-pointer"
        >
          I Cracked the Color Clue! Let's Answer
        </button>
      </div>
    </div>
  );
};
