package application.dto.response;

import application.model.DictionaryGroup;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;


@Data
@AllArgsConstructor
public class DictionaryGroupCardResponse {


    private Long id;


    private String name;


    private String description;

    private DictionaryGroup.Visibility visibility;


    private String sourceLanguage;


    private String targetLanguage;


    private int wordCount;


    private int learnedWordCount;


    private LocalDateTime lastUsedAt;

    private QuizSettingsResponse quizSettings;

}