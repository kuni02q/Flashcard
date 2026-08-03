package application.controller;


import application.dto.request.LanguageRequest;
import application.dto.response.LanguageResponse;
import application.model.Language;
import application.service.LanguageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/languages")
@RequiredArgsConstructor
public class LanguageController {

    private final LanguageService languageService;

    @GetMapping
    public List<LanguageResponse> getAll(){

        return languageService.getAllLanguages();

    }


    @PostMapping
    public LanguageResponse create(
            @RequestBody LanguageRequest request
    ){

        return languageService.createLanguage(
                request.getName()
        );

    }


}