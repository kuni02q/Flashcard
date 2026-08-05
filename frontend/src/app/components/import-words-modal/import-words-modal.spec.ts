import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportWordsModal } from './import-words-modal';

describe('ImportWordsModal', () => {
  let component: ImportWordsModal;
  let fixture: ComponentFixture<ImportWordsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportWordsModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportWordsModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
