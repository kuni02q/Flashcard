export interface PublicDictionaryGroupCard {
  id: number;
  name: string;
  description: string | null;

  ownerName: string;

  sourceLanguage: string;
  targetLanguage: string;

  wordCount: number;
  viewCount: number;
  addCount: number;
}
