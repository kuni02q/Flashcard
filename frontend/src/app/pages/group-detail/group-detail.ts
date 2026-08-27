import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizSettingsModal } from '../../components/quiz-settings-modal/quiz-settings-modal';
import { ActivatedRoute, Router } from '@angular/router';
import { DictionaryGroupService } from '../../core/services/dictionary-group.service';
import { DictionaryGroup } from '../../core/models/dictionary-group';
import { WordPairRequest, WordPairService } from '../../core/services/word-pair.service';
import { WordPair } from '../../core/models/word-pair';
import { FormsModule } from '@angular/forms';
import { QuizSettings } from '../../core/models/quiz-settings';
import { ImportWordsModal } from '../../components/import-words-modal/import-words-modal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './group-detail.html',
  styleUrl: './group-detail.css',
})
export class GroupDetail implements OnInit {
  group: DictionaryGroup | null = null;

  quizSettings!: QuizSettings;

  editingWordId: number | null = null;

  addingWord = false;
  quickAddingWord = false;

  newSourceWord = '';

  newTargetWord = '';


  @ViewChild('newSourceInput')
  newSourceInput?: ElementRef<HTMLInputElement>;

  @ViewChild('editingWordInput')
  editingWordInput?: ElementRef<HTMLInputElement>;

