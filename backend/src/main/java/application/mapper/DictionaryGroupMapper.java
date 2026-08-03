package application.mapper;


import application.dto.response.DictionaryGroupResponse;
import application.model.DictionaryGroup;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;


import java.util.stream.Collectors;



@Component
@RequiredArgsConstructor
public class DictionaryGroupMapper {


    private final UserMapper userMapper;

    private final LanguageMapper languageMapper;

    private final WordPairMapper wordPairMapper;




    public DictionaryGroupResponse toResponse(
            DictionaryGroup group
    ){


        return new DictionaryGroupResponse(

                group.getId(),

                group.getName(),

                group.getDescription(),

                group.getVisibility(),

                group.isCompleted(),

                group.getCreatedAt(),


                userMapper.toResponse(
                        group.getUser()
                ),


                languageMapper.toResponse(
                        group.getSourceLanguage()
                ),


                languageMapper.toResponse(
                        group.getTargetLanguage()
                ),


                group.getWords()
                        .stream()
                        .map(wordPairMapper::toResponse)
                        .collect(Collectors.toList())

        );

    }

}