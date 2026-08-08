import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Language } from '../../core/models/language';
import { LanguageService } from '../../core/services/language.service';
import { DictionaryGroupService } from '../../core/services/dictionary-group.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-create-group-modal',
  standalone: true,
  imports: [FormsModule, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem],
  templateUrl: './create-group-modal.html',
  styleUrl: './create-group-modal.css',
})
export class CreateGroupModal implements OnInit, AfterViewInit {
  name = '';

  description = '';

  sourceLanguageId: number | null = null;

  targetLanguageId: number | null = null;

  languages: Language[] = [];

  sourceSearch = '';

  targetSearch = '';

  @ViewChild('nameInput')
  nameInput?: ElementRef<HTMLInputElement>;

  constructor(
    private languageService: LanguageService,
    private groupService: DictionaryGroupService,
    public activeModal: NgbActiveModal,
    private alertService: AlertService,
  ) {}

  ngOnInit() {
    this.languageService.getLanguages().subscribe((data) => {
      this.languages = data;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.nameInput?.nativeElement.focus());
  }

  create() {
    if (
      !this.name.trim() ||
      !this.description.trim() ||
      !this.sourceLanguageId ||
      !this.targetLanguageId
    ) {
      this.alertService.warning('Tölts ki minden mezőt a csoport létrehozásához.');
      return;
    }

    if (this.sourceLanguageId === this.targetLanguageId) {
      this.alertService.warning('A forrás- és célnyelv nem lehet azonos.');
      return;
    }

    const data = {
      name: this.name.trim(),
      description: this.description.trim(),
      sourceLanguageId: this.sourceLanguageId,
      targetLanguageId: this.targetLanguageId,
    };

    this.groupService.createGroup(data).subscribe({
      next: () => this.activeModal.close(true),
      error: () => this.alertService.error('A csoport létrehozása sikertelen.'),
    });
  }

  cancel() {
    this.activeModal.dismiss();
  }

  get filteredSourceLanguages() {
    return this.languages.filter((x) =>
      x.name.toLowerCase().includes(this.sourceSearch.toLowerCase()),
    );
  }

  get filteredTargetLanguages() {
    return this.languages.filter((x) =>
      x.name.toLowerCase().includes(this.targetSearch.toLowerCase()),
    );
  }

  selectSourceLanguage(language: Language) {
    this.sourceLanguageId = language.id;
    this.sourceSearch = language.name;
  }

  selectTargetLanguage(language: Language) {
    this.targetLanguageId = language.id;
    this.targetSearch = language.name;
  }
}
