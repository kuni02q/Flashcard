package application.dto.response;


import application.model.DictionaryGroup;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;


@Data
@AllArgsConstructor
public class DictionaryGroupResponse {


    private Long id;


    private String name;


    private String description;


    private DictionaryGroup.Visibility visibility;


    private boolean completed;


    private LocalDateTime createdAt;

    private LocalDateTime lastUsedAt;


    private UserResponse user;


    private LanguageResponse sourceLanguage;


    private LanguageResponse targetLanguage;


    private List<WordPairResponse> words;

    private QuizSettingsResponse quizSettings;

}