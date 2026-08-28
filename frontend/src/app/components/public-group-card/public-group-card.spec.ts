import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicGroupCard } from './public-group-card';

describe('PublicGroupCard', () => {
  let component: PublicGroupCard;
  let fixture: ComponentFixture<PublicGroupCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicGroupCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicGroupCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
