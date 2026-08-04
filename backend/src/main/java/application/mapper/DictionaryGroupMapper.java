package application.mapper;


import application.dto.response.DictionaryGroupCardResponse;
import application.dto.response.DictionaryGroupResponse;
import application.dto.response.QuizSettingsResponse;
import application.model.DictionaryGroup;
import application.model.WordPair;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;


import java.util.List;
import java.util.stream.Collectors;



@Component
@RequiredArgsConstructor
public class DictionaryGroupMapper {


    private final UserMapper userMapper;

    private final LanguageMapper languageMapper;

    private final WordPairMapper wordPairMapper;


    public QuizSettingsResponse toQuizSettingsResponse(
            DictionaryGroup group
    ) {

        return new QuizSettingsResponse(
                group.getQuizMode(),
                group.getQuizWordCount(),
                group.getQuizDirection()
        );

    }

    public DictionaryGroupResponse toResponse(DictionaryGroup group){


        return new DictionaryGroupResponse(

                group.getId(),

                group.getName(),

                group.getDescription(),

                group.getVisibility(),

                group.isCompleted(),

                group.getCreatedAt(),

                group.getLastUsedAt(),

                userMapper.toResponse(group.getUser()),

                languageMapper.toResponse(group.getSourceLanguage()),


                languageMapper.toResponse(group.getTargetLanguage()),

                group.getWords() == null ? List.of():
                        group.getWords()
                            .stream()
                            .map(wordPairMapper::toResponse)
                            .collect(Collectors.toList()),

                toQuizSettingsResponse(group)

        );

    }


    public DictionaryGroupCardResponse toCardResponse(DictionaryGroup group){


        int wordCount = group.getWords().size();


        int learnedWordCount =
                (int) group.getWords()
                        .stream()
                        .filter(WordPair::isLearned)
                        .count();



        return new DictionaryGroupCardResponse(

                group.getId(),

                group.getName(),

                group.getDescription(),

                group.getSourceLanguage().getName(),

                group.getTargetLanguage().getName(),

                wordCount,

                learnedWordCount,

                group.getLastUsedAt(),

                toQuizSettingsResponse(group)

        );

    }


}