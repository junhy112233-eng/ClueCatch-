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
  pageNumber,
  totalPages,
  phaseSuspect,
  phaseIcon,
}) => {
  return (
    <div className="w-full py-2.5 px-4 rounded-2xl border border-[#E8E1D5] bg-white/90 shadow-2xs">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Suspect Emoji & Name Only (No Phase 1,2,3 text) */}
        <div className="flex items-center gap-2.5">
          <span className="text-2xl" role="img" aria-label="suspect icon">
            {phaseIcon}
          </span>
          <span className="text-sm md:text-base font-bold font-display text-stone-900">
            {phaseSuspect}
          </span>
        </div>

        {/* Right: Page Counter */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
          <span>Page {pageNumber} of {totalPages}</span>
        </div>
      </div>
    </div>
  );
};
