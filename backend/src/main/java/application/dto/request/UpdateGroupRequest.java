package application.dto.request;


import application.model.DictionaryGroup;
import lombok.Data;


@Data
public class UpdateGroupRequest {


    private String name;

    private String description;

    private DictionaryGroup.Visibility visibility;


}