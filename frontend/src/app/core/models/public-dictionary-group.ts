import { WordPair } from './word-pair';

export interface PublicDictionaryGroup {
  id: number;
  name: string;
  description: string | null;

  ownerName: string;

  sourceLanguage: string;
  targetLanguage: string;

  words: WordPair[];

  wordCount: number;
  viewCount: number;
  addCount: number;
}
