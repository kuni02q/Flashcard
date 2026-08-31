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

  createdAt: string;

  lastUsedAt: string | null;

  quizSettings: QuizSettings;

}
