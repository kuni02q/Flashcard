import { TestBed } from '@angular/core/testing';

import { DictionaryGroupService } from './dictionary-group.service';

describe('DictionaryGroupService', () => {
  let service: DictionaryGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DictionaryGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
