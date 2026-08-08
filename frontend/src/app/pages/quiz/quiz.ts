import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizQuestion } from '../../core/models/quiz-question';
import { DictionaryGroup } from '../../core/models/dictionary-group';
import { QuizSettings } from '../../core/models/quiz-settings';
import { ActivatedRoute, Router } from '@angular/router';
import { DictionaryGroupService } from '../../core/services/dictionary-group.service';
import { WordPair } from '../../core/models/word-pair';
import { WordPairService } from '../../core/services/word-pair.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz implements OnInit {
  group: DictionaryGroup | null = null;
  settings: QuizSettings | null = null;
  questions: QuizQuestion[] = [];
  currentIndex = 0;
  totalQuestions = 0;
  completedQuestions = 0;
  answer = '';
  answered = false;
  answerCorrect = false;
  correctAnswers = 0;
  wrongAnswers = 0;
  finished = false;
  loading = true;

  @ViewChild('answerInput')
  answerInput?: ElementRef<HTMLInputElement>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupService: DictionaryGroupService,
    private wordPairService: WordPairService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.router.navigate(['/']);
      return;
    }

    this.loadQuiz(id);
  }

  loadQuiz(id: number) {
    this.groupService.getById(id).subscribe({
      next: (group) => {
        this.group = group;
        this.settings = group.quizSettings;
        this.startQuiz();
        this.loading = false;
        this.cdr.markForCheck();

        this.focusAnswerInput();
      },

      error: (error) => {
        console.error('Quiz betöltése sikertelen:', error);

        this.router.navigate(['/']);
      },
    });
  }

  startQuiz() {
    if (!this.group || !this.settings) {
      return;
    }

    let words = [...this.group.words];

    words = this.shuffle(words);

    words = words.slice(0, Math.min(this.settings.wordCount, words.length));

    this.questions = words.map((word) => this.createQuestion(word));

    this.totalQuestions = this.questions.length;

    this.currentIndex = 0;
    this.completedQuestions = 0;

    this.answer = '';
    this.answered = false;
    this.answerCorrect = false;

    this.correctAnswers = 0;
    this.wrongAnswers = 0;

    this.finished = this.questions.length === 0;
  }

  createQuestion(word: WordPair): QuizQuestion {
    if (this.settings!.direction === 'SOURCE_TO_TARGET') {
      return {
        word,
        question: word.sourceWord,
        correctAnswer: word.targetWord,
      };
    }

    return {
      word,
      question: word.targetWord,
      correctAnswer: word.sourceWord,
    };
  }

  get currentQuestion(): QuizQuestion | null {
    if (this.currentIndex < 0 || this.currentIndex >= this.questions.length) {
      return null;
    }

    return this.questions[this.currentIndex];
  }

  get currentQuestionNumber(): number {
    return this.completedQuestions;
  }

  get progress(): number {
    if (this.totalQuestions === 0) {
      return 0;
    }

    return Math.round((this.completedQuestions / this.totalQuestions) * 100);
  }

  submitAnswer() {
    if (!this.currentQuestion || this.answered) {
      return;
    }

    const userAnswer = this.normalize(this.answer);

    const correctAnswer = this.normalize(this.currentQuestion.correctAnswer);

    this.answerCorrect = userAnswer === correctAnswer;

    this.answered = true;

    if (this.answerCorrect) {
      this.correctAnswers++;
    } else {
      this.wrongAnswers++;
    }

    this.wordPairService
      .registerQuizAnswer(this.currentQuestion.word.id, this.answerCorrect)
      .subscribe({
        error: (error) => {
          console.error('Quiz válasz mentése sikertelen:', error);
        },
      });
  }

  nextQuestion() {
    if (!this.answered) {
      return;
    }

    if (!this.answerCorrect && this.settings?.mode === 'UNTIL_CORRECT') {
      const failedQuestion = this.questions[this.currentIndex];
      const minIndex = this.currentIndex + 1;
      const maxIndex = this.questions.length;

      const randomIndex = Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex;

      this.questions.splice(randomIndex, 0, failedQuestion);
    }

    if (this.answerCorrect) {
      this.completedQuestions++;
    }

    this.currentIndex++;
    this.answer = '';
    this.answered = false;
    this.answerCorrect = false;

    if (this.currentIndex >= this.questions.length) {
      this.completeQuiz();
    } else {
      this.focusAnswerInput();
    }
  }

  normalize(value: string): string {
    return value.trim().toLocaleLowerCase();
  }

  shuffle<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  finishQuiz() {
    this.router.navigate(['/groups', this.group?.id]);
  }

  quitQuiz() {
    this.router.navigate(['/groups', this.group?.id]);
  }

  completeQuiz() {
    if (!this.group) {
      return;
    }

    this.groupService.completeQuiz(this.group.id).subscribe({
      next: (updatedGroup) => {
        this.group = updatedGroup;
        this.finished = true;
        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error('Quiz befejezésének mentése sikertelen:', error);

        this.finished = true;
        this.cdr.markForCheck();
      },
    });
  }

  @HostListener('document:keydown.enter', ['$event'])
  handleEnter(event: Event) {
    if (this.loading || this.finished) {
      return;
    }

    event.preventDefault();

    if (!this.answered) {
      this.submitAnswer();
    } else {
      this.nextQuestion();
    }
  }

  focusAnswerInput() {
    setTimeout(() => {
      this.answerInput?.nativeElement.focus();
    });
  }
}
