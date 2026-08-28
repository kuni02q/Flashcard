import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PublicDictionaryGroupCard } from '../../core/models/public-dictionary-group-card';
import { DictionaryGroupService } from '../../core/services/dictionary-group.service';
import { AlertService } from '../../core/services/alert.service';
import { PublicGroupCard } from '../../components/public-group-card/public-group-card';
import { PublicGroupPreviewModal } from '../../components/public-group-preview-modal/public-group-preview-modal';

@Component({
  selector: 'app-public-groups',
  standalone: true,
  imports: [FormsModule, PublicGroupCard],
  templateUrl: './public-groups.html',
  styleUrl: './public-groups.css',
})
export class PublicGroups implements OnInit {
  groups: PublicDictionaryGroupCard[] = [];

  searchTerm = '';
  sortBy: 'name' | 'wordCount' | 'popular' = 'name';

  constructor(private groupService: DictionaryGroupService, private modalService: NgbModal,
              private alertService: AlertService, private cdr: ChangeDetectorRef,) {}

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.groupService.getPublicGroupCards().subscribe({
      next: (groups) => {
        this.groups = groups;
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

  get filteredGroups(): PublicDictionaryGroupCard[] {
    const search = this.searchTerm.trim().toLowerCase();

    const groups = this.groups.filter((group) => {
      if (!search) {
        return true;
      }

      return (
        group.name.toLowerCase().includes(search) ||
        group.description?.toLowerCase().includes(search) ||
        group.sourceLanguage.toLowerCase().includes(search) ||
        group.targetLanguage.toLowerCase().includes(search) ||
        group.ownerName.toLowerCase().includes(search)
      );
    });

    return [...groups].sort((a, b) => {
      if (this.sortBy === 'wordCount') {
        return b.wordCount - a.wordCount;
      }

      if (this.sortBy === 'popular') {
        return b.addCount - a.addCount;
      }

      return a.name.localeCompare(b.name, 'hu');
    });
  }
}
