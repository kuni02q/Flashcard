import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicGroupPreviewModal } from './public-group-preview-modal';

describe('PublicGroupPreviewModal', () => {
  let component: PublicGroupPreviewModal;
  let fixture: ComponentFixture<PublicGroupPreviewModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicGroupPreviewModal],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicGroupPreviewModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
