package application.dto.response;

import application.model.DictionaryGroup;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class QuizSettingsResponse {

    private DictionaryGroup.QuizMode mode;

    private int wordCount;

    private DictionaryGroup.QuizDirection direction;
}
