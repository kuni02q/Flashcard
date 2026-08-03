package application.mapper;


import application.dto.response.LanguageResponse;
import application.model.Language;
import org.springframework.stereotype.Component;


@Component
public class LanguageMapper {


    public LanguageResponse toResponse(Language language){

        return new LanguageResponse(
                language.getId(),
                language.getName()
        );

    }


}