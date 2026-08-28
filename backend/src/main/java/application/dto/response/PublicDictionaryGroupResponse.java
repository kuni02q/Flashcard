package application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PublicDictionaryGroupResponse {

    private Long id;
    private String name;
    private String description;

    private String ownerName;

    private String sourceLanguage;
    private String targetLanguage;

    private List<WordPairResponse> words;

    private int wordCount;
    private long viewCount;
    private long addCount;
}