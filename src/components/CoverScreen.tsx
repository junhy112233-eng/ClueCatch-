import React from 'react';
import { Sparkles, BookOpen, Award, ArrowRight } from 'lucide-react';
import { COVER_IMAGE } from '../data/storyData';
import { sound } from '../utils/audio';

interface CoverScreenProps {
  onStartInvestigation: () => void;
}

export const CoverScreen: React.FC<CoverScreenProps> = ({ onStartInvestigation }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Hero Book Cover Card */}
      <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#E8E1D5] shadow-xl overflow-hidden flex flex-col md:flex-row items-stretch">
        {/* Cover Artwork */}
        <div className="md:w-1/2 relative bg-[#F7F3EB] min-h-[320px] md:min-h-[460px] flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-[#E8E1D5]">
          <img
            src={COVER_IMAGE}
            alt="Nate the Great Detective"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-amber-900 border border-amber-300 shadow-xs flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Interactive Detective Reader</span>
          </div>
        </div>

        {/* Story Intro & Start Action */}
        <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold font-display text-stone-900 tracking-tight leading-tight">
              Nate the Great
            </h1>

            {/* Concise Prompt Description */}
            <p className="text-stone-700 text-base md:text-lg leading-relaxed font-medium">
              Where is Annie's picture of her dog Fang?? Help Nate inspect 3 suspects, collect all clue badges, and solve the mystery?
            </p>

            {/* Suspect Emojis Only (No Phase 1, 2, 3 text) */}
            <div className="flex items-center gap-4 py-2 text-stone-600 text-sm font-semibold">
              <span className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-amber-900">
                <span className="text-xl">🐶</span> Fang
              </span>
              <span className="flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200 text-indigo-900">
                <span className="text-xl">🐈</span> Rosamond
              </span>
              <span className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200 text-orange-900">
                <span className="text-xl">🖌️</span> Harry
              </span>
            </div>
          </div>

          {/* Start CTA */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
              <Award className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Collect all 9 clue badges to solve the case!</span>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                sound.playPageTurn();
                onStartInvestigation();
              }}
              className="w-full py-4 px-6 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-base md:text-lg rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer hover:scale-102 active:scale-98"
            >
              <BookOpen className="w-5 h-5" />
              <span>Start Investigation ▶</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
