import { WordPair } from './word-pair';

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

  quizMode: 'ONCE' | 'UNTIL_CORRECT';

  quizWordCount: number;

}
