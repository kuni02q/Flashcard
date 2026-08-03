package application.service;


import application.dto.response.DictionaryGroupResponse;
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
            Long targetLanguageId
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
                        .visibility(DictionaryGroup.Visibility.PRIVATE)
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
            String description,
            DictionaryGroup.Visibility visibility
    ){


        DictionaryGroup group = getEntity(id);


        checkOwner(group,user);


        group.setName(name);

        group.setDescription(description);

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


}