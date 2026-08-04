import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizSettingsModal } from './quiz-settings-modal';

describe('QuizSettingsModal', () => {
  let component: QuizSettingsModal;
  let fixture: ComponentFixture<QuizSettingsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizSettingsModal],
    }).compileComponents();

    fixture = TestBed.createComponent(QuizSettingsModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
