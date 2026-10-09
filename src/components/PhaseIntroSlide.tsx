import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PhaseIntroData, SuspectClueSpot } from '../types/story';
import { sound, SpeechReader } from '../utils/audio';

interface PhaseIntroSlideProps {
  introData: PhaseIntroData;
  onProceedToStory: () => void;
}

export const PhaseIntroSlide: React.FC<PhaseIntroSlideProps> = ({
  introData,
  onProceedToStory,
}) => {
  const [selectedSpot, setSelectedSpot] = useState<SuspectClueSpot | null>(
    introData.clueSpots[0] || null
  );
  const [inspectedSpotIds, setInspectedSpotIds] = useState<Set<string>>(
    new Set([introData.clueSpots[0]?.id || ''])
  );

  const handleSelectSpot = (spot: SuspectClueSpot) => {
    sound.playClick();
    setSelectedSpot(spot);
    setInspectedSpotIds((prev) => new Set([...prev, spot.id]));
  };

  const handleReadQuote = () => {
    sound.playClick();
    SpeechReader.speak(`${introData.leadQuote} ${selectedSpot ? selectedSpot.detail : ''}`);
  };

  const allInspected = inspectedSpotIds.size >= introData.clueSpots.length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-[#FFFDF8] rounded-3xl border-2 border-amber-300 shadow-md p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-2xl shadow-sm shrink-0">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                {introData.chapterTitle}
              </span>
              <span className="text-xs text-stone-500 font-medium">· Magnifying Glass Lens</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold font-display text-stone-900">
              New Suspect: {introData.suspectName}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-600 bg-amber-100/80 px-3 py-1.5 rounded-xl border border-amber-300/80">
            🔍 Inspected: {inspectedSpotIds.size}/{introData.clueSpots.length} Clues
          </span>
          <button
            onClick={handleReadQuote}
            className="text-xs font-semibold text-amber-800 bg-white hover:bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 transition-colors cursor-pointer"
          >
            🔊 Read Hint
          </button>
        </div>
      </div>

      {/* Main Interactive Magnifying Canvas */}
      <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#E8E1D5] shadow-xl overflow-hidden flex flex-col md:flex-row items-stretch">
        {/* Left: Illustration with Magnifying Glass Hotspots */}
        <div className="md:w-3/5 relative bg-[#F7F3EB] min-h-[320px] md:min-h-[440px] flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-[#E8E1D5]">
          <img
            src={introData.image}
            alt={introData.imageAlt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover max-h-[460px]"
          />

          {/* Interactive Magnifying Glass Lens Pins */}
          {introData.clueSpots.map((spot) => {
            const isSelected = selectedSpot?.id === spot.id;
            const isViewed = inspectedSpotIds.has(spot.id);

            return (
              <button
                key={spot.id}
                onClick={() => handleSelectSpot(spot)}
                style={{ left: `${spot.xPercent}%`, top: `${spot.yPercent}%` }}
                title={`Inspect ${spot.label} with magnifying glass`}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-2.5 transition-all cursor-pointer shadow-lg flex items-center justify-center ${
                  isSelected
                    ? 'scale-125 bg-amber-400 text-stone-950 ring-4 ring-amber-300/80 z-20 shadow-amber-300'
                    : isViewed
                    ? 'scale-100 bg-white/95 text-emerald-800 ring-2 ring-emerald-400/80 z-10'
                    : 'scale-110 bg-amber-500 text-white animate-bounce z-10 shadow-amber-500/50'
                }`}
              >
                <Search className="w-5 h-5 stroke-[2.5]" />
              </button>
            );
          })}

          {/* Magnifying Glass Instructions Ribbon */}
          <div className="absolute bottom-3 left-3 right-3 bg-stone-900/85 backdrop-blur-xs text-white text-xs font-medium px-3.5 py-2 rounded-xl flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Tap the glowing magnifying glasses on {introData.suspectName} to inspect clues!</span>
            </span>
          </div>
        </div>

        {/* Right: Magnifying Glass Inspector Note & Proceed Action */}
        <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
              <span className="text-[11px] uppercase font-bold text-amber-800 block mb-1">
                Detective Notebook:
              </span>
              <p className="text-stone-700 text-sm italic font-medium leading-relaxed">
                {introData.leadQuote}
              </p>
            </div>

            {/* Currently Inspected Clue Details */}
            {selectedSpot && (
              <div className="p-4 bg-white rounded-2xl border-2 border-amber-300 shadow-xs space-y-2 animate-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl p-1.5 bg-amber-100 rounded-xl">
                      {selectedSpot.icon}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-stone-500">
                        Under the Glass:
                      </span>
                      <h4 className="text-base font-bold text-stone-900">
                        {selectedSpot.label}
                      </h4>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-stone-700 text-sm leading-relaxed font-medium">
                  {selectedSpot.detail}
                </p>
              </div>
            )}

            {/* Clue Spot Switcher */}
            <div>
              <span className="text-xs font-bold text-stone-500 block mb-2">
                Clues to inspect:
              </span>
              <div className="flex flex-col gap-1.5">
                {introData.clueSpots.map((spot) => (
                  <button
                    key={spot.id}
                    onClick={() => handleSelectSpot(spot)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all flex items-center justify-between cursor-pointer ${
                      selectedSpot?.id === spot.id
                        ? 'bg-amber-100 text-amber-950 border border-amber-300 font-bold'
                        : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{spot.icon}</span>
                      <span>{spot.label}</span>
                    </span>
                    {inspectedSpotIds.has(spot.id) && (
                      <span className="text-[10px] text-emerald-700 font-bold">✓ Inspected</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Proceed Button */}
          <div className="pt-3 border-t border-stone-200 space-y-2">
            <button
              onClick={() => {
                sound.playPageTurn();
                onProceedToStory();
              }}
              className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm md:text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102 active:scale-98"
            >
              <span>{allInspected ? 'Read Chapter Story ▶' : 'Finish Looking & Read Story ▶'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-center text-stone-500">
              Ready to investigate {introData.suspectName} with Nate!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
