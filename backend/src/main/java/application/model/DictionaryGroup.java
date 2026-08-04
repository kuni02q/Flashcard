package application.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DictionaryGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Visibility visibility;

    private boolean completed = false;

    private LocalDateTime createdAt;

    private LocalDateTime lastUsedAt;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private QuizMode quizMode = QuizMode.ONCE;


    @Column(nullable = false)
    @Builder.Default
    private int quizWordCount = 10;


    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "source_language_id", nullable = false)
    private Language sourceLanguage;

    @ManyToOne
    @JoinColumn(name = "target_language_id", nullable = false)
    private Language targetLanguage;

    @OneToMany(
            mappedBy = "group",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<WordPair> words = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }

    public enum Visibility {
        PRIVATE,
        PUBLIC
    }

    public enum QuizMode {
        ONCE,
        UNTIL_CORRECT
    }





}
