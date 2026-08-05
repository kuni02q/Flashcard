package application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ImportPreviewResponse {

    private int totalRows;

    private int validRows;

    private int duplicateRows;

    private int invalidRows;

    private List<ImportPreviewRowResponse> rows;

}