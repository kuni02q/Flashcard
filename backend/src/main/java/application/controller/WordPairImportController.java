package application.controller;

import application.dto.response.ImportPreviewResponse;
import application.model.User;
import application.repository.UserRepository;
import application.service.WordPairImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class WordPairImportController {

    private final WordPairImportService importService;

    private final UserRepository userRepository;


    @PostMapping("/{groupId}/words/import/preview")
    public ResponseEntity<?> preview(
            @PathVariable Long groupId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {

        try {

            User user = getUser(authentication);
            ImportPreviewResponse response =
                    importService.previewCsv(
                            groupId,
                            user,
                            file
                    );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));

        }

    }


    @PostMapping("/{groupId}/words/import")
    public ResponseEntity<?> importWords(
            @PathVariable Long groupId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {

        try {

            User user = getUser(authentication);

            importService.importCsv(
                    groupId,
                    user,
                    file
            );

            return ResponseEntity.ok().build();

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));

        }

    }


    private User getUser(
            Authentication authentication
    ) {

        return userRepository
                .findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

    }


    private record ErrorResponse(String message) {
    }

}