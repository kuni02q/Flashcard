package application.repository;

import application.model.DictionaryGroup;
import application.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DictionaryGroupRepository extends JpaRepository<DictionaryGroup, Long> {

    List<DictionaryGroup> findByUser(User user);

    List<DictionaryGroup> findByVisibility(
            DictionaryGroup.Visibility visibility
    );

    List<DictionaryGroup> findByUserAndVisibility(
            User user,
            DictionaryGroup.Visibility visibility);

    List<DictionaryGroup> findByVisibilityAndUserNot(
            DictionaryGroup.Visibility visibility,
            User user
    );

}
