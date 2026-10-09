import React from 'react';
import { Volume2, VolumeX, BookOpen, Award, Users } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  currentView: 'cover' | 'story' | 'result';
  collectedBadgeCount: number;
  totalBadges: number;
  onOpenNotebook: () => void;
  onOpenSuspects: () => void;
  onReturnToStory: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentPhaseId: 1 | 2 | 3;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  collectedBadgeCount,
  totalBadges,
  onOpenNotebook,
  onOpenSuspects,
  onReturnToStory,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E1D5] px-4 md:px-8 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={onReturnToStory}
          className="text-left group flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span className="text-xl md:text-2xl font-bold font-display tracking-tight text-[#2C241E] group-hover:text-amber-800 transition-colors">
            ClueCatch!
          </span>
          <span className="text-xs font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300/60 hidden sm:inline-block">
            Nate the Great
          </span>
        </button>

        {/* Zone 2: Navigation Links (single line, no wrap) */}
        <nav className="flex items-center gap-2 md:gap-4 text-xs md:text-sm font-medium text-[#5C4F43]">
          {currentView !== 'cover' && (
            <>
              <button
                onClick={onReturnToStory}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-amber-100/60 hover:text-amber-900 transition-colors whitespace-nowrap shrink-0"
              >
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span className="hidden sm:inline">Story Page</span>
              </button>

              <button
                onClick={onOpenSuspects}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-amber-100/60 hover:text-amber-900 transition-colors whitespace-nowrap shrink-0"
              >
                <Users className="w-4 h-4 text-amber-700" />
                <span>Suspects</span>
              </button>

              <button
                onClick={onOpenNotebook}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100/80 hover:bg-amber-200/80 text-amber-900 border border-amber-300/70 font-semibold transition-all whitespace-nowrap shrink-0 shadow-xs"
              >
                <Award className="w-4 h-4 text-amber-800" />
                <span>Badges: {collectedBadgeCount}/{totalBadges}</span>
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: 1 Primary Action (Sound Toggle) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              onToggleSound();
              sound.playClick();
            }}
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="p-2 rounded-lg bg-[#F0EBE1] hover:bg-[#E5DEC\-D] text-[#5C4F43] hover:text-[#2C241E] transition-colors border border-[#DDD6C8]"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
