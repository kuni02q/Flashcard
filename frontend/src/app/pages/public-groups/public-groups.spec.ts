import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicGroups } from './public-groups';

describe('PublicGroups', () => {
  let component: PublicGroups;
  let fixture: ComponentFixture<PublicGroups>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicGroups],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicGroups);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
