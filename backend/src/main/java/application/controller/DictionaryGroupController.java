package application.controller;


import application.dto.request.QuizSettingsRequest;
import application.dto.request.UpdateGroupVisibilityRequest;
import application.dto.response.DictionaryGroupCardResponse;
import application.dto.response.DictionaryGroupResponse;
import application.model.User;
import application.repository.UserRepository;
import application.service.DictionaryGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import application.dto.request.CreateGroupRequest;
import application.dto.request.UpdateGroupRequest;

import java.util.List;



@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class DictionaryGroupController {

    private final DictionaryGroupService groupService;

    private final UserRepository userRepository;


    @GetMapping("/public")
    public List<DictionaryGroupResponse> publicGroups(){

        return groupService.getPublicGroups();

    }


    @GetMapping("/my")
    public List<DictionaryGroupResponse> myGroups(Authentication authentication){
        User user = getUser(authentication);

        return groupService.getMyGroups(user);

    }


    @GetMapping("/my/cards")
    public List<DictionaryGroupCardResponse> myGroupCards(Authentication authentication){
        User user = getUser(authentication);

        return groupService.getMyGroupCards(user);

    }


    @GetMapping("/{id}")
    public DictionaryGroupResponse getById(
            @PathVariable Long id
    ){

        return groupService.getById(id);

    }


    @PostMapping
    public DictionaryGroupResponse create(
            Authentication authentication,
            @RequestBody CreateGroupRequest request
    ){

        User user = getUser(authentication);

        return groupService.createGroup(

                user,
                request.getName(),
                request.getDescription(),
                request.getSourceLanguageId(),
                request.getTargetLanguageId(),
                request.getVisibility()
        );

    }


    @PutMapping("/{id}")
    public DictionaryGroupResponse update(
            @PathVariable Long id,
            Authentication authentication,
            @RequestBody UpdateGroupRequest request
    ){

        User user = getUser(authentication);

        return groupService.updateGroup(

                id,
                user,
                request.getName(),
                request.getDescription()
        );

    }


    @PatchMapping("/{id}/visibility")
    public DictionaryGroupResponse updateVisibility(
            @PathVariable Long id,
            Authentication authentication,
            @RequestBody UpdateGroupVisibilityRequest request
    ) {
        User user = getUser(authentication);

        return groupService.updateVisibility(
                id,
                user,
                request.getVisibility()
        );
    }


    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id,
            Authentication authentication
    ){
        User user = getUser(authentication);

        groupService.deleteGroup(id, user);

    }


    @PutMapping("/{id}/quiz-settings")
    public DictionaryGroupResponse updateQuizSettings(
            @PathVariable Long id,
            Authentication authentication,
            @RequestBody QuizSettingsRequest request
    ) {

        User user = getUser(authentication);

        return groupService.updateQuizSettings(
                id,
                user,
                request
        );

    }


    @PostMapping("/{id}/quiz-completed")
    public DictionaryGroupResponse completeQuiz(
            @PathVariable Long id,
            Authentication authentication
    ) {

        User user = getUser(authentication);

        return groupService.completeQuiz(
                id,
                user
        );

    }



    private User getUser(Authentication authentication){

        return userRepository.findByUsername(
                        authentication.getName()
                )

                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

    }


}