import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, Sparkles, CheckCircle2, RotateCcw, Volume2, BookOpen } from 'lucide-react';
import { ClueBadge, Suspect } from '../types/story';
import { CELEBRATION_IMAGE } from '../data/storyData';
import { sound, SpeechReader } from '../utils/audio';

interface CaseClosedScreenProps {
  collectedBadges: ClueBadge[];
  suspects: Suspect[];
  onRestart: () => void;
  onReviewStory: () => void;
}

export const CaseClosedScreen: React.FC<CaseClosedScreenProps> = ({
  collectedBadges,
  suspects,
  onRestart,
  onReviewStory,
}) => {
  // Final sentence deduction builder state:
  // "___ took the picture because ___."
  const [selectedCulprit, setSelectedCulprit] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [isDeductionSolved, setIsDeductionSolved] = useState<boolean>(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  const culpritOptions = [
    { id: 'harry', label: 'Harry' },
    { id: 'rosamond', label: 'Rosamond' },
    { id: 'fang', label: 'Fang' },
  ];

  const reasonOptions = [
    {
      id: 'paint',
      label: 'he painted an orange monster over the yellow dog!',
    },
    {
      id: 'bones',
      label: 'he wanted to bury it with bones in the yard.',
    },
    {
      id: 'cats',
      label: 'she wanted to hide it with her four cats.',
    },
  ];

  const handleCheckSentence = () => {
    if (!selectedCulprit || !selectedReason) {
      setErrorFeedback('Please select both word chips to finish the detective sentence!');
      sound.playIncorrect();
      return;
    }

    if (selectedCulprit === 'Harry' && selectedReason.includes('orange monster')) {
      setIsDeductionSolved(true);
      setErrorFeedback(null);
      sound.playBadgeFanfare();
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#F59E0B', '#EF4444', '#10B981', '#6366F1', '#EC4899'],
        });
      } catch {}
    } else {
      sound.playIncorrect();
      setErrorFeedback('Not quite! Remember: Who had red paint, and why was the monster orange? Try again!');
    }
  };

  const handleReadVerdict = () => {
    sound.playClick();
    SpeechReader.speak(
      "Case Closed! Harry took the picture because he painted an orange monster over it! Let's eat pancakes!"
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="bg-[#FFFDF9] rounded-3xl border-2 border-amber-300 shadow-xl p-6 md:p-8 text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>All 9 Clue Badges Gathered (100%)</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold font-display text-stone-900 tracking-tight mb-2">
          Case Closed! Let's eat Pancake!
        </h1>
        <p className="text-stone-600 text-base md:text-lg max-w-2xl mx-auto">
          Nate the Great has gathered all evidence! Assemble the final detective statement to declare the culprit.
        </p>

        {/* Master Detective Crest */}
        <div className="mt-6 flex justify-center">
          <div className="px-5 py-2.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 rounded-2xl shadow-md border-2 border-amber-500 flex items-center gap-3 text-amber-950 font-extrabold text-sm md:text-base">
            <span className="text-2xl">🥞</span>
            <span>Master Detective Badge Awarded!</span>
            <Award className="w-5 h-5 text-amber-900" />
          </div>
        </div>
      </div>

      {/* 2. Final Sentence Chip Builder (PRD Requirement 5) */}
      <div className="bg-[#FFFDF9] rounded-3xl border-2 border-amber-200 shadow-lg p-6 md:p-8 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl md:text-2xl font-bold font-display text-stone-900 flex items-center gap-2">
              <span>🕵️‍♂️ Final Deduction: Build the Sentence</span>
            </h3>
            <button
              onClick={handleReadVerdict}
              className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" /> Read Verdict
            </button>
          </div>
          <p className="text-sm text-stone-600">
            Tap or choose the word chips to complete the final conclusion sentence:
          </p>
        </div>

        {/* Sentence Builder Box with Blanks */}
        <div className="p-6 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-300 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-base md:text-xl font-bold text-stone-800 leading-loose">
            {/* Slot 1: Culprit */}
            <span
              className={`px-4 py-2 rounded-xl transition-all border-2 text-center min-w-[120px] ${
                selectedCulprit
                  ? 'bg-amber-100 border-amber-400 text-amber-950 shadow-xs'
                  : 'bg-white border-dashed border-stone-300 text-stone-400'
              }`}
            >
              {selectedCulprit || '___ (Who?)'}
            </span>

            <span className="text-stone-700">took the picture because</span>

            {/* Slot 2: Reason */}
            <span
              className={`px-4 py-2 rounded-xl transition-all border-2 text-center min-w-[200px] ${
                selectedReason
                  ? 'bg-orange-100 border-orange-400 text-orange-950 shadow-xs'
                  : 'bg-white border-dashed border-stone-300 text-stone-400'
              }`}
            >
              {selectedReason || '___ (Why?)'}
            </span>
            <span>.</span>
          </div>

          {/* Error / Encouragement Feedback */}
          {errorFeedback && (
            <p className="text-xs text-rose-600 font-semibold animate-in fade-in">
              {errorFeedback}
            </p>
          )}

          {isDeductionSolved && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-emerald-900 text-sm font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>
                100% Correct Deduction! Harry needed yellow paper to turn his red paint into an orange monster!
              </span>
            </div>
          )}
        </div>

        {/* Word Chips Selector */}
        {!isDeductionSolved ? (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
                1. Choose the Culprit:
              </span>
              <div className="flex flex-wrap gap-2">
                {culpritOptions.map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedCulprit(chip.label);
                    }}
                    className={`px-4 py-2 rounded-xl font-bold text-sm border transition-all cursor-pointer ${
                      selectedCulprit === chip.label
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs scale-105'
                        : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
                2. Choose the Reason:
              </span>
              <div className="flex flex-wrap gap-2">
                {reasonOptions.map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedReason(chip.label);
                    }}
                    className={`px-4 py-2 rounded-xl font-bold text-xs md:text-sm border transition-all cursor-pointer ${
                      selectedReason === chip.label
                        ? 'bg-orange-500 text-white border-orange-600 shadow-xs scale-102'
                        : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCheckSentence}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-base rounded-2xl shadow-md transition-all cursor-pointer"
            >
              Verify Detective Sentence!
            </button>
          </div>
        ) : (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
            <span className="text-sm font-bold text-emerald-900">
              The case is solved! Let's celebrate with hot pancakes!
            </span>
            <button
              onClick={() => {
                sound.playClick();
                setSelectedCulprit(null);
                setSelectedReason(null);
                setIsDeductionSolved(false);
              }}
              className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Sentence
            </button>
          </div>
        )}
      </div>

      {/* 3. Celebratory Pancake Illustration */}
      <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8E1D5] shadow-lg overflow-hidden flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 h-64 md:h-80 w-full overflow-hidden bg-stone-100">
          <img
            src={CELEBRATION_IMAGE}
            alt="Nate the Great, Annie, and Harry eating pancakes celebrating solved case"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:w-1/2 p-6 md:p-8 space-y-4">
          <div className="text-xs uppercase font-bold tracking-wider text-amber-800">
            Mystery Solved
          </div>
          <h3 className="text-2xl font-bold font-display text-stone-900">
            A Stack of Golden Pancakes for Nate!
          </h3>
          <p className="text-stone-700 text-sm md:text-base leading-relaxed">
            Annie was thrilled to find her picture, even though it now had an orange monster on top!
            Nate the Great solved the case with keen eyes, careful notes, and color-mixing logic.
          </p>
          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onReviewStory();
              }}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs md:text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" /> Review Story
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onRestart();
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs md:text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Start New Case
            </button>
          </div>
        </div>
      </div>

      {/* 4. Display of All 9 Collected Clue Badges */}
      <div className="bg-[#FFFDF9] rounded-3xl border border-stone-200 shadow-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg md:text-xl font-bold font-display text-stone-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <span>Complete Badge Collection (9 of 9)</span>
          </h3>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
            100% Case Evidence
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {collectedBadges.map((badge) => (
            <div
              key={badge.id}
              className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200 flex items-start gap-3"
            >
              <span className="text-2xl p-2 bg-white rounded-xl shadow-xs border border-amber-200 shrink-0">
                {badge.icon}
              </span>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold text-amber-800">
                  Page {badge.pageNumber} Clue
                </div>
                <div className="font-bold text-sm text-stone-900 truncate">{badge.title}</div>
                <div className="text-xs text-stone-600 line-clamp-2">{badge.clueDiscovery}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
