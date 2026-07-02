package main.controller;

import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import main.dto.ApiResponse;
import main.dto.DataDto;
import main.service.IndependencyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@Slf4j
@Validated
@RestController
@RequestMapping("/api/independency")
@RequiredArgsConstructor
public class IndependencyController {

    private final IndependencyService independencyService;

    @GetMapping("/by/{characterId}")
    public ResponseEntity<ApiResponse<Optional<DataDto>>> fineCharacterById(
            @PathVariable @Positive Long characterId
    ) {

        if (characterId > 999_999_999L) {
            log.warn("Suspicious character ID detected: {}", characterId);
            throw new SecurityException("Invalid game ID");
        }

        try {
            Optional<DataDto> character = independencyService.fineCharacterById(characterId);
            if (character.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        new ApiResponse<>(
                                false,
                                "Character not found",
                                null
                        ));
            }

            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Data retrieved successfully",
                            character
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            "Error retrieving data: " + e.getMessage(),
                            null
                    ));
        }
    }

    @GetMapping("/by/{companyId}")
    public ResponseEntity<ApiResponse<Optional<DataDto>>> fineCompanyById(
            @PathVariable @Positive Long companyId
    ) {

        if (companyId > 999_999_999L) {
            log.warn("Suspicious company ID detected: {}", companyId);
            throw new SecurityException("Invalid game ID");
        }

        try {
            Optional<DataDto> company = independencyService.fineCompanyById(companyId);
            if (company.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        new ApiResponse<>(
                                false,
                                "Company not found",
                                null
                        ));
            }

            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Data retrieved successfully",
                            company
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            "Error retrieving data: " + e.getMessage(),
                            null
                    ));
        }
    }
}
