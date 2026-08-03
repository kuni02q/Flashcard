package application.model;

import jakarta.persistence.*;
import lombok.*;

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
    private List<DictionaryGroup> sourceGroups;


    @OneToMany(mappedBy = "targetLanguage")
    private List<DictionaryGroup> targetGroups;


}
