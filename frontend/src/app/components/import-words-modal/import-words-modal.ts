import {ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WordImportService} from '../../core/services/word-import.service';
import {ImportPreview} from '../../core/models/import-preview';

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
  close = new EventEmitter<void>();


  @Output()
  imported = new EventEmitter<void>();


  selectedFile: File | null = null;

  preview: ImportPreview | null = null;

  loading = false;

  importing = false;

  errorMessage = '';


  constructor(private importService: WordImportService, private cdr: ChangeDetectorRef) {}


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
      return;
    }

    this.loading = true;

    this.errorMessage = '';

    this.importService
      .preview(this.groupId, this.selectedFile)
      .subscribe({

        next: preview => {

          console.log('Import preview sikeres:', preview);

          this.preview = preview;
          this.loading = false;

          this.cdr.detectChanges();

        },


        error: error => {

          console.error('Import preview sikertelen:', error);

          this.loading = false;

          if (error?.error?.message) {
            this.errorMessage = error.error.message;
          } else if (typeof error?.error === 'string') {
            this.errorMessage = error.error;
          } else {
            this.errorMessage = 'A fájl feldolgozása sikertelen. Ellenőrizd a CSV formátumát és a szerver naplóját.';
          }

          this.cdr.detectChanges();

        },

        complete: () => {

          this.loading = false;

          this.cdr.detectChanges();

        }

      });


  }



  confirmImport() {

    if (!this.selectedFile || !this.preview) {
      return;
    }


    if (this.preview.validRows === 0) {
      return;
    }


    this.importing = true;

    this.errorMessage = '';


    this.importService
      .confirm(this.groupId, this.selectedFile)
      .subscribe({

        next: () => {

          this.importing = false;
          this.imported.emit();

        },


        error: error => {

          console.error('Importálás sikertelen:', error);

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

        }

      });

  }



  cancel() {
    this.close.emit();
  }


  get canImport(): boolean {

    return !!this.preview &&
      this.preview.validRows > 0 &&
      !this.importing;

  }



}
