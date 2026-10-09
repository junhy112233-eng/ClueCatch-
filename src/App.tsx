import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { CoverScreen } from './components/CoverScreen';
import { StoryView } from './components/StoryView';
import { GlossaryModal } from './components/GlossaryModal';
import { NotebookModal } from './components/NotebookModal';
import { ColorHintGadget } from './components/ColorHintGadget';
import { BadgeDrawer } from './components/BadgeDrawer';
import { CaseClosedScreen } from './components/CaseClosedScreen';
import { PhaseIntroSlide } from './components/PhaseIntroSlide';
import { STORY_PAGES, SUSPECTS, PHASE_INTROS } from './data/storyData';
import { ClueBadge, GlossaryTerm, Suspect, PhaseId } from './types/story';
import { sound, SpeechReader } from './utils/audio';

export default function App() {
  const [currentView, setCurrentView] = useState<'cover' | 'story' | 'result'>('cover');
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [activePhaseIntro, setActivePhaseIntro] = useState<PhaseId | null>(null);

  // Set of learned words for checkmarks and quiz unlocks
  const [learnedWords, setLearnedWords] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('cluecatch_learned_words');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [collectedBadges, setCollectedBadges] = useState<ClueBadge[]>(() => {
    try {
      const saved = localStorage.getItem('cluecatch_badges');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [suspects, setSuspects] = useState<Suspect[]>(SUSPECTS);
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState<GlossaryTerm | null>(null);
  const [isNotebookOpen, setIsNotebookOpen] = useState<boolean>(false);
  const [isColorHintOpen, setIsColorHintOpen] = useState<boolean>(false);
  const [isBadgeDrawerOpen, setIsBadgeDrawerOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Sync collected badges to localStorage and update suspects status
  useEffect(() => {
    try {
      localStorage.setItem('cluecatch_badges', JSON.stringify(collectedBadges));
    } catch {}

    const hasBadge3 = collectedBadges.some((b) => b.id === 'badge-3');
    const hasBadge6 = collectedBadges.some((b) => b.id === 'badge-6');

    setSuspects((prev) =>
      prev.map((s) => {
        if (s.id === 'fang') return { ...s, cleared: hasBadge3 };
        if (s.id === 'rosamond') return { ...s, cleared: hasBadge6 };
        if (s.id === 'harry') return { ...s, cleared: false }; // Harry is the culprit
        return s;
      })
    );
  }, [collectedBadges]);

  const currentPage = STORY_PAGES[currentPageIndex] || STORY_PAGES[0];
  const allBadges = STORY_PAGES.map((p) => p.badge);
  const isCurrentPageBadgeCollected = collectedBadges.some(
    (b) => b.id === currentPage.badge.id
  );
  const canProceedToResult = collectedBadges.length === allBadges.length;

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setSoundEnabled(next);
  };

  const handleMarkWordLearned = (word: string) => {
    setLearnedWords((prev) => {
      const updated = new Set(prev);
      updated.add(word.toLowerCase());
      try {
        localStorage.setItem(
          'cluecatch_learned_words',
          JSON.stringify(Array.from(updated))
        );
      } catch {}
      return updated;
    });
  };

  const handleBadgeCollected = useCallback((badge: ClueBadge) => {
    setCollectedBadges((prev) => {
      if (prev.some((b) => b.id === badge.id)) return prev;
      return [...prev, badge];
    });
  }, []);

  // When learner earns/accepts badge, close modal and advance
  const handleAcceptBadgeAndContinue = useCallback(() => {
    setIsNotebookOpen(false);

    setCurrentPageIndex((prevIndex) => {
      if (prevIndex === STORY_PAGES.length - 1) {
        sound.playBadgeFanfare();
        setCurrentView('result');
        return prevIndex;
      }

      const nextIndex = prevIndex + 1;
      if (nextIndex === 3) {
        setActivePhaseIntro(2);
      } else if (nextIndex === 6) {
        setActivePhaseIntro(3);
      }
      return nextIndex;
    });
  }, []);

  const handleNextPage = () => {
    if (currentPageIndex < STORY_PAGES.length - 1) {
      const nextIndex = currentPageIndex + 1;
      setCurrentPageIndex(nextIndex);

      // Check phase transitions
      if (nextIndex === 3) {
        setActivePhaseIntro(2);
      } else if (nextIndex === 6) {
        setActivePhaseIntro(3);
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const handleSelectPage = (pageNumber: number) => {
    const idx = pageNumber - 1;
    if (idx >= 0 && idx < STORY_PAGES.length) {
      setCurrentPageIndex(idx);
      setActivePhaseIntro(null);
      setCurrentView('story');
    }
  };

  const handleStartInvestigation = () => {
    // Requirement 4: Start Phase 1 with Fang magnifying glass slide!
    setCurrentPageIndex(0);
    setActivePhaseIntro(1);
    setCurrentView('story');
  };

  const handleRestart = () => {
    SpeechReader.stop();
    setCollectedBadges([]);
    setLearnedWords(new Set());
    try {
      localStorage.removeItem('cluecatch_badges');
      localStorage.removeItem('cluecatch_learned_words');
    } catch {}
    setCurrentPageIndex(0);
    setActivePhaseIntro(null);
    setCurrentView('cover');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C241E] flex flex-col font-sans">
      {/* 1. Header (Compliant with Top Bar contract) */}
      <Header
        currentView={currentView}
        collectedBadgeCount={collectedBadges.length}
        totalBadges={allBadges.length}
        onOpenNotebook={() => setIsBadgeDrawerOpen(true)}
        onOpenSuspects={() => setIsBadgeDrawerOpen(true)}
        onReturnToStory={() => {
          setActivePhaseIntro(null);
          setCurrentView('story');
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        currentPhaseId={currentPage.phaseId}
      />

      {/* 2. Main Content Canvas */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col justify-center">
        {currentView === 'cover' && (
          <CoverScreen onStartInvestigation={handleStartInvestigation} />
        )}

        {currentView === 'story' && activePhaseIntro !== null && (
          <PhaseIntroSlide
            introData={PHASE_INTROS[activePhaseIntro]}
            onProceedToStory={() => setActivePhaseIntro(null)}
          />
        )}

        {currentView === 'story' && activePhaseIntro === null && (
          <StoryView
            page={currentPage}
            totalPages={STORY_PAGES.length}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            onOpenNotebook={() => setIsNotebookOpen(true)}
            onOpenColorHint={() => setIsColorHintOpen(true)}
            onOpenGlossary={(term) => setSelectedGlossaryTerm(term)}
            hasBadge={isCurrentPageBadgeCollected}
            canProceedToResult={canProceedToResult}
            onGoToResult={() => setCurrentView('result')}
            learnedWords={learnedWords}
            onInspectSuspect={() => setActivePhaseIntro(currentPage.phaseId)}
          />
        )}

        {currentView === 'result' && (
          <CaseClosedScreen
            collectedBadges={collectedBadges}
            suspects={suspects}
            onRestart={handleRestart}
            onReviewStory={() => {
              setCurrentPageIndex(0);
              setActivePhaseIntro(null);
              setCurrentView('story');
            }}
          />
        )}
      </main>

      {/* 3. Footer (Anti-slop, clean and editorial) */}
      <footer className="py-4 px-6 border-t border-[#E8E1D5] bg-[#F5EFE6]/60 text-center text-xs text-stone-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ClueCatch! · Adapted from "Nate the Great" for Grades 3–4 English Reading</span>
          <span className="font-mono text-stone-400">CEFR Pre-A1 · 3 Suspect Phases</span>
        </div>
      </footer>

      {/* 4. Modals & Interactive Overlays */}
      {/* Glossary Magnifying Glass Modal with Learned Word! button (Req 1) */}
      <GlossaryModal
        term={selectedGlossaryTerm}
        onClose={() => setSelectedGlossaryTerm(null)}
        onMarkLearned={handleMarkWordLearned}
        isAlreadyLearned={
          selectedGlossaryTerm
            ? learnedWords.has(selectedGlossaryTerm.word.toLowerCase())
            : false
        }
      />

      {/* Page Clue Notebook Quiz Modal (Req 2, 3 & 5) */}
      <NotebookModal
        page={currentPage}
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
        onBadgeCollected={handleBadgeCollected}
        onAcceptAndContinue={handleAcceptBadgeAndContinue}
        isBadgeAlreadyCollected={isCurrentPageBadgeCollected}
        onOpenColorHint={() => {
          setIsNotebookOpen(false);
          setIsColorHintOpen(true);
        }}
      />

      {/* Color Logic Hint Gadget */}
      <ColorHintGadget
        isOpen={isColorHintOpen}
        onClose={() => setIsColorHintOpen(false)}
      />

      {/* Evidence & Suspects Drawer */}
      <BadgeDrawer
        isOpen={isBadgeDrawerOpen}
        onClose={() => setIsBadgeDrawerOpen(false)}
        allBadges={allBadges}
        collectedBadges={collectedBadges}
        suspects={suspects}
        onSelectPage={handleSelectPage}
      />
    </div>
  );
}
