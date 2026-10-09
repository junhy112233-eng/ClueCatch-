import React from 'react';
import { Search, Sparkles, BookOpen, Award, ArrowRight } from 'lucide-react';
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
            alt="Nate the Great Detective book cover"
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
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
              <Search className="w-4 h-4 text-amber-600" />
              <span>Marjorie Weinman Sharmat's Classic Case</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold font-display text-stone-900 tracking-tight leading-tight">
              ClueCatch! <br />
              <span className="text-amber-700">Nate the Great</span>
            </h1>

            <p className="text-stone-700 text-base md:text-lg leading-relaxed font-normal">
              Meet Nate: a sharp young detective who loves warm pancakes and cold, hard facts.
              Annie's picture of her dog <strong className="text-stone-900">Fang</strong> has vanished!
              Can you help Nate inspect 3 suspects, collect all clue badges, and solve the mystery?
            </p>

            {/* 3 Suspect Mission Preview */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                <span className="text-2xl block mb-1">🐶</span>
                <span className="text-xs font-bold text-amber-900 block truncate">Phase 1</span>
                <span className="text-[11px] text-amber-700 block truncate">Fang the Dog</span>
              </div>
              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-center">
                <span className="text-2xl block mb-1">🐈</span>
                <span className="text-xs font-bold text-indigo-900 block truncate">Phase 2</span>
                <span className="text-[11px] text-indigo-700 block truncate">Rosamond's Cats</span>
              </div>
              <div className="p-3 bg-orange-50 rounded-2xl border border-orange-200 text-center">
                <span className="text-2xl block mb-1">🖌️</span>
                <span className="text-xs font-bold text-orange-900 block truncate">Phase 3</span>
                <span className="text-[11px] text-orange-700 block truncate">Little Harry</span>
              </div>
            </div>
          </div>

          {/* Start CTA */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
              <Award className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Collect 100% of the clue badges (9/9) to unlock Case Closed!</span>
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
