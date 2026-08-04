package application.dto.request;

import application.model.DictionaryGroup;
import lombok.Data;

@Data
public class UpdateQuizSettingsRequest {

    private DictionaryGroup.QuizMode mode;

    private int wordCount;

}