import { TestBed } from '@angular/core/testing';

import { WordImportService } from './word-import.service';

describe('WordImportService', () => {
  let service: WordImportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordImportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
