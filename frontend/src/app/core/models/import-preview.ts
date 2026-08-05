export interface ImportPreviewRow {
  rowNumber: number;
  sourceWord: string;
  targetWord: string;
  exampleSentence: string;
  status: string;
  message: string | null;
}

export interface ImportPreview {
  totalRows: number;
  validRows: number;
  duplicateRows: number;
  invalidRows: number;
  rows: ImportPreviewRow[];
}
