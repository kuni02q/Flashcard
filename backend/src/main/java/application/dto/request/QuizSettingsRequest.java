package application.dto.request;

import application.model.DictionaryGroup;
import lombok.Data;

@Data
public class QuizSettingsRequest {

    private DictionaryGroup.QuizMode mode;

    private int wordCount;

    private DictionaryGroup.QuizDirection direction;
}