  searchTerm = '';
  searchMatches: { wordId: number; field: 'source' | 'target' }[] = [];
  currentSearchMatchIndex = -1;



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupService: DictionaryGroupService,
    private wordPairService: WordPairService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private alertService: AlertService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.router.navigate(['/']);
      return;
    }

    this.loadGroup(id);
  }

  loadGroup(id: number) {
    this.groupService.getById(id).subscribe({
      next: (group) => {
        this.group = group;
        this.quizSettings = {
          mode: group.quizSettings.mode,
          wordCount: group.quizSettings.wordCount,
          direction: group.quizSettings.direction,
        };

        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error('Csoport betöltése sikertelen:', error);

        this.router.navigate(['/']);
      },
    });
  }

  get learnedWordCount(): number {
    if (!this.group) {
      return 0;
    }

    return this.group.words.filter((word) => word.learned).length;
  }

  openSettings() {
    if (!this.group) return;
    const modalRef = this.modalService.open(QuizSettingsModal, { centered: true });
    modalRef.componentInstance.maxWordCount = this.group.words.length;
    modalRef.componentInstance.settings = this.quizSettings;
    modalRef.componentInstance.sourceLanguageName = this.group.sourceLanguage.name;
    modalRef.componentInstance.targetLanguageName = this.group.targetLanguage.name;
    modalRef.componentInstance.settingsChange.subscribe((settings: QuizSettings) =>
      this.updateQuizSettings(settings),
    );
  }

  updateQuizSettings(settings: QuizSettings) {
    if (!this.group) {
      return;
    }

    this.groupService.updateQuizSettings(this.group.id, settings).subscribe({
      next: (updatedGroup) => {
        this.group = updatedGroup;

        this.quizSettings = updatedGroup.quizSettings;

        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error('Quiz beállítások mentése sikertelen:', error);
      },
    });
  }

  startQuiz() {
    if (!this.group) {
      return;
    }

    this.router.navigate(['/groups', this.group.id, 'quiz']);
  }

  async deleteGroup() {
    if (!this.group) {
      return;
    }

    const result = await this.alertService.confirm(
      'Biztosan törlöd?',
      'A művelet nem vonható vissza.',
    );
    if (!result.isConfirmed) return;

    if (false && !confirm('Biztosan törlöd a csoportot?')) {
      return;
    }

    this.groupService.deleteGroup(this.group.id).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },

      error: (error) => {
        console.error('Csoport törlése sikertelen:', error);
      },
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  editWord(word: WordPair) {
    if (this.addingWord) {
      return;
    }

    if (this.editingWordId !== null && this.editingWordId !== word.id) {
      return;
    }

    this.editingWordId = word.id;

    this.cdr.detectChanges();

    this.editingWordInput?.nativeElement.focus();
  }

  saveWord(word: WordPair) {
    if (!word.sourceWord.trim() || !word.targetWord.trim()) {
      this.alertService.warning('A forrás- és célszó megadása kötelező.');
      return;
    }

    const request: WordPairRequest = {
      sourceWord: word.sourceWord.trim(),
      targetWord: word.targetWord.trim(),
      exampleSentence: word.exampleSentence ?? '',
    };

    this.wordPairService.updateWord(word.id, request).subscribe({
      next: (updatedWord) => {
        if (!this.group) {
          return;
        }

        const index = this.group.words.findIndex((x) => x.id === updatedWord.id);

        if (index !== -1) {
          this.group.words[index] = updatedWord;
        }

        this.editingWordId = null;

        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Szópár módosítása sikertelen:', error);
      },
    });
  }

  async deleteWord(word: WordPair) {

    if (this.addingWord || this.editingWordId !== null) {
      return;
    }

    const result = await this.alertService.confirm(
      'Biztosan törlöd?',
      'A művelet nem vonható vissza.',
    );
    if (!result.isConfirmed) return;

    if (false && !confirm(`Biztosan törlöd a(z) "${word.sourceWord}" - "${word.targetWord}" szópárt?`)) {
      return;
    }

    this.wordPairService.deleteWord(word.id).subscribe({
      next: () => {
        if (!this.group) {
          return;
        }

        this.group.words = this.group.words.filter((x) => x.id !== word.id);

        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error('Szópár törlése sikertelen:', error);
      },
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
      this.alertService.warning('A forrás- és célszó megadása kötelező.');
      return;
    }

    const wordPairAlreadyExists = this.group.words.some(
      (word) =>
        word.sourceWord.trim().localeCompare(sourceWord, undefined, { sensitivity: 'accent' }) ===
          0 &&
        word.targetWord.trim().localeCompare(targetWord, undefined, { sensitivity: 'accent' }) ===
          0,
    );

    if (wordPairAlreadyExists) {
      this.alertService.warning('Ez a szópár már szerepel a csoportban.');
      return;
    }

    const request: WordPairRequest = {
      sourceWord,
      targetWord,
      exampleSentence: '',
    };

    this.wordPairService.addWord(this.group.id, request).subscribe({
      next: (createdWord) => {
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

      error: (error) => {
        console.error('Szópár hozzáadása sikertelen:', error);
      },
    });
  }

  cancelAddingWord() {
    this.addingWord = false;
    this.quickAddingWord = false;
    this.newSourceWord = '';
    this.newTargetWord = '';
  }

  openImport() {
    if (!this.group) return;
    const modalRef = this.modalService.open(ImportWordsModal, { size: 'xl', scrollable: true });
    modalRef.componentInstance.groupId = this.group.id;
    modalRef.closed.subscribe((imported) => {
      if (imported) this.onImportCompleted();
    });
  }

  onImportCompleted() {
    if (!this.group) {
      return;
    }

    this.loadGroup(this.group.id);
  }



  onSearchChange() {
    this.updateSearchMatches();

    if (this.searchMatches.length > 0) {
      this.currentSearchMatchIndex = 0;

      this.cdr.detectChanges();

      this.scrollToCurrentSearchMatch();
    } else {
      this.currentSearchMatchIndex = -1;
    }
  }


  updateSearchMatches() {
    this.searchMatches = [];

    if (!this.group || !this.searchTerm.trim()) {
      return;
    }

    const search = this.searchTerm.trim().toLocaleLowerCase();

    for (const word of this.group.words) {
      if (word.sourceWord.toLocaleLowerCase().includes(search)) {
        this.searchMatches.push({
          wordId: word.id,
          field: 'source',
        });
      }

      if (word.targetWord.toLocaleLowerCase().includes(search)) {
        this.searchMatches.push({
          wordId: word.id,
          field: 'target',
        });
      }
    }
  }


  nextSearchMatch() {
    if (this.searchMatches.length === 0) {
      return;
    }

    this.currentSearchMatchIndex = (this.currentSearchMatchIndex + 1) % this.searchMatches.length;

    this.cdr.detectChanges();

    this.scrollToCurrentSearchMatch();
  }


  previousSearchMatch() {
    if (this.searchMatches.length === 0) {
      return;
    }

    this.currentSearchMatchIndex =
      (this.currentSearchMatchIndex - 1 + this.searchMatches.length) %
      this.searchMatches.length;

    this.cdr.detectChanges();

    this.scrollToCurrentSearchMatch();
  }


  onSearchKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (event.shiftKey) {
        this.previousSearchMatch();
      } else {
        this.nextSearchMatch();
      }
    }

    if (event.key === 'Escape') {
      this.clearSearch();
    }
  }


  clearSearch() {
    this.searchTerm = '';
    this.searchMatches = [];
    this.currentSearchMatchIndex = -1;
  }


  isCurrentSearchMatch(wordId: number, field: 'source' | 'target'): boolean {
    if (
      this.currentSearchMatchIndex < 0 ||
      this.currentSearchMatchIndex >= this.searchMatches.length
    ) {
      return false;
    }

    const currentMatch = this.searchMatches[this.currentSearchMatchIndex];

    return (
      currentMatch.wordId === wordId &&
      currentMatch.field === field
    );
  }


  highlightSearchTerm(text: string): string {
    if (!this.searchTerm.trim()) {
      return this.escapeHtml(text);
    }

    const search = this.searchTerm.trim();

    const escapedText = this.escapeHtml(text);
    const escapedSearch = this.escapeRegExp(search);

    const regex = new RegExp(`(${escapedSearch})`, 'gi');

    return escapedText.replace(regex, '<mark class="search-highlight">$1</mark>',);
  }


  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }


  private escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }


  private scrollToCurrentSearchMatch() {
    if (this.currentSearchMatchIndex < 0) {
      return;
    }

    const element = document.querySelector(
      `[data-search-match-index="${this.currentSearchMatchIndex}"]`,
    );

    if (element) {
      element.scrollIntoView({behavior: 'smooth', block: 'center',});
    }
  }

  getSearchMatchIndex(wordId: number, field: 'source' | 'target'): number | null {
    const index = this.searchMatches.findIndex(
      (match) => match.wordId === wordId && match.field === field,
    );

    return index !== -1 ? index : null;
  }



}
