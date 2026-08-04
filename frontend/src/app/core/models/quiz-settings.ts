export interface QuizSettings {

  mode: 'ONCE' | 'UNTIL_CORRECT';

  wordCount: number;

  direction: 'SOURCE_TO_TARGET' | 'TARGET_TO_SOURCE';

}
