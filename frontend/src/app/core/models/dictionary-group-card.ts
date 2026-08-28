import { QuizSettings } from './quiz-settings';

export interface DictionaryGroupCard {
  id: number;

  name: string;

  description: string;

  visibility: 'PRIVATE' | 'PUBLIC';

  sourceLanguage: string;

  targetLanguage: string;

  wordCount: number;

  learnedWordCount: number;

  lastUsedAt: string | null;

  quizSettings: QuizSettings;

}
