export interface WordPair {
  id: number;

  sourceWord: string;

  targetWord: string;

  exampleSentence: string | null;

  learned: boolean;

  quizCount: number;

  correctCount: number;
}
