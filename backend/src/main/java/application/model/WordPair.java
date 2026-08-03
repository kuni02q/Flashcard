package application.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WordPair {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String sourceWord;

    @Column(nullable = false)
    private String targetWord;

    @Column(length = 1000)
    private String exampleSentence;

    private boolean learned = false;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private DictionaryGroup group;

}
