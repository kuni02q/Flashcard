package application.controller;


import application.dto.request.WordPairRequest;
import application.dto.response.WordPairResponse;
import application.model.WordPair;
import application.service.WordPairService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class WordPairController {

    private final WordPairService wordService;

    @GetMapping("/{groupId}/words")
    public List<WordPairResponse> words(
            @PathVariable Long groupId
    ){

        return wordService.getWords(groupId);

    }


    @PostMapping("/{groupId}/words")
    public WordPairResponse add(
            @PathVariable Long groupId,
            @RequestBody WordPairRequest request
    ){

        return wordService.addWord(
                groupId,
                request.getSourceWord(),
                request.getTargetWord(),
                request.getExampleSentence()
        );

    }


    @PutMapping("/words/{id}/learned")
    public void learned(
            @PathVariable Long id
    ){

        wordService.markLearned(id);

    }


}