import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PublicDictionaryGroupCard } from '../../core/models/public-dictionary-group-card';
import { DictionaryGroupService } from '../../core/services/dictionary-group.service';
import { AlertService } from '../../core/services/alert.service';
import { PublicGroupCard } from '../../components/public-group-card/public-group-card';
import { PublicGroupPreviewModal } from '../../components/public-group-preview-modal/public-group-preview-modal';
import {GroupFilterComponent, type GroupFilterState,} from '../../components/group-filter/group-filter';

@Component({
  selector: 'app-public-groups',
  standalone: true,
  imports: [PublicGroupCard, GroupFilterComponent],
  templateUrl: './public-groups.html',
  styleUrl: './public-groups.css',
})
export class PublicGroups implements OnInit {
  groups: PublicDictionaryGroupCard[] = [];

  filteredGroups: PublicDictionaryGroupCard[] = [];

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

  constructor(private groupService: DictionaryGroupService, private modalService: NgbModal,
              private alertService: AlertService, private cdr: ChangeDetectorRef,) {}

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.groupService.getPublicGroupCards().subscribe({
      next: (groups) => {
        this.groups = groups;

        this.sourceLanguages = [
          ...new Set(groups.map((group) => group.sourceLanguage)),
        ].sort((a, b) => a.localeCompare(b, 'hu'));

        this.targetLanguages = [
          ...new Set(groups.map((group) => group.targetLanguage)),
        ].sort((a, b) => a.localeCompare(b, 'hu'));

        this.applyFilter(this.filter);

        this.cdr.markForCheck();
      },
      error: () =>
        this.alertService.error('A publikus csoportok betöltése sikertelen.'),
    });
  }

  openGroup(id: number): void {
    const modalRef = this.modalService.open(PublicGroupPreviewModal, {
      size: 'xl',
      centered: true,
      scrollable: true,
    });

    modalRef.componentInstance.groupId = id;

    modalRef.closed.subscribe((added) => {
      if (added) {
        this.loadGroups();
      }
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
          group.targetLanguage.toLowerCase().includes(search) ||
          group.ownerName.toLowerCase().includes(search);

        if (!matchesSearch) {
          return false;
        }
      }

      if (
        filter.sourceLanguage &&
        group.sourceLanguage !== filter.sourceLanguage
      ) {
        return false;
      }

      if (
        filter.targetLanguage &&
        group.targetLanguage !== filter.targetLanguage
      ) {
        return false;
      }

      if (
        filter.minWordCount !== null &&
        group.wordCount < filter.minWordCount
      ) {
        return false;
      }

      if (
        filter.maxWordCount !== null &&
        group.wordCount > filter.maxWordCount
      ) {
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

        case 'popular':
          comparison = a.addCount - b.addCount;
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

}
