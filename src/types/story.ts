export type PhaseId = 1 | 2 | 3;

export interface SuspectClueSpot {
  id: string;
  label: string;
  detail: string;
  icon: string;
  xPercent: number; // For position on the suspect illustration
  yPercent: number;
}

export interface PhaseIntroData {
  phaseId: PhaseId;
  suspectName: string;
  suspectRole: string;
  chapterTitle: string;
  image: string;
  imageAlt: string;
  leadQuote: string;
  clueSpots: SuspectClueSpot[];
}

export interface Suspect {
  id: string;
  name: string;
  role: string;
  avatar: string;
  cleared: boolean;
  clearedNote?: string;
}

export interface GlossaryTerm {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  sampleSentence: string;
  emojiIcon: string;
}

export interface ClueQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
}

export interface ClueBadge {
  id: string;
  pageNumber: number;
  title: string;
  icon: string;
  description: string;
  phaseId: PhaseId;
  clueDiscovery: string;
}

export interface StoryPage {
  pageNumber: number;
  phaseId: PhaseId;
  phaseName: string;
  phaseSuspect: string;
  phaseIcon: string;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  clueWords: string[];
  question: ClueQuestion;
  badge: ClueBadge;
  hasColorHintGadget?: boolean;
}
