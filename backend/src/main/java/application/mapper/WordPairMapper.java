package application.mapper;


import application.dto.response.WordPairResponse;
import application.model.WordPair;
import org.springframework.stereotype.Component;


@Component
public class WordPairMapper {



    public WordPairResponse toResponse(WordPair word){


        return new WordPairResponse(

                word.getId(),

                word.getSourceWord(),

                word.getTargetWord(),

                word.getExampleSentence(),

                word.isLearned(),

                word.getQuizCount(),

                word.getCorrectCount()

        );

    }


}