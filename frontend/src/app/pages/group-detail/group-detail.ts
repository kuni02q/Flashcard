import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import { QuizSettingsModal} from '../../components/quiz-settings-modal/quiz-settings-modal';
import {ActivatedRoute, Router} from '@angular/router';
import {DictionaryGroupService} from '../../core/services/dictionary-group.service';
import {DictionaryGroup} from '../../core/models/dictionary-group';
import {WordPairRequest, WordPairService} from '../../core/services/word-pair.service';
import {WordPair} from '../../core/models/word-pair';
import {FormsModule} from '@angular/forms';
import {QuizSettings} from '../../core/models/quiz-settings';

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, QuizSettingsModal],
  templateUrl: './group-detail.html',
  styleUrl: './group-detail.css',
})
export class GroupDetail implements OnInit {

  group: DictionaryGroup | null = null;

  showSettingsModal = false;

  quizSettings!: QuizSettings;

  editingWordId: number | null = null;

  addingWord = false;
  quickAddingWord = false;

  newSourceWord = '';

  newTargetWord = '';

  savingNewWord = false;


  @ViewChild('newSourceInput')
  newSourceInput?: ElementRef<HTMLInputElement>;


  constructor(private route: ActivatedRoute, private router: Router,
              private groupService: DictionaryGroupService, private wordPairService: WordPairService,
              private cdr: ChangeDetectorRef
  ) {}


  ngOnInit() {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );


    if (!id) {
      this.router.navigate(['/']);
      return;
    }


    this.loadGroup(id);

  }


  loadGroup(id: number) {

    this.groupService
      .getById(id)
      .subscribe({

        next: group => {

          this.group = group;
          this.quizSettings = {
            mode: group.quizSettings.mode,
            wordCount: group.quizSettings.wordCount,
            direction: group.quizSettings.direction
          };

          this.cdr.markForCheck();

        },


        error: error => {

          console.error('Csoport betöltése sikertelen:', error);

          this.router.navigate(['/']);

        }

      });

  }


  get learnedWordCount(): number {

    if (!this.group) {
      return 0;
    }

    return this.group.words.filter(word => word.learned).length;

  }



  openSettings() {

    this.showSettingsModal = true;

  }


  closeSettings() {

    this.showSettingsModal = false;

  }


  updateQuizSettings(settings: QuizSettings) {

    if (!this.group) {
      return;
    }

    this.groupService
      .updateQuizSettings(
        this.group.id,
        settings
      )
      .subscribe({

        next: updatedGroup => {

          this.group = updatedGroup;

          this.quizSettings = updatedGroup.quizSettings;

          this.cdr.markForCheck();

        },


        error: error => {
          console.error('Quiz beállítások mentése sikertelen:', error);
        }

      });

  }


  startQuiz() {

    if (!this.group) {
      return;
    }

    this.router.navigate([
      '/groups',
      this.group.id,
      'quiz'
    ]);

  }


  deleteGroup() {

    if (!this.group) {
      return;
    }

    if (!confirm(
      'Biztosan törlöd a csoportot?'
    )) {
      return;
    }


    this.groupService
      .deleteGroup(this.group.id)
      .subscribe({

        next: () => {

          this.router.navigate(['/']);

        },


        error: error => {
          console.error('Csoport törlése sikertelen:', error);
        }

      });

  }


  goBack() {

    this.router.navigate(['/']);

  }


  editWord(word: WordPair) {

    if (this.addingWord) {
      return;
    }

    if (
      this.editingWordId !== null && this.editingWordId !== word.id) {
      return;
    }

    this.editingWordId = word.id;
  }


  saveWord(word: WordPair) {

    if (!word.sourceWord.trim() || !word.targetWord.trim()) {
      return;
    }


    const request: WordPairRequest = {

      sourceWord: word.sourceWord.trim(),
      targetWord: word.targetWord.trim(),
      exampleSentence: word.exampleSentence ?? ''

    };


    this.wordPairService
      .updateWord(word.id, request)
      .subscribe({

        next: updatedWord => {

          if (!this.group) {
            return;
          }

          const index =
            this.group.words.findIndex(x => x.id === updatedWord.id);


          if (index !== -1) {
            this.group.words[index] = updatedWord;
          }

          this.editingWordId = null;

          this.cdr.markForCheck();

        },
        error: error => {
          console.error('Szópár módosítása sikertelen:', error);
        }
      });
  }


  deleteWord(word: WordPair) {

    if (!confirm(
        `Biztosan törlöd a(z) "${word.sourceWord}" - "${word.targetWord}" szópárt?`
      )
    ) {
      return;
    }


    this.wordPairService
      .deleteWord(word.id)
      .subscribe({

        next: () => {

          if (!this.group) {
            return;
          }


          this.group.words = this.group.words.filter(x => x.id !== word.id);

          this.cdr.markForCheck();

        },

        error: error => {
          console.error('Szópár törlése sikertelen:', error);
        }

      });

  }


  startAddingWord() {

    if (this.editingWordId !== null || this.addingWord) {
      return;
    }

    this.addingWord = true;

    this.newSourceWord = '';

    this.newTargetWord = '';

    this.cdr.detectChanges();

    this.newSourceInput?.nativeElement.focus();

  }



  saveNewWord() {

    if (!this.group) {
      return;
    }

    const sourceWord = this.newSourceWord.trim();

    const targetWord = this.newTargetWord.trim();


    if (!sourceWord || !targetWord) {
      return;
    }


    const request: WordPairRequest = {
      sourceWord,
      targetWord,
      exampleSentence: ''
    };


    this.wordPairService
      .addWord(this.group.id, request)
      .subscribe({

        next: createdWord => {

          if (!this.group) {
            return;
          }


          this.group.words.push(createdWord);


          this.newSourceWord = '';

          this.newTargetWord = '';

          this.addingWord = false;

          this.cdr.markForCheck();

          if (this.quickAddingWord) {
            this.startAddingWord();
          }

        },


        error: error => {
          console.error('Szópár hozzáadása sikertelen:', error);
        }

      });

  }


  cancelAddingWord() {

    this.addingWord = false;
    this.quickAddingWord = false;
    this.newSourceWord = '';
    this.newTargetWord = '';

  }


}
