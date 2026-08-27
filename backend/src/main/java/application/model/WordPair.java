package application.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "group_id",
                                "source_word",
                                "target_word"
                        }
                )
        }
)
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

    @Column(nullable = false)
    @Builder.Default
    private int quizCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private int correctCount = 0;

    @Column
    private Boolean lastAnswerCorrect;

    @Column
    private Boolean secondLastAnswerCorrect;

    @Column
    private Boolean thirdLastAnswerCorrect;


    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private DictionaryGroup group;

}
