import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupFilter } from './group-filter';

describe('GroupFilter', () => {
  let component: GroupFilter;
  let fixture: ComponentFixture<GroupFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
