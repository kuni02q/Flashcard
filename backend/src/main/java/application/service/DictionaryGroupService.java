package application.service;


import application.dto.request.QuizSettingsRequest;
import application.dto.response.DictionaryGroupCardResponse;
import application.dto.response.DictionaryGroupResponse;
import application.dto.response.QuizSettingsResponse;
import application.mapper.DictionaryGroupMapper;
import application.model.DictionaryGroup;
import application.model.Language;
import application.model.User;
import application.repository.DictionaryGroupRepository;
import application.repository.LanguageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.List;



@Service
@RequiredArgsConstructor
public class DictionaryGroupService {


    private final DictionaryGroupRepository groupRepository;

    private final LanguageRepository languageRepository;

    private final DictionaryGroupMapper mapper;



    public List<DictionaryGroupResponse> getMyGroups(User user){

        return groupRepository.findByUser(user)
                .stream()
                .map(mapper::toResponse)
                .toList();

    }


    public List<DictionaryGroupCardResponse> getMyGroupCards(User user){

        return groupRepository.findByUser(user)
                .stream()
                .map(mapper::toCardResponse)
                .toList();

    }



    public List<DictionaryGroupResponse> getPublicGroups(){

        return groupRepository.findByVisibility(DictionaryGroup.Visibility.PUBLIC)
                .stream()
                .map(mapper::toResponse)
                .toList();

    }




    public DictionaryGroupResponse createGroup(
            User user,
            String name,
            String description,
            Long sourceLanguageId,
            Long targetLanguageId,
            DictionaryGroup.Visibility visibility
    ){


        Language sourceLanguage =
                languageRepository.findById(sourceLanguageId)
                        .orElseThrow(() ->
                                new RuntimeException("Source language not found")
                        );


        Language targetLanguage =
                languageRepository.findById(targetLanguageId)
                        .orElseThrow(() ->
                                new RuntimeException("Target language not found")
                        );



        DictionaryGroup group =
                DictionaryGroup.builder()
                        .user(user)
                        .name(name)
                        .description(description)
                        .sourceLanguage(sourceLanguage)
                        .targetLanguage(targetLanguage)
                        .visibility(visibility == null ? DictionaryGroup.Visibility.PRIVATE : visibility)
                        .build();

        DictionaryGroup saved = groupRepository.save(group);

        return mapper.toResponse(saved);

    }




    public DictionaryGroupResponse getById(Long id){

        DictionaryGroup group = groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        return mapper.toResponse(group);

    }


    public DictionaryGroupResponse updateGroup(
            Long id,
            User user,
            String name,
            String description
    ){


        DictionaryGroup group = getEntity(id);


        checkOwner(group,user);


        if (name == null || name.isBlank()) {
            throw new RuntimeException("Group name is required");
        }

        group.setName(name.trim());

        group.setDescription(description == null || description.isBlank() ? null : description.trim());



        return mapper.toResponse(groupRepository.save(group));

    }


    public DictionaryGroupResponse updateVisibility(
            Long id,
            User user,
            DictionaryGroup.Visibility visibility
    ) {
        DictionaryGroup group = getEntity(id);
        checkOwner(group, user);

        if (visibility == null) {
            throw new RuntimeException("Visibility is required");
        }

        group.setVisibility(visibility);

        return mapper.toResponse(groupRepository.save(group));
    }



    public void deleteGroup(
            Long id,
            User user
    ){
        DictionaryGroup group = getEntity(id);

        checkOwner(group,user);

        groupRepository.delete(group);

    }


    public DictionaryGroupResponse updateQuizSettings(
            Long id,
            User user,
            QuizSettingsRequest request
    ) {

        DictionaryGroup group = getEntity(id);

        checkOwner(group, user);


        if (request.getMode() == null) {
            throw new RuntimeException("Quiz mode is required");
        }

        if (request.getDirection() == null) {
            throw new RuntimeException("Quiz direction is required");
        }

        if (request.getWordCount() < 1) {
            throw new RuntimeException("Word count must be at least 1");
        }


        if (request.getWordCount() > group.getWords().size()) {
            throw new RuntimeException("Word count cannot exceed the number of words in the group");
        }


        group.setQuizMode(request.getMode());
        group.setQuizWordCount(request.getWordCount());
        group.setQuizDirection(request.getDirection());


        DictionaryGroup saved =
                groupRepository.save(group);

        return mapper.toResponse(saved);

    }


    private DictionaryGroup getEntity(Long id){

        return groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group not found"));

    }


    private void checkOwner(
            DictionaryGroup group,
            User user
    ){

        if(!group.getUser().getId()
                .equals(user.getId())){


            throw new RuntimeException("You are not the owner");

        }

    }


    public DictionaryGroupResponse completeQuiz(
            Long id,
            User user
    ) {

        DictionaryGroup group = getEntity(id);

        checkOwner(group, user);

        group.setLastUsedAt(java.time.LocalDateTime.now());

        DictionaryGroup saved = groupRepository.save(group);

        return mapper.toResponse(saved);

    }


}