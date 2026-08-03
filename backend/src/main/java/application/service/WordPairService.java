package application.service;


import application.dto.response.WordPairResponse;
import application.mapper.WordPairMapper;
import application.model.DictionaryGroup;
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
            String sourceWord,
            String targetWord,
            String exampleSentence
    ){


        DictionaryGroup group =
                groupRepository.findById(groupId)
                        .orElseThrow(() -> new RuntimeException("Group not found"));


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





    public void markLearned(Long id){


        WordPair word =
                wordRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Word not found")
                        );


        word.setLearned(true);


        wordRepository.save(word);

    }





    public void delete(Long id){

        wordRepository.deleteById(id);

    }

}