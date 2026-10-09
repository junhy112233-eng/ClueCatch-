import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, RotateCcw, X, Lightbulb, Lock, Sparkles } from 'lucide-react';
import { StoryPage, ClueBadge } from '../types/story';
import { sound } from '../utils/audio';

interface NotebookModalProps {
  page: StoryPage;
  isOpen: boolean;
  onClose: () => void;
  onBadgeCollected: (badge: ClueBadge) => void;
  onAcceptAndContinue: () => void;
  isBadgeAlreadyCollected: boolean;
  onOpenColorHint?: () => void;
}

export const NotebookModal: React.FC<NotebookModalProps> = ({
  page,
  isOpen,
  onClose,
  onBadgeCollected,
  onAcceptAndContinue,
  isBadgeAlreadyCollected,
  onOpenColorHint,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showReward, setShowReward] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedOption(null);
      setHasSubmitted(false);
      setIsCorrect(isBadgeAlreadyCollected);
      setShowReward(false);
    }
  }, [isOpen, page.pageNumber, isBadgeAlreadyCollected]);

  // Requirement 1: When Badge is Earned, automatically close tab and advance after 1.4s!
  useEffect(() => {
    if (showReward) {
      const timer = setTimeout(() => {
        onBadgeCollected(page.badge);
        onAcceptAndContinue();
      }, 1400);

      return () => clearTimeout(timer);
    }
  }, [showReward, page.badge, onBadgeCollected, onAcceptAndContinue]);

  if (!isOpen) return null;

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setHasSubmitted(true);

    if (selectedOption === page.question.correctIndex) {
      setIsCorrect(true);
      setShowReward(true);
      sound.playBadgeFanfare();

      // Confetti burst for badge reward
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.55 },
          colors: ['#F59E0B', '#EF4444', '#10B981', '#3B82F6'],
        });
      } catch {}

      onBadgeCollected(page.badge);
    } else {
      setIsCorrect(false);
      setShowReward(false);
      sound.playIncorrect();
    }
  };

  const handleRetry = () => {
    sound.playClick();
    setSelectedOption(null);
    setHasSubmitted(false);
  };

  const handleImmediateCloseReward = () => {
    sound.playClick();
    onBadgeCollected(page.badge);
    onAcceptAndContinue();
  };

  // Requirement 1: Only "Badge Earned!" appears when solved, then closes automatically!
  if (showReward) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 cursor-pointer"
        onClick={handleImmediateCloseReward}
      >
        <div
          className="w-full max-w-sm bg-[#FFFDF8] rounded-3xl border-3 border-amber-300 shadow-2xl overflow-hidden p-8 text-center relative animate-in zoom-in-95 duration-200"
          onClick={(e) => {
            e.stopPropagation();
            handleImmediateCloseReward();
          }}
        >
          {/* Badge Icon Animation */}
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-300 to-amber-500 border-4 border-amber-400 shadow-xl flex items-center justify-center text-5xl animate-bounce">
            {page.badge.icon}
          </div>

          <div className="mt-5 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Badge Earned!</span>
            </div>

            <h3 className="text-2xl font-black font-display text-stone-900">
              {page.badge.title}
            </h3>

            <p className="text-sm text-stone-600 max-w-xs mx-auto font-medium">
              {page.badge.clueDiscovery}
            </p>
          </div>

          {/* Automatic Transition Indicator */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 py-2.5 px-4 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Advancing to next page...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#FFFDF8] rounded-3xl border-3 border-amber-300 shadow-2xl overflow-hidden p-6 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          aria-label="Close detective notebook"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Notebook Spiral Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 shadow-xs">
            <Award className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-amber-800">
              Detective Notebook · Page {page.pageNumber}
            </div>
            <h3 className="text-xl md:text-2xl font-bold font-display text-stone-900">
              Clue Investigation Quiz
            </h3>
          </div>
        </div>

        {/* Mystery Clue Badge Card */}
        <div className="p-3.5 bg-stone-100/90 rounded-2xl border border-dashed border-stone-300 flex items-center gap-3 mb-5">
          <div className="w-12 h-12 bg-white rounded-xl shadow-xs border border-stone-200 flex items-center justify-center text-stone-400">
            <Lock className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wide flex items-center gap-1">
              <span>Mystery Clue Badge</span>
            </div>
            <div className="font-bold text-stone-800">Locked Evidence #0{page.pageNumber}</div>
            <div className="text-xs text-stone-500">
              Solve the question below correctly to earn and reveal this badge!
            </div>
          </div>
        </div>

        {/* The Question */}
        <div className="mb-5">
          <h4 className="text-base md:text-lg font-bold text-stone-900 mb-3">
            {page.question.question}
          </h4>

          {/* Answer Options */}
          <div className="space-y-2.5">
            {page.question.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              let btnClass = 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100';

              if (isSelected && !hasSubmitted) {
                btnClass = 'bg-amber-100 border-amber-400 text-amber-950 font-semibold shadow-xs';
              } else if (hasSubmitted) {
                if (idx === page.question.correctIndex) {
                  btnClass = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                } else if (isSelected && !isCorrect) {
                  btnClass = 'bg-rose-100 border-rose-300 text-rose-900 opacity-90 line-through';
                } else {
                  btnClass = 'bg-stone-50 border-stone-200 text-stone-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (hasSubmitted && isCorrect) return;
                    sound.playClick();
                    setSelectedOption(idx);
                  }}
                  disabled={hasSubmitted && isCorrect}
                  className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-center gap-3 text-sm md:text-base cursor-pointer ${btnClass}`}
                >
                  <span className="w-6 h-6 rounded-full bg-white/80 border border-stone-300 flex items-center justify-center text-xs font-bold shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{option}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Messages */}
        {hasSubmitted && !isCorrect && (
          <div className="mb-5 animate-in fade-in duration-200">
            <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-300 text-rose-900 space-y-2">
              <div className="font-bold text-sm flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-rose-600" /> Not quite right! Try again to earn the badge.
              </div>
              <p className="text-xs text-rose-800 font-medium">
                💡 Hint: {page.question.hint}
              </p>
              {page.hasColorHintGadget && onOpenColorHint && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenColorHint();
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg border border-amber-300 transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5" /> Need help? Open Color Hint Gadget
                </button>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!hasSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm md:text-base transition-all shadow-xs cursor-pointer ${
                selectedOption !== null
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              Check Answer & Reveal Badge
            </button>
          ) : (
            <button
              onClick={handleRetry}
              className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Try Again (Mandatory for Clue Badge)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
