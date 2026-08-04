import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DictionaryGroupCard} from '../../core/models/dictionary-group-card';
import {CommonModule, DatePipe} from '@angular/common';
import {QuizSettings, QuizSettingsModal} from '../quiz-settings-modal/quiz-settings-modal';
import {Router} from '@angular/router';

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

  quizSettings: QuizSettings = {
    mode: 'ONCE',
    wordCount: 10
  };

  constructor(private router: Router) {}

  ngOnChanges() {

    if (this.group) {
      this.quizSettings.wordCount =
        Math.min(
          this.quizSettings.wordCount,
          this.group.wordCount
        );

    }
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

    console.log('Quiz beállítások módosítva:', this.group.id, this.quizSettings);

  }


  startQuiz(event: Event) {

    event.stopPropagation();

    console.log(
      'Quiz indítása:', this.group.id, this.quizSettings);


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
