import React from 'react';
import { Search, Volume2, X, CheckCircle2 } from 'lucide-react';
import { GlossaryTerm } from '../types/story';
import { SpeechReader, sound } from '../utils/audio';

interface GlossaryModalProps {
  term: GlossaryTerm | null;
  onClose: () => void;
  onMarkLearned: (word: string) => void;
  isAlreadyLearned: boolean;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({
  term,
  onClose,
  onMarkLearned,
  isAlreadyLearned,
}) => {
  if (!term) return null;

  const handlePronounce = () => {
    sound.playClick();
    SpeechReader.speakWord(term.word);
  };

  const handleLearnAndClose = () => {
    sound.playClick();
    onMarkLearned(term.word);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleLearnAndClose}
    >
      <div
        className="w-full max-w-md bg-[#FFFDF8] rounded-2xl border-2 border-amber-300 shadow-xl overflow-hidden p-6 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleLearnAndClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          aria-label="Close glossary popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Magnifying Glass & Emoji */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shadow-xs">
            {term.emojiIcon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 flex items-center gap-1">
                <Search className="w-3.5 h-3.5" /> Clue Word Dictionary
              </span>
              <span className="text-xs text-stone-500 italic">({term.partOfSpeech})</span>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold font-display text-[#2C241E] capitalize">
                {term.word}
              </h3>
              {isAlreadyLearned && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3" /> Learned!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Phonetic Pronunciation Bar */}
        <div className="flex items-center justify-between gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200/80 mb-4">
          <div className="text-sm font-medium text-amber-900">
            <span className="text-xs uppercase text-amber-700 font-bold mr-1.5">Sounds like:</span>
            <span className="font-mono font-semibold tracking-wide">/{term.phonetic}/</span>
          </div>
          <button
            onClick={handlePronounce}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" /> Listen
          </button>
        </div>

        {/* Kid-Friendly Definition */}
        <div className="space-y-3 mb-5">
          <div>
            <h4 className="text-xs uppercase tracking-wide font-bold text-stone-500 mb-1">
              Meaning for Detectives:
            </h4>
            <p className="text-stone-800 text-base leading-relaxed font-medium">
              {term.definition}
            </p>
          </div>

          <div className="p-3 bg-[#F8F5EE] rounded-xl border border-[#E8E2D5]">
            <h4 className="text-xs uppercase tracking-wide font-bold text-stone-500 mb-1">
              In Nate the Great:
            </h4>
            <p className="text-stone-700 text-sm italic">
              "{term.sampleSentence}"
            </p>
          </div>
        </div>

        {/* Bottom Got It button - with Learned word! checkbox as requested */}
        <button
          onClick={handleLearnAndClose}
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-xs text-sm flex items-center justify-center gap-2 cursor-pointer hover:scale-101 active:scale-99"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Learned word! ✓ (Keep Reading)</span>
        </button>
      </div>
    </div>
  );
};
