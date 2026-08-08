package application.service;

import application.dto.imports.WordPairImportRow;
import application.dto.response.ImportPreviewResponse;
import application.dto.response.ImportPreviewRowResponse;
import application.model.DictionaryGroup;
import application.model.User;
import application.model.WordPair;
import application.repository.DictionaryGroupRepository;
import application.repository.WordPairRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.io.ByteArrayInputStream;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class WordPairImportService {

    private final DictionaryGroupRepository groupRepository;

    private final WordPairRepository wordPairRepository;


    public ImportPreviewResponse previewCsv(
            Long groupId,
            User user,
            MultipartFile file,
            boolean hasHeader
    ) {

        DictionaryGroup group =
                groupRepository.findById(groupId).orElseThrow(() -> new RuntimeException("Group not found"));

        checkOwner(group, user);

        validateFile(file);

        try (
                CSVParser parser = createParser(file, hasHeader)
        ) {

            List<WordPairImportRow> importRows = parseCsv(parser, hasHeader);

            return createPreview(
                    importRows,
                    group
            );

        } catch (IOException e) {

            throw new RuntimeException("CSV file processing failed", e);

        }

    }


    public void importCsv(
            Long groupId,
            User user,
            MultipartFile file,
            boolean hasHeader
    ) {

        DictionaryGroup group =
                groupRepository.findById(groupId).orElseThrow(() -> new RuntimeException("Group not found"));

        checkOwner(group, user);

        validateFile(file);

        try (
                CSVParser parser = createParser(file, hasHeader)
        ) {

            List<WordPairImportRow> importRows = parseCsv(parser, hasHeader);

            Set<String> existingPairs = new HashSet<>();

            for (WordPair word : group.getWords()) {

                existingPairs.add(
                        createPairKey(
                                word.getSourceWord(),
                                word.getTargetWord()
                        )
                );

            }


            Set<String> importedPairs = new HashSet<>();


            List<WordPair> wordsToSave = new ArrayList<>();


            for (WordPairImportRow row : importRows) {

                if (row.getSourceWord().isBlank()
                        || row.getTargetWord().isBlank()) {

                    continue;

                }


                String key =
                        createPairKey(
                                row.getSourceWord(),
                                row.getTargetWord()
                        );


                if (existingPairs.contains(key)) {
                    continue;
                }


                if (importedPairs.contains(key)) {
                    continue;
                }


                importedPairs.add(key);


                WordPair word =
                        WordPair.builder()
                                .group(group)
                                .sourceWord(row.getSourceWord())
                                .targetWord(row.getTargetWord())
                                .exampleSentence(
                                        row.getExampleSentence()
                                )
                                .learned(false)
                                .build();


                wordsToSave.add(word);

            }


            wordPairRepository.saveAll(wordsToSave);

        } catch (IOException e) {

            throw new RuntimeException("CSV file processing failed", e);

        }

    }


    private List<WordPairImportRow> parseCsv(
            CSVParser parser,
            boolean hasHeader
    ) {

        List<WordPairImportRow> rows =
                new ArrayList<>();


        for (CSVRecord record : parser) {

            String sourceWord = hasHeader
                    ? getValue(record, "sourceWord", true)
                    : getValue(record, 0, true);

            String targetWord = hasHeader
                    ? getValue(record, "targetWord", true)
                    : getValue(record, 1, true);

            String exampleSentence = hasHeader
                    ? getValue(record, "exampleSentence", false)
                    : getValue(record, 2, false);


            rows.add(
                    new WordPairImportRow(
                            sourceWord,
                            targetWord,
                            exampleSentence
                    )
            );

        }


        return rows;

    }


    private ImportPreviewResponse createPreview(
            List<WordPairImportRow> importRows,
            DictionaryGroup group
    ) {

        List<ImportPreviewRowResponse> rows = new ArrayList<>();


        Set<String> importedPairs = new HashSet<>();


        Set<String> existingPairs = new HashSet<>();


        for (WordPair word : group.getWords()) {

            existingPairs.add(
                    createPairKey(
                            word.getSourceWord(),
                            word.getTargetWord()
                    )
            );

        }


        int rowNumber = 1;


        for (WordPairImportRow importRow : importRows) {

            String sourceWord = importRow.getSourceWord();

            String targetWord = importRow.getTargetWord();

            String exampleSentence = importRow.getExampleSentence();


            if (sourceWord.isBlank()
                    || targetWord.isBlank()) {

                rows.add(
                        new ImportPreviewRowResponse(
                                rowNumber,
                                sourceWord,
                                targetWord,
                                exampleSentence,
                                "INVALID",
                                "A forrás- és célnyelvi szó kötelező."
                        )
                );

                rowNumber++;
                continue;
            }


            String key =
                    createPairKey(
                            sourceWord,
                            targetWord
                    );


            if (existingPairs.contains(key)) {

                rows.add(
                        new ImportPreviewRowResponse(
                                rowNumber,
                                sourceWord,
                                targetWord,
                                exampleSentence,
                                "DUPLICATE",
                                "Ez a szópár már szerepel a csoportban."
                        )
                );

                rowNumber++;
                continue;
            }


            if (importedPairs.contains(key)) {

                rows.add(
                        new ImportPreviewRowResponse(
                                rowNumber,
                                sourceWord,
                                targetWord,
                                exampleSentence,
                                "DUPLICATE",
                                "Ez a szópár az importfájlban már korábban szerepelt."
                        )
                );

                rowNumber++;
                continue;
            }


            importedPairs.add(key);


            rows.add(
                    new ImportPreviewRowResponse(
                            rowNumber,
                            sourceWord,
                            targetWord,
                            exampleSentence,
                            "VALID",
                            null
                    )
            );


            rowNumber++;

        }


        int validRows =
                (int) rows.stream()
                        .filter(row ->
                                row.getStatus().equals("VALID")
                        )
                        .count();


        int duplicateRows =
                (int) rows.stream()
                        .filter(row ->
                                row.getStatus().equals("DUPLICATE")
                        )
                        .count();


        int invalidRows =
                (int) rows.stream()
                        .filter(row ->
                                row.getStatus().equals("INVALID")
                        )
                        .count();


        return new ImportPreviewResponse(
                rows.size(),
                validRows,
                duplicateRows,
                invalidRows,
                rows
        );

    }


    private String getValue(
            CSVRecord record,
            String column,
            boolean required
    ) {

        if (!record.isMapped(column)) {

            if (required) {

                throw new RuntimeException("Hiányzó CSV oszlop: " + column + ". Elvárt oszlopok: sourceWord;targetWord;exampleSentence");

            }

            return "";

        }


        String value = record.get(column);

        if (value == null) {
            return "";
        }


        return value.trim();

    }



    private String getValue(
            CSVRecord record,
            int index,
            boolean required
    ) {

        if (!record.isSet(index)) {

            if (required) {
                throw new RuntimeException("Missing required column. Expected: sourceWord;targetWord;exampleSentence");
            }

            return "";

        }

        return record.get(index).trim();

    }

    private CSVParser createParser(
            MultipartFile file,
            boolean hasHeader
    ) throws IOException {

        CSVFormat.Builder format = CSVFormat.DEFAULT.builder()
                .setDelimiter(';')
                .setIgnoreEmptyLines(true)
                .setTrim(true);

        if (hasHeader) {
            format.setHeader().setSkipHeaderRecord(true);
        }

        return format.build().parse(createReader(file));

    }

    private Reader createReader(MultipartFile file
    ) throws IOException {

        byte[] bytes = file.getBytes();

        int offset = 0;

        // UTF-8 BOM: EF BB BF
        if (bytes.length >= 3
                && (bytes[0] & 0xFF) == 0xEF
                && (bytes[1] & 0xFF) == 0xBB
                && (bytes[2] & 0xFF) == 0xBF) {

            offset = 3;
        }

        return new InputStreamReader(
                new ByteArrayInputStream(
                        bytes,
                        offset,
                        bytes.length - offset
                ),
                StandardCharsets.UTF_8
        );
    }




    private void validateFile(
            MultipartFile file
    ) {

        if (file == null || file.isEmpty()) {

            throw new RuntimeException("The uploaded file is empty");

        }

    }


    private String createPairKey(
            String sourceWord,
            String targetWord
    ) {

        return sourceWord.trim()
                + "\u0000"
                + targetWord.trim();

    }


    private void checkOwner(
            DictionaryGroup group,
            User user
    ) {

        if (!group.getUser().getId()
                .equals(user.getId())) {

            throw new RuntimeException("You are not the owner");

        }

    }

}
