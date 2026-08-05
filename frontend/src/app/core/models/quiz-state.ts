import {QuizQuestion} from './quiz-question';

export interface QuizState {

  questions: QuizQuestion[];

  currentIndex: number;

  correctAnswers: number;

  wrongAnswers: number;

  answered: boolean;

  answerCorrect: boolean;

  finished: boolean;

}
