import React from 'react';
import { PhaseId } from '../types/story';

interface PhaseBannerProps {
  phaseId: PhaseId;
  pageNumber: number;
  totalPages: number;
  phaseName: string;
  phaseSuspect: string;
  phaseIcon: string;
}

export const PhaseBanner: React.FC<PhaseBannerProps> = ({
  phaseId,
  pageNumber,
  totalPages,
  phaseSuspect,
  phaseIcon,
}) => {
  // Subtly varied theme accents per suspect phase
  const phaseStyles = {
    1: {
      bg: 'bg-amber-50/90 border-amber-200 text-amber-900',
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
      label: 'Phase 1: The Backyard Dog',
      accent: 'text-amber-700',
    },
    2: {
      bg: 'bg-indigo-50/90 border-indigo-200 text-indigo-900',
      badge: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      label: 'Phase 2: The Cat Collector',
      accent: 'text-indigo-700',
    },
    3: {
      bg: 'bg-orange-50/90 border-orange-200 text-orange-900',
      badge: 'bg-orange-100 text-orange-900 border-orange-300',
      label: 'Phase 3: The Little Painter',
      accent: 'text-orange-700',
    },
  }[phaseId];

  return (
    <div className={`w-full py-2.5 px-4 rounded-xl border ${phaseStyles.bg} transition-colors duration-500 shadow-xs`}>
      <div className="flex items-center justify-between gap-3">
        {/* Left: Phase Title & Stage */}
        <div className="flex items-center gap-2">
          <span className="text-xl" role="img" aria-label="suspect icon">
            {phaseIcon}
          </span>
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold opacity-75">
              {phaseStyles.label}
            </div>
            <div className="text-sm font-bold font-display leading-tight">
              Suspect: {phaseSuspect}
            </div>
          </div>
        </div>

        {/* Right: Page Counter */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="opacity-75">Case File:</span>
          <span className={`px-2 py-0.5 rounded-full border ${phaseStyles.badge}`}>
            Page {pageNumber} of {totalPages}
          </span>
        </div>
      </div>
    </div>
  );
};
