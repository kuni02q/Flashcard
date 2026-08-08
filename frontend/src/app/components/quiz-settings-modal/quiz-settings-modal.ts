import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuizSettings } from '../../core/models/quiz-settings';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-quiz-settings-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './quiz-settings-modal.html',
  styleUrl: './quiz-settings-modal.css',
})
export class QuizSettingsModal {
  constructor(public activeModal: NgbActiveModal) {}

  @Input()
  maxWordCount = 0;

  @Input()
  settings!: QuizSettings;

  @Input()
  sourceLanguageName = '';

  @Input()
  targetLanguageName = '';

  @Output()
  close = new EventEmitter<void>();

  @Output()
  settingsChange = new EventEmitter<QuizSettings>();

  mode: 'ONCE' | 'UNTIL_CORRECT' = 'ONCE';

  wordCount = 10;

  direction: 'SOURCE_TO_TARGET' | 'TARGET_TO_SOURCE' = 'SOURCE_TO_TARGET';

  ngOnInit() {
    if (this.settings) {
      this.mode = this.settings.mode;
      this.wordCount = this.settings.wordCount;
      this.direction = this.settings.direction;
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  modeChanged() {
    this.emitSettings();
  }

  wordCountChanged() {
    this.emitSettings();
  }

  toggleDirection() {
    if (this.direction === 'SOURCE_TO_TARGET') {
      this.direction = 'TARGET_TO_SOURCE';
    } else {
      this.direction = 'SOURCE_TO_TARGET';
    }

    this.emitSettings();
  }

  emitSettings() {
    let validWordCount = this.wordCount;

    if (validWordCount < 1) {
      validWordCount = 1;
    }

    if (this.maxWordCount > 0 && validWordCount > this.maxWordCount) {
      validWordCount = this.maxWordCount;
    }

    this.wordCount = validWordCount;

    this.settingsChange.emit({
      mode: this.mode,
      wordCount: this.wordCount,
      direction: this.direction,
    });
  }
}
