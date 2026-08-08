import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DictionaryGroupCard } from '../../core/models/dictionary-group-card';
import { CommonModule, DatePipe } from '@angular/common';
import { QuizSettingsModal } from '../quiz-settings-modal/quiz-settings-modal';
import { QuizSettings } from '../../core/models/quiz-settings';
import { Router } from '@angular/router';
import { DictionaryGroupService } from '../../core/services/dictionary-group.service';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-group-card',
  standalone: true,
  imports: [CommonModule, NgbTooltip],
  templateUrl: './group-card.html',
  styleUrl: './group-card.css',
})
export class GroupCard {
  @Input()
  group!: DictionaryGroupCard;

  @Output()
  delete = new EventEmitter<number>();

  quizSettings!: QuizSettings;

  constructor(
    private router: Router,
    private groupService: DictionaryGroupService,
    private modalService: NgbModal,
    private alertService: AlertService,
  ) {}

  ngOnChanges() {
    if (!this.group) {
      return;
    }

    this.quizSettings = {
      mode: this.group.quizSettings.mode,
      wordCount: Math.min(this.group.quizSettings.wordCount, this.group.wordCount),
      direction: this.group.quizSettings.direction,
    };
  }

  get learnedPercent() {
    if (this.group.wordCount === 0) {
      return 0;
    }

    return Math.round((this.group.learnedWordCount / this.group.wordCount) * 100);
  }

  deleteGroup(event: Event) {
    event.stopPropagation();

    this.delete.emit(this.group.id);
  }

  openSettings(event: Event) {
    event.stopPropagation();

    const modalRef = this.modalService.open(QuizSettingsModal, { centered: true });
    modalRef.componentInstance.maxWordCount = this.group.wordCount;
    modalRef.componentInstance.settings = this.quizSettings;
    modalRef.componentInstance.sourceLanguageName = this.group.sourceLanguage;
    modalRef.componentInstance.targetLanguageName = this.group.targetLanguage;
    modalRef.componentInstance.settingsChange.subscribe((settings: QuizSettings) =>
      this.updateQuizSettings(settings),
    );
  }

  updateQuizSettings(settings: QuizSettings) {
    this.quizSettings = settings;

    this.groupService.updateQuizSettings(this.group.id, settings).subscribe({
      next: () => {
        this.alertService.success('A kvíz beállításai mentve.');
      },

      error: (error) => {
        this.alertService.error('A kvíz beállításainak mentése sikertelen.');
      },
    });
  }

  startQuiz(event: Event) {
    event.stopPropagation();

    console.log('Quiz indítása:', this.group.id, this.quizSettings);

    this.router.navigate(['/groups', this.group.id, 'quiz'], {
      state: {
        settings: this.quizSettings,
      },
    });
  }

  openGroup() {
    this.router.navigate(['/groups', this.group.id]);
  }
}
