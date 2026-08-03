package application.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Language {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "sourceLanguage")
    @Builder.Default
    private List<DictionaryGroup> sourceGroups = new ArrayList<>();


    @OneToMany(mappedBy = "targetLanguage")
    @Builder.Default
    private List<DictionaryGroup> targetGroups = new ArrayList<>();


}
