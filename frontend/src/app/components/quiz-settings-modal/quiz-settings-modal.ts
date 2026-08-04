import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';

export interface QuizSettings{
  mode: 'ONCE' | 'UNTIL_CORRECT';
  wordCount: number;
}

@Component({
  selector: 'app-quiz-settings-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './quiz-settings-modal.html',
  styleUrl: './quiz-settings-modal.css',
})
export class QuizSettingsModal {

  @Input()
  maxWordCount = 0;

  @Input()
  settings!: QuizSettings;

  @Output()
  close = new EventEmitter<void>();

  @Output()
  settingsChange = new EventEmitter<QuizSettings>();


  mode: 'ONCE' | 'UNTIL_CORRECT' = 'ONCE';

  wordCount = 10;


  ngOnInit() {

    if (this.settings) {

      this.mode = this.settings.mode;

      this.wordCount = this.settings.wordCount;

    }

  }


  closeModal() {
    this.close.emit();
  }

  modeChanged() {

    this.emitSettings();

  }


  wordCountChanged() {

    this.emitSettings();

  }


  emitSettings() {

    let validWordCount = this.wordCount;


    if (validWordCount < 1) {
      validWordCount = 1;
    }


    if (validWordCount > this.maxWordCount) {
      validWordCount = this.maxWordCount;
    }


    this.wordCount = validWordCount;


    this.settingsChange.emit({

      mode: this.mode,

      wordCount: this.wordCount

    });

  }

}
