package application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ImportPreviewRowResponse {

    private int rowNumber;

    private String sourceWord;

    private String targetWord;

    private String exampleSentence;

    private String status;

    private String message;

}