import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupCard } from '../../components/group-card/group-card';
import { CreateGroupModal } from '../../components/create-group-modal/create-group-modal';
import { DictionaryGroupCard } from '../../core/models/dictionary-group-card';
import { AlertService } from '../../core/services/alert.service';
import { DictionaryGroupService } from '../../core/services/dictionary-group.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GroupCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  groups: DictionaryGroupCard[] = [];

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
        this.cdr.markForCheck();
      },
      error: () => this.alertService.error('A csoportok betöltése sikertelen.'),
    });
  }

  deleteGroup(id: number): void {
    this.alertService
      .confirm('Biztosan törlöd?', 'A művelet nem vonható vissza.')
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
}
