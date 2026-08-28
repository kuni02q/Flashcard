package application.dto.request;


import application.model.DictionaryGroup;
import lombok.Data;


@Data
public class CreateGroupRequest {


    private String name;

    private String description;

    private Long sourceLanguageId;

    private Long targetLanguageId;

    private DictionaryGroup.Visibility visibility;


}