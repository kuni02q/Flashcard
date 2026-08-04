import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DictionaryGroupCard} from '../../core/models/dictionary-group-card';
import {CommonModule, DatePipe} from '@angular/common';
import {QuizSettingsModal} from '../quiz-settings-modal/quiz-settings-modal';
import {QuizSettings} from '../../core/models/quiz-settings';
import {Router} from '@angular/router';
import {DictionaryGroupService} from '../../core/services/dictionary-group.service';

@Component({
  selector: 'app-group-card',
  standalone: true,
  imports: [CommonModule, QuizSettingsModal],
  templateUrl: './group-card.html',
  styleUrl: './group-card.css',
})
export class GroupCard {

  @Input()
  group!:DictionaryGroupCard;


  @Output()
  delete = new EventEmitter<number>();

  showSettingsModal = false;

  quizSettings!: QuizSettings;

  constructor(private router: Router, private groupService: DictionaryGroupService) {}

  ngOnChanges() {

    if (!this.group) {
      return;
    }

    this.quizSettings = {
      mode: this.group.quizSettings.mode,
      wordCount: Math.min(this.group.quizSettings.wordCount, this.group.wordCount),
      direction: this.group.quizSettings.direction
    };
  }


  get learnedPercent(){

    if(this.group.wordCount === 0){
      return 0;
    }


    return Math.round(
      this.group.learnedWordCount /
      this.group.wordCount *
      100
    );

  }


  deleteGroup(event: Event){

    event.stopPropagation();

    this.delete.emit(this.group.id);

  }


  openSettings(event: Event) {

    event.stopPropagation();

    this.showSettingsModal = true;

  }


  closeSettings() {

    this.showSettingsModal = false;

  }


  updateQuizSettings(settings: QuizSettings) {

    this.quizSettings = settings;

    this.groupService
      .updateQuizSettings(this.group.id, settings)
      .subscribe({

        next: () => {

          console.log('Quiz beállítások mentve');

        },

        error: error => {

          console.error('Quiz beállítások mentése sikertelen', error);

        }

      });

  }


  startQuiz(event: Event) {

    event.stopPropagation();

    console.log('Quiz indítása:', this.group.id, this.quizSettings);


    this.router.navigate(
      ['/groups', this.group.id, 'quiz'],
      {
        state: {
          settings: this.quizSettings
        }
      }
    );

  }


  openGroup() {

    this.router.navigate(
      ['/groups', this.group.id]
    );

  }


}
