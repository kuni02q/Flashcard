package application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PublicDictionaryGroupCardResponse {

    private Long id;
    private String name;
    private String description;

    private String ownerName;

    private String sourceLanguage;
    private String targetLanguage;

    private int wordCount;
    private long viewCount;
    private long addCount;
}
