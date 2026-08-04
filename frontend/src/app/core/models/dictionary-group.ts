import { WordPair } from './word-pair';
import {QuizSettings} from './quiz-settings';

export interface DictionaryGroup {

  id: number;

  name: string;

  description: string | null;

  visibility: 'PRIVATE' | 'PUBLIC';

  completed: boolean;

  createdAt: string;

  lastUsedAt: string | null;

  user: any;

  sourceLanguage: any;

  targetLanguage: any;

  words: WordPair[];

  quizSettings: QuizSettings;

}
