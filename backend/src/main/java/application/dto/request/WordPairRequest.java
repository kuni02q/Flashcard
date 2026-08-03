package application.dto.request;

import lombok.Data;

@Data
public class WordPairRequest {

    private String sourceWord;

    private String targetWord;

    private String exampleSentence;

}