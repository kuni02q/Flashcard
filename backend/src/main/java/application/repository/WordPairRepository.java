package application.repository;

import application.model.DictionaryGroup;
import application.model.WordPair;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WordPairRepository extends JpaRepository<WordPair, Long> {

    List<WordPair> findByGroup(DictionaryGroup group);

    List<WordPair> findByGroupId(Long groupId);

    List<WordPair> findByGroupAndLearned(
            DictionaryGroup group,
            boolean learned
    );

    boolean existsByGroupAndSourceWordAndTargetWord(
            DictionaryGroup group,
            String sourceWord,
            String targetWord
    );

    boolean existsByGroupAndSourceWordAndTargetWordAndIdNot(
            DictionaryGroup group,
            String sourceWord,
            String targetWord,
            Long id
    );


}
