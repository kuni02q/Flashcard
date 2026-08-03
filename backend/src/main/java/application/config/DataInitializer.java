package application.config;


import application.model.Language;
import application.repository.LanguageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;


import java.util.List;


@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {


    private final LanguageRepository languageRepository;



    @Override
    public void run(String... args) {


        if(languageRepository.count() == 0){


            List<String> languages = List.of(
                    "English",
                    "Hungarian",
                    "German",
                    "Spanish",
                    "French",
                    "Italian",
                    "Portuguese",
                    "Polish",
                    "Czech",
                    "Slovak",
                    "Romanian",
                    "Russian",
                    "Chinese",
                    "Japanese",
                    "Korean",
                    "Arabic"
            );


            languages.forEach(name ->

                    languageRepository.save(
                            Language.builder()
                                    .name(name)
                                    .build()
                    )

            );

        }


    }

}