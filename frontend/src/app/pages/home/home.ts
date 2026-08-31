import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupCard } from '../../components/group-card/group-card';
import {GroupFilterComponent, type GroupFilterState,} from '../../components/group-filter/group-filter';
import { CreateGroupModal } from '../../components/create-group-modal/create-group-modal';
import { DictionaryGroupCard } from '../../core/models/dictionary-group-card';
import { AlertService } from '../../core/services/alert.service';
import { DictionaryGroupService } from '../../core/services/dictionary-group.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GroupCard, GroupFilterComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  groups: DictionaryGroupCard[] = [];

  filteredGroups: DictionaryGroupCard[] = [];

  filter: GroupFilterState = {
    searchTerm: '',
    sourceLanguage: '',
    targetLanguage: '',
    visibility: 'ALL',
    minWordCount: null,
    maxWordCount: null,
    sortBy: 'name',
    sortDescending: false,
  };

  sourceLanguages: string[] = [];
  targetLanguages: string[] = [];

  constructor(
    private groupService: DictionaryGroupService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private alertService: AlertService,
  ) {}

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.groupService.getMyGroups().subscribe({
      next: (data) => {
        this.groups = data;

        this.sourceLanguages = [
          ...new Set(data.map((group) => group.sourceLanguage)),
        ].sort((a, b) => a.localeCompare(b, 'hu'));

        this.targetLanguages = [
          ...new Set(data.map((group) => group.targetLanguage)),
        ].sort((a, b) => a.localeCompare(b, 'hu'));

        this.applyFilter(this.filter)
        this.cdr.markForCheck();
      },
      error: () => this.alertService.error('A csoportok betöltése sikertelen.'),
    });
  }

  deleteGroup(id: number): void {
    this.alertService
      .confirmDelete('Biztosan törlöd?', 'A művelet nem vonható vissza.')
      .then((result) => {
        if (result.isConfirmed) {
          this.deleteGroupFromBackend(id);
        }
      });
  }

  openCreateModal(): void {
    const modalRef = this.modalService.open(CreateGroupModal, { centered: true });
    modalRef.closed.subscribe((created) => {
      if (created) {
        this.loadGroups();
        this.alertService.success('A csoport létrejött.');
      }
    });
  }

  private deleteGroupFromBackend(id: number): void {
    this.groupService.deleteGroup(id).subscribe({
      next: () => {
        this.groups = this.groups.filter((group) => group.id !== id);
        this.cdr.markForCheck();
        this.alertService.success('A csoport törölve.');
      },
      error: () => this.alertService.error('A csoport törlése sikertelen.'),
    });
  }




  applyFilter(filter: GroupFilterState): void {
    this.filter = filter;

    const search = filter.searchTerm.trim().toLowerCase();

    let result = this.groups.filter((group) => {

      if (search) {
        const matchesSearch =
          group.name.toLowerCase().includes(search) ||
          group.description?.toLowerCase().includes(search) ||
          group.sourceLanguage.toLowerCase().includes(search) ||
          group.targetLanguage.toLowerCase().includes(search);

        if (!matchesSearch) {
          return false;
        }
      }

      if (filter.sourceLanguage && group.sourceLanguage !== filter.sourceLanguage) {
        return false;
      }

      if (filter.targetLanguage && group.targetLanguage !== filter.targetLanguage) {
        return false;
      }

      if (filter.visibility !== 'ALL' && group.visibility !== filter.visibility) {
        return false;
      }

      if (filter.minWordCount !== null && group.wordCount < filter.minWordCount) {
        return false;
      }

      if (filter.maxWordCount !== null && group.wordCount > filter.maxWordCount) {
        return false;
      }

      return true;
    });

    result = [...result].sort((a, b) => {
      let comparison = 0;

      switch (filter.sortBy) {
        case 'wordCount':
          comparison = a.wordCount - b.wordCount;
          break;

        case 'lastUsed':
          comparison = this.compareDates(a.lastUsedAt, b.lastUsedAt);
          break;

        case 'created':
          comparison = 0;
          break;

        case 'name':
        default:
          comparison = a.name.localeCompare(b.name, 'hu');
          break;
      }

      return filter.sortDescending ? -comparison : comparison;
    });

    this.filteredGroups = result;
  }

  private compareDates(
    a: string | null,
    b: string | null
  ): number {
    if (!a && !b) {
      return 0;
    }

    if (!a) {
      return 1;
    }

    if (!b) {
      return -1;
    }

    return new Date(a).getTime() - new Date(b).getTime();
  }



}
