import React from 'react';
import { Award, Lock, CheckCircle2, X, Users, Sparkles } from 'lucide-react';
import { ClueBadge, Suspect } from '../types/story';
import { sound } from '../utils/audio';

interface BadgeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  allBadges: ClueBadge[];
  collectedBadges: ClueBadge[];
  suspects: Suspect[];
  onSelectPage: (pageNumber: number) => void;
}

export const BadgeDrawer: React.FC<BadgeDrawerProps> = ({
  isOpen,
  onClose,
  allBadges,
  collectedBadges,
  suspects,
  onSelectPage,
}) => {
  if (!isOpen) return null;

  const collectedIds = new Set(collectedBadges.map((b) => b.id));
  const progressPercent = Math.round((collectedBadges.length / allBadges.length) * 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] bg-[#FFFDF9] rounded-3xl border-2 border-amber-300 shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 md:p-6 bg-amber-50/80 border-b border-amber-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-200/90 flex items-center justify-center text-amber-950 shadow-xs">
              <Award className="w-6 h-6 text-amber-800" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Nate's Evidence Case
              </div>
              <h3 className="text-xl md:text-2xl font-bold font-display text-stone-900">
                Detective Badges & Suspects
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
            aria-label="Close Evidence Case"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-6">
          {/* Progress bar */}
          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Badge Collection Progress
              </span>
              <span className="font-mono text-amber-800 font-extrabold text-sm">
                {collectedBadges.length} / {allBadges.length} ({progressPercent}%)
              </span>
            </div>
            <div className="h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-stone-500 mt-2">
              All 9 badges must be collected to unlock the final <strong>Case Closed Result Screen</strong>!
            </p>
          </div>

          {/* Suspect Status Board */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-stone-600" />
              Suspect Status Board
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {suspects.map((suspect) => {
                const isCleared = suspect.cleared;
                return (
                  <div
                    key={suspect.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isCleared
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-stone-50 border-stone-200 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{suspect.avatar}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                          isCleared
                            ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                            : 'bg-amber-100 border-amber-300 text-amber-800'
                        }`}
                      >
                        {isCleared ? 'Cleared' : 'Investigating'}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-stone-900">{suspect.name}</div>
                    <div className="text-xs text-stone-500 mb-1">{suspect.role}</div>
                    {isCleared && suspect.clearedNote && (
                      <div className="text-[11px] text-emerald-700 italic border-t border-emerald-200/60 pt-1 mt-1">
                        {suspect.clearedNote}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* All 9 Badges Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-stone-600" />
              Clue Badges (Pages 1 to 9)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {allBadges.map((badge) => {
                const isUnlocked = collectedIds.has(badge.id);

                return (
                  <button
                    key={badge.id}
                    onClick={() => {
                      sound.playClick();
                      onSelectPage(badge.pageNumber);
                      onClose();
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isUnlocked
                        ? 'bg-[#FFFDF6] border-amber-300 hover:border-amber-400 shadow-xs'
                        : 'bg-stone-50/70 border-stone-200 opacity-60 hover:opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl p-1.5 rounded-xl bg-white border border-stone-200">
                        {isUnlocked ? badge.icon : '🔒'}
                      </span>
                      <span className="text-[11px] font-bold text-stone-400">
                        Page {badge.pageNumber}
                      </span>
                    </div>

                    <div className="font-bold text-sm text-stone-900 truncate">
                      {isUnlocked ? badge.title : 'Locked Clue'}
                    </div>

                    <div className="text-xs text-stone-600 line-clamp-2 mt-1">
                      {isUnlocked ? badge.description : 'Read story page & answer question to earn!'}
                    </div>

                    {isUnlocked && (
                      <div className="mt-2 text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Clue Collected
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs md:text-sm transition-colors cursor-pointer"
          >
            Back to Investigation
          </button>
        </div>
      </div>
    </div>
  );
};
