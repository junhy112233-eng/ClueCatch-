import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Square,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Award,
  Search,
  Lightbulb,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { StoryPage, GlossaryTerm } from '../types/story';
import { GLOSSARY } from '../data/storyData';
import { PhaseBanner } from './PhaseBanner';
import { SpeechReader, sound } from '../utils/audio';

interface StoryViewProps {
  page: StoryPage;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  onOpenNotebook: () => void;
  onOpenColorHint: () => void;
  onOpenGlossary: (term: GlossaryTerm) => void;
  hasBadge: boolean;
  canProceedToResult: boolean;
  onGoToResult: () => void;
  learnedWords: Set<string>;
  onInspectSuspect?: () => void;
}

export const StoryView: React.FC<StoryViewProps> = ({
  page,
  totalPages,
  onNextPage,
  onPrevPage,
  onOpenNotebook,
  onOpenColorHint,
  onOpenGlossary,
  hasBadge,
  canProceedToResult,
  onGoToResult,
  learnedWords,
  onInspectSuspect,
}) => {
  const [isReading, setIsReading] = useState<boolean>(false);
  const [currentWordIdx, setCurrentWordIdx] = useState<number>(-1);
  const [showClueWarning, setShowClueWarning] = useState<boolean>(false);
  const isComponentMounted = useRef<boolean>(true);

  // Check how many clues on this page have been found (only counting words that actually appear in this page's text)
  const validPageClues = page.clueWords.filter((cw) =>
    page.text.toLowerCase().includes(cw.toLowerCase())
  );
  const pageCluesTotal = validPageClues.length;
  const pageCluesFound = validPageClues.filter((cw) =>
    learnedWords.has(cw.toLowerCase())
  ).length;
  const areAllPageCluesFound = pageCluesTotal === 0 || pageCluesFound >= pageCluesTotal;

  useEffect(() => {
    isComponentMounted.current = true;
    SpeechReader.stop();
    setIsReading(false);
    setCurrentWordIdx(-1);
    setShowClueWarning(false);

    return () => {
      isComponentMounted.current = false;
      SpeechReader.stop();
    };
  }, [page.pageNumber]);

  const handleToggleReadToMe = () => {
    sound.playClick();
    if (isReading) {
      SpeechReader.stop();
      setIsReading(false);
      setCurrentWordIdx(-1);
    } else {
      setIsReading(true);
      SpeechReader.speak(
        page.text,
        (wordIdx) => {
          if (isComponentMounted.current) {
            setCurrentWordIdx(wordIdx);
          }
        },
        () => {
          if (isComponentMounted.current) {
            setIsReading(false);
            setCurrentWordIdx(-1);
          }
        }
      );
    }
  };

  const handleAttemptQuiz = () => {
    if (!areAllPageCluesFound) {
      sound.playIncorrect();
      setShowClueWarning(true);
      setTimeout(() => setShowClueWarning(false), 3800);
    } else {
      sound.playClick();
      onOpenNotebook();
    }
  };

  // Helper to render interactive text with clue highlights and "Learned word! ✓" boxes
  const renderInteractiveText = () => {
    const words = page.text.split(/(\s+)/);
    let wordCounter = 0;

    return words.map((token, idx) => {
      if (/^\s+$/.test(token)) {
        return <span key={idx}>{token}</span>;
      }

      const cleanWord = token.replace(/[.,!?:;'"“”]/g, '');
      const isClueWord = page.clueWords.some(
        (cw) => cw.toLowerCase() === cleanWord.toLowerCase()
      );
      const isLearned = learnedWords.has(cleanWord.toLowerCase());
      const isCurrentlySpoken = currentWordIdx === wordCounter;
      wordCounter++;

      if (isClueWord) {
        const glossaryEntry =
          GLOSSARY[cleanWord] ||
          GLOSSARY[cleanWord.toLowerCase()] ||
          Object.values(GLOSSARY).find(
            (g) => g.word.toLowerCase() === cleanWord.toLowerCase()
          );

        return (
          <button
            key={idx}
            onClick={() => {
              if (glossaryEntry) {
                sound.playClick();
                onOpenGlossary(glossaryEntry);
              }
            }}
            title={
              isLearned
                ? `Learned word! ✓ Tap to view definition again`
                : `Clue Word: Tap to inspect with magnifying glass!`
            }
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 mx-0.5 rounded-lg transition-all cursor-pointer ${
              isCurrentlySpoken
                ? 'ring-2 ring-amber-600 scale-105'
                : ''
            } ${
              isLearned
                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-300 font-bold shadow-2xs'
                : 'bg-yellow-200 hover:bg-yellow-300 text-stone-900 border-b-2 border-yellow-400 font-semibold hover:scale-103'
            }`}
          >
            <span>{token}</span>
            {isLearned ? (
              <span className="inline-flex items-center gap-0.5 text-[10px] bg-emerald-600 text-white font-bold px-1 rounded-sm leading-tight">
                <CheckCircle2 className="w-2.5 h-2.5" /> Learned!
              </span>
            ) : (
              <Search className="w-3 h-3 text-amber-800 opacity-80" />
            )}
          </button>
        );
      }

      return (
        <span
          key={idx}
          className={`transition-all ${
            isCurrentlySpoken
              ? 'bg-amber-200 text-amber-950 font-semibold px-0.5 rounded'
              : ''
          }`}
        >
          {token}
        </span>
      );
    });
  };

  const isFinalStoryPage = page.pageNumber === totalPages;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 md:space-y-6">
      {/* 1. Phase Chapter Banner */}
      <div className="flex items-center justify-between gap-2">
        <PhaseBanner
          phaseId={page.phaseId}
          pageNumber={page.pageNumber}
          totalPages={totalPages}
          phaseName={page.phaseName}
          phaseSuspect={page.phaseSuspect}
          phaseIcon={page.phaseIcon}
        />
        {onInspectSuspect && (
          <button
            onClick={() => {
              sound.playClick();
              onInspectSuspect();
            }}
            className="shrink-0 hidden sm:flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 shadow-2xs transition-colors cursor-pointer"
            title="Inspect suspect with magnifying glass"
          >
            <Search className="w-3.5 h-3.5 text-amber-600" />
            <span>Magnifying Glass</span>
          </button>
        )}
      </div>

      {/* Clue Warning Banner if user tries to skip finding clues first */}
      {showClueWarning && (
        <div className="p-3.5 bg-amber-100 border-2 border-amber-400 text-amber-950 rounded-2xl flex items-center gap-2.5 text-xs md:text-sm font-bold shadow-md animate-in slide-in-from-top-2 duration-200">
          <Search className="w-4 h-4 text-amber-700 shrink-0 animate-bounce" />
          <span>
            🕵️‍♂️ Nate says: <strong>Find clues first!</strong> Tap all yellow highlighted words in the text to learn them ({pageCluesFound}/{pageCluesTotal} found).
          </span>
        </div>
      )}

      {/* 2. Main Story Canvas */}
      <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8E1D5] shadow-lg overflow-hidden flex flex-col md:flex-row items-stretch">
        {/* Left: Illustration */}
        <div className="md:w-1/2 relative bg-[#F7F3EB] min-h-[260px] md:min-h-[420px] flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-[#E8E1D5]">
          <img
            src={page.image}
            alt={page.imageAlt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover max-h-[460px]"
          />

          {/* Floating Clue Badge on illustration if collected */}
          {hasBadge && (
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-full border border-amber-300 shadow-md flex items-center gap-1.5 text-xs font-bold text-amber-900 animate-in fade-in">
              <span>{page.badge.icon}</span>
              <span>Clue Badge Found</span>
            </div>
          )}

          {/* Pulsating Color Hint Button if available on this page */}
          {page.hasColorHintGadget && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenColorHint();
              }}
              className="absolute bottom-4 right-4 animate-pulse-glow bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold px-4 py-2.5 rounded-2xl shadow-lg border-2 border-amber-300 flex items-center gap-2 text-xs md:text-sm cursor-pointer transition-transform hover:scale-105"
            >
              <Lightbulb className="w-4 h-4 fill-amber-950" />
              <span>Hint Gadget: Color Logic</span>
            </button>
          )}
        </div>

        {/* Right: Story Text & Controls */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div>
            {/* Clue Progress bar on page */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-800">
                Chapter Note #{page.pageNumber}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                areAllPageCluesFound
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}>
                🔍 Clues Found: {pageCluesFound}/{pageCluesTotal}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-stone-900 mb-4 leading-tight">
              {page.title}
            </h2>

            {/* Read Text with checked learned words */}
            <div className="text-stone-800 text-lg md:text-xl leading-relaxed md:leading-loose font-normal bg-ruled-lines p-2 rounded-xl">
              {renderInteractiveText()}
            </div>
          </div>

          {/* Controls Footer */}
          <div className="pt-4 border-t border-stone-200/80 space-y-3">
            {/* Read to Me Button & Quiz Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleReadToMe}
                className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                  isReading
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                }`}
              >
                {isReading ? (
                  <>
                    <Square className="w-4 h-4 fill-white" />
                    <span>Stop Reading</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-amber-700" />
                    <span>🔊 Read to me</span>
                  </>
                )}
              </button>

              {/* Detective Notebook Quiz Button - Requirement 2: Must Find Clues First */}
              <button
                onClick={handleAttemptQuiz}
                className={`py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                  hasBadge
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                    : areAllPageCluesFound
                    ? 'bg-amber-500 hover:bg-amber-600 text-white animate-bounce'
                    : 'bg-stone-100 text-stone-600 border border-stone-300 hover:bg-amber-100/70'
                }`}
              >
                {hasBadge ? (
                  <>
                    <Award className="w-4 h-4 text-emerald-700" />
                    <span>Badge Earned ✅</span>
                  </>
                ) : areAllPageCluesFound ? (
                  <>
                    <Award className="w-4 h-4" />
                    <span>Solve Clue Quiz 🎯</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-stone-400" />
                    <span>Find Clues First ({pageCluesFound}/{pageCluesTotal})</span>
                  </>
                )}
              </button>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  sound.playPageTurn();
                  onPrevPage();
                }}
                disabled={page.pageNumber === 1}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  page.pageNumber === 1
                    ? 'text-stone-300 cursor-not-allowed'
                    : 'text-stone-700 hover:bg-stone-100 cursor-pointer'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {/* Next Page / Case Closed Button */}
              {isFinalStoryPage ? (
                <button
                  onClick={() => {
                    sound.playClick();
                    if (!canProceedToResult) {
                      handleAttemptQuiz();
                    } else {
                      onGoToResult();
                    }
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm shadow-md transition-all cursor-pointer ${
                    canProceedToResult
                      ? 'bg-amber-500 hover:bg-amber-600 text-white hover:scale-102'
                      : 'bg-stone-200 text-stone-500 hover:bg-stone-300'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{canProceedToResult ? 'Crack Case & Eat Pancakes! 🥞' : 'Collect All Badges First'}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (!areAllPageCluesFound) {
                      handleAttemptQuiz();
                    } else if (!hasBadge) {
                      handleAttemptQuiz();
                    } else {
                      sound.playPageTurn();
                      onNextPage();
                    }
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm shadow-md transition-all cursor-pointer ${
                    hasBadge
                      ? 'bg-amber-500 hover:bg-amber-600 text-white hover:scale-102'
                      : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                  }`}
                >
                  <span>Next Page</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
