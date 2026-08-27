package application.controller;


import application.dto.request.QuizAnswerRequest;
import application.dto.request.WordPairRequest;
import application.dto.response.WordPairResponse;
import application.model.User;
import application.repository.UserRepository;
import application.service.WordPairService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class WordPairController {

    private final WordPairService wordService;

    private final UserRepository userRepository;

    @GetMapping("/{groupId}/words")
    public List<WordPairResponse> words(
            @PathVariable Long groupId
    ){

        return wordService.getWords(groupId);

    }


    @PostMapping("/{groupId}/words")
    public WordPairResponse add(
            @PathVariable Long groupId,
            Authentication authentication,
            @RequestBody WordPairRequest request
    ){

        User user = getUser(authentication);

        return wordService.addWord(
                groupId,
                user,
                request.getSourceWord(),
                request.getTargetWord(),
                request.getExampleSentence()
        );

    }


    @PutMapping("/words/{id}")
    public WordPairResponse update(
            @PathVariable Long id,
            Authentication authentication,
            @RequestBody WordPairRequest request
    ){
        User user = getUser(authentication);

        return wordService.updateWord(
                id,
                user,
                request.getSourceWord(),
                request.getTargetWord(),
                request.getExampleSentence()
        );
    }
    


    @PostMapping("/words/{id}/quiz-answer")
    public WordPairResponse quizAnswer(
            @PathVariable Long id,
            Authentication authentication,
            @RequestBody QuizAnswerRequest request
    ) {

        User user = getUser(authentication);

        return wordService.registerQuizAnswer(
                id,
                user,
                request.isCorrect()
        );

    }


    @DeleteMapping("/words/{id}")
    public void delete(
            @PathVariable Long id,
            Authentication authentication
    ){

        User user = getUser(authentication);
        wordService.delete(id, user);

    }


    private User getUser(
            Authentication authentication
    ){
        return userRepository
                .findByUsername(authentication.getName())
                .orElseThrow(() ->
                                new RuntimeException("User not found"));
    }


}