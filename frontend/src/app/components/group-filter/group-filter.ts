import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type GroupVisibilityFilter = 'ALL' | 'PUBLIC' | 'PRIVATE';

export type GroupSortBy =
  | 'name'
  | 'wordCount'
  | 'lastUsed'
  | 'created'
  | 'popular';

export interface GroupFilterState {
  searchTerm: string;
  sourceLanguage: string;
  targetLanguage: string;
  visibility: GroupVisibilityFilter;
  minWordCount: number | null;
  maxWordCount: number | null;
  sortBy: GroupSortBy;
  sortDescending: boolean;
}

@Component({
  selector: 'app-group-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './group-filter.html',
  styleUrl: './group-filter.css',
})
export class GroupFilterComponent {
  @Input() showVisibility = true;

  @Input() showPopularity = false;

  @Input() sourceLanguages: string[] = [];

  @Input() targetLanguages: string[] = [];

  @Output() filterChange = new EventEmitter<GroupFilterState>();

  filter: GroupFilterState = this.createDefaultFilter();

  isOpen = false;

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  onFilterChange(): void {
    this.filterChange.emit({ ...this.filter });
  }

  clearFilters(): void {
    this.filter = this.createDefaultFilter();

    this.filterChange.emit({ ...this.filter });
  }

  get hasActiveFilters(): boolean {
    return (
      this.filter.searchTerm.trim().length > 0 ||
      this.filter.sourceLanguage !== '' ||
      this.filter.targetLanguage !== '' ||
      this.filter.visibility !== 'ALL' ||
      this.filter.minWordCount !== null ||
      this.filter.maxWordCount !== null ||
      this.filter.sortBy !== 'name' ||
      this.filter.sortDescending
    );
  }

  private createDefaultFilter(): GroupFilterState {
    return {
      searchTerm: '',
      sourceLanguage: '',
      targetLanguage: '',
      visibility: 'ALL',
      minWordCount: null,
      maxWordCount: null,
      sortBy: 'name',
      sortDescending: false,
    };
  }
}
