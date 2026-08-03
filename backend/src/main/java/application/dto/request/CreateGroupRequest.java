package application.dto.request;


import lombok.Data;


@Data
public class CreateGroupRequest {


    private String name;

    private String description;

    private Long sourceLanguageId;

    private Long targetLanguageId;


}