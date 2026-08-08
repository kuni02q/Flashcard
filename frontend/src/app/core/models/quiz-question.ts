import { WordPair } from './word-pair';

export interface QuizQuestion {
  word: WordPair;

  question: string;

  correctAnswer: string;
}
