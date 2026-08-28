import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DictionaryGroupService } from '../../core/services/dictionary-group.service';
import { AlertService } from '../../core/services/alert.service';
import { PublicDictionaryGroup } from '../../core/models/public-dictionary-group';

@Component({
  selector: 'app-public-group-preview-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-group-preview-modal.html',
  styleUrl: './public-group-preview-modal.css',
})
export class PublicGroupPreviewModal implements OnInit {
  @Input() groupId!: number;

  group: PublicDictionaryGroup | null = null;
  loading = true;
  adding = false;

  constructor(
    public activeModal: NgbActiveModal,
    private groupService: DictionaryGroupService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.groupService.viewPublicGroup(this.groupId).subscribe({
      next: (group) => {
        this.group = group;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.alertService.error('A publikus csoport betöltése sikertelen.');
        this.activeModal.dismiss();
      },
    });
  }

  async addToMyGroups(): Promise<void> {
    if (!this.group || this.adding) {
      return;
    }

    const result = await this.alertService.confirm(
      'Felveszed a saját csoportjaid közé?',
      'A csoport saját, szerkeszthető másolata jön létre.',
      'Hozzáadás',
    );

    if (!result.isConfirmed) {
      return;
    }

    this.adding = true;

    this.groupService.copyPublicGroup(this.group.id).subscribe({
      next: () => {
        this.adding = false;
        this.alertService.success('A csoport bekerült a saját gyűjteményedbe.');
        this.activeModal.close(true);
      },
      error: (error) => {
        this.adding = false;
        this.alertService.httpError(
          error,
          'A csoport hozzáadása sikertelen.',
        );
        this.cdr.markForCheck();
      },
    });
  }

  cancel(): void {
    this.activeModal.dismiss();
  }
}
