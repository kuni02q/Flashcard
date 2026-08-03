package application.service;


import application.dto.response.LanguageResponse;
import application.mapper.LanguageMapper;
import application.model.Language;
import application.repository.LanguageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class LanguageService {


    private final LanguageRepository languageRepository;

    private final LanguageMapper mapper;



    public List<LanguageResponse> getAllLanguages(){

        return languageRepository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();

    }



    public Language getLanguageById(Long id){

        return languageRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Language not found")
                );

    }



    public LanguageResponse createLanguage(String name){

        if(languageRepository.existsByName(name)){
            throw new RuntimeException("Language already exists");
        }


        Language language = Language.builder()
                .name(name)
                .build();


        return mapper.toResponse(languageRepository.save(language));

    }



    public void deleteLanguage(Long id){

        Language language = getLanguageById(id);

        languageRepository.delete(language);

    }

}