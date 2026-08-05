package application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class WordPairResponse {


    private Long id;

    private String sourceWord;

    private String targetWord;

    private String exampleSentence;

    private boolean learned;

    private int quizCount;

    private int correctCount;


}