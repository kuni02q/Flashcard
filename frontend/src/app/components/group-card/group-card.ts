import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DictionaryGroupCard} from '../../core/models/dictionary-group-card';
import {CommonModule, DatePipe} from '@angular/common';

@Component({
  selector: 'app-group-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group-card.html',
  styleUrl: './group-card.css',
})
export class GroupCard {

  @Input()
  group!:DictionaryGroupCard;


  @Output()
  delete = new EventEmitter<number>();


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


  deleteGroup(){

    this.delete.emit(this.group.id);

  }

}
