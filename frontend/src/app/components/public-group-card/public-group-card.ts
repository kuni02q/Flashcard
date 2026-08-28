import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PublicDictionaryGroupCard } from '../../core/models/public-dictionary-group-card';

@Component({
  selector: 'app-public-group-card',
  standalone: true,
  templateUrl: './public-group-card.html',
  styleUrl: './public-group-card.css',
})
export class PublicGroupCard {
  @Input() group!: PublicDictionaryGroupCard;

  @Output() open = new EventEmitter<number>();

  openGroup(): void {
    this.open.emit(this.group.id);
  }
}
