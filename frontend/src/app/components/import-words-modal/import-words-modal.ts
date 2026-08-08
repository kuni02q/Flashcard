import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordImportService } from '../../core/services/word-import.service';
import { ImportPreview } from '../../core/models/import-preview';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-import-words-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './import-words-modal.html',
  styleUrl: './import-words-modal.css',
})
export class ImportWordsModal {
  @Input()
  groupId!: number;

  @Output()
  imported = new EventEmitter<void>();

  selectedFile: File | null = null;

  preview: ImportPreview | null = null;

  loading = false;

  importing = false;

  errorMessage = '';

  constructor(
    private importService: WordImportService,
    private cdr: ChangeDetectorRef,
    public activeModal: NgbActiveModal,
    private alertService: AlertService,
  ) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    this.selectedFile = input.files[0];

    this.preview = null;

    this.errorMessage = '';

    this.cdr.detectChanges();
  }

  previewFile() {
    if (!this.selectedFile) {
      this.alertService.warning('Válassz ki egy CSV fájlt az előnézethez.');
      return;
    }

    this.loading = true;

    this.errorMessage = '';

    this.importService.preview(this.groupId, this.selectedFile).subscribe({
      next: (preview) => {
        console.log('Import preview sikeres:', preview);

        this.preview = preview;
        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Import preview sikertelen:', error);

        this.loading = false;

        if (error?.error?.message) {
          this.errorMessage = error.error.message;
        } else if (typeof error?.error === 'string') {
          this.errorMessage = error.error;
        } else {
          this.errorMessage =
            'A fájl feldolgozása sikertelen. Ellenőrizd a CSV formátumát és a szerver naplóját.';
        }

        this.cdr.detectChanges();
      },

      complete: () => {
        this.loading = false;

        this.cdr.detectChanges();
      },
    });
  }

  confirmImport() {
    if (!this.selectedFile || !this.preview) {
      this.alertService.warning('Előbb készíts előnézetet a kiválasztott fájlról.');
      return;
    }

    if (this.preview.validRows === 0) {
      this.alertService.warning('Nincs importálható sor a fájlban.');
      return;
    }

    this.importing = true;

    this.errorMessage = '';

    this.importService.confirm(this.groupId, this.selectedFile).subscribe({
      next: () => {
        this.importing = false;
        this.imported.emit();
        this.alertService.success('Az importálás sikeresen befejeződött.');
        this.activeModal.close(true);
      },

      error: (error) => {
        console.error('Importálás sikertelen:', error);
        this.alertService.error('Az importálás sikertelen.');

        this.importing = false;

        if (error?.error?.message) {
          this.errorMessage = error.error.message;
        } else if (typeof error?.error === 'string') {
          this.errorMessage = error.error;
        } else {
          this.errorMessage = 'Az importálás sikertelen.';
        }
      },

      complete: () => {
        this.importing = false;
      },
    });
  }

  cancel() {
    this.activeModal.dismiss();
  }

  get canImport(): boolean {
    return !!this.preview && this.preview.validRows > 0 && !this.importing;
  }
}
