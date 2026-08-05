package application.dto.imports;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WordPairImportRow {

    private String sourceWord;

    private String targetWord;

    private String exampleSentence;

}