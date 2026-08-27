package application.service;


import application.dto.response.WordPairResponse;
import application.mapper.WordPairMapper;
import application.model.DictionaryGroup;
import application.model.User;
import application.model.WordPair;
import application.repository.DictionaryGroupRepository;
import application.repository.WordPairRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.List;



@Service
@RequiredArgsConstructor
public class WordPairService {


    private final WordPairRepository wordRepository;

    private final DictionaryGroupRepository groupRepository;

    private final WordPairMapper mapper;


    public List<WordPairResponse> getWords(Long groupId){


        return wordRepository.findByGroupId(groupId)
                .stream()
                .map(mapper::toResponse)
                .toList();

    }




    public WordPairResponse addWord(
            Long groupId,
            User user,
            String sourceWord,
            String targetWord,
            String exampleSentence
    ){


        DictionaryGroup group =
                groupRepository.findById(groupId)
                        .orElseThrow(() -> new RuntimeException("Group not found"));


        checkOwner(group, user);

        sourceWord = sourceWord.trim();
        targetWord = targetWord.trim();


        if (wordRepository.existsByGroupAndSourceWordAndTargetWord(
                group,
                sourceWord,
                targetWord
        )) {
            throw new RuntimeException("This word pair already exists in the group");
        }


        WordPair word =
                WordPair.builder()
                        .group(group)
                        .sourceWord(sourceWord)
                        .targetWord(targetWord)
                        .exampleSentence(exampleSentence)
                        .learned(false)
                        .build();



        return mapper.toResponse(wordRepository.save(word));

    }

    public WordPairResponse updateWord( Long id, User user, String sourceWord,
                                        String targetWord, String exampleSentence ) {

        WordPair word = wordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Word not found") );

        checkOwner(word.getGroup(), user);


        sourceWord = sourceWord.trim();
        targetWord = targetWord.trim();

        if (wordRepository.existsByGroupAndSourceWordAndTargetWordAndIdNot(
                word.getGroup(),
                sourceWord,
                targetWord,
                id
        )) {
            throw new RuntimeException("This word pair already exists in the group");
        }



        word.setSourceWord(sourceWord);
        word.setTargetWord(targetWord);
        word.setExampleSentence(exampleSentence);

        return mapper.toResponse(
                wordRepository.save(word)
        );
    }


    public WordPairResponse registerQuizAnswer(
            Long id,
            User user,
            boolean correct
    ) {

        WordPair word =
                wordRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Word not found"));

        checkOwner(word.getGroup(), user);

        word.setQuizCount(word.getQuizCount() + 1);

        if (correct) {
            word.setCorrectCount(word.getCorrectCount() + 1);
        }

        word.setThirdLastAnswerCorrect(word.getSecondLastAnswerCorrect());
        word.setSecondLastAnswerCorrect(word.getLastAnswerCorrect());
        word.setLastAnswerCorrect(correct);


        boolean perfectScore = word.getQuizCount() > 0 && word.getCorrectCount() == word.getQuizCount();

        boolean lastThreeCorrect =
                Boolean.TRUE.equals(word.getLastAnswerCorrect()) &&
                        Boolean.TRUE.equals(word.getSecondLastAnswerCorrect()) &&
                        Boolean.TRUE.equals(word.getThirdLastAnswerCorrect());

        word.setLearned(perfectScore || lastThreeCorrect);

        return mapper.toResponse(wordRepository.save(word));

    }





    public void delete(Long id, User user) {

        WordPair word =
                wordRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Word not found") );

        checkOwner(word.getGroup(), user);

        wordRepository.deleteById(id);

    }


    private void checkOwner( DictionaryGroup group, User user ) {
        if (!group.getUser().getId().equals(user.getId())) {
            throw new RuntimeException( "You are not the owner" );
        }
    }


}