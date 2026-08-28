package application.dto.request;

import application.model.DictionaryGroup;
import lombok.Data;

@Data
public class UpdateGroupVisibilityRequest {

    private DictionaryGroup.Visibility visibility;
}