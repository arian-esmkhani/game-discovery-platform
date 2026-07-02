package admin.controller;

import admin.dto.*;
import admin.model.Characters;
import admin.service.CharactersService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Slf4j
@Validated
@RestController
@RequestMapping("/api/character")
@RequiredArgsConstructor
public class CharacterController {

    private final CharactersService charactersService;
    private static final String SAFE_STRING_PATTERN = "^[a-zA-Z0-9\\s\\-_.]*$|^$";
    private static final long MAX_ID = 999_999_999L;

    @PostMapping("/{characterId}")
    public ResponseEntity<ApiResponse<Void>> deleteCharacter(
            @PathVariable @Positive Long characterId) {

        if (characterId > MAX_ID) {
            log.warn("Suspicious character id detected for deleting with ID: {}", characterId);
            throw new SecurityException("Invalid character ID");
        }

        try {
            charactersService.deleteCharacter(characterId);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Character deleted successfully",
                            null
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            "Error deleting Character: " + e.getMessage(),
                            null
                    ));
        }
    }

    @PostMapping("/save")
    public ResponseEntity<ApiResponse<Void>> saveCharacter(
            @Valid @RequestBody SaveDto saveCharacterDto) {
        try {
            charactersService.saveCharacter(saveCharacterDto);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Character saved successfully",
                            null
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            "Error saving Character: " + e.getMessage(),
                            null
                    ));
        }
    }

    @PostMapping("/update/{characterId}")
    public ResponseEntity<ApiResponse<Void>> updateCharacter (
            @PathVariable @Positive Long characterId,
            @Valid @RequestBody SaveDto saveCharacterDto) {

        if (characterId > MAX_ID) {
            log.warn("Suspicious character id detected for updating with ID: {}", characterId);
            throw new SecurityException("Invalid character ID");
        }

        try {
            charactersService.updateCharacter(saveCharacterDto, characterId);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Character update successfully",
                            null
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            "Error updating Character: " + e.getMessage(),
                            null
                    ));
        }
    }

    @PostMapping("/get")
    public ResponseEntity<ApiResponse<Page<SearchDataDto>>> searchCharacter (
            @Valid @RequestBody SearchRequestDto searchRequestDto)
    {

        if (searchRequestDto.name() != null && !searchRequestDto.name().matches(SAFE_STRING_PATTERN)) {
            log.warn("Security validation failed for search request");
            throw new SecurityException("Invalid Name");
        }

        try {
            Page<SearchDataDto> searchResponse = charactersService.searchCharacters(searchRequestDto);
            if (searchResponse.isEmpty()) {
                return ResponseEntity.ok(
                        new ApiResponse<>(
                                false,
                                "not found",
                                null
                        ));
            }

            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Data retrieved successfully",
                            searchResponse
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            "Error retrieving Character: " + e.getMessage(),
                            null
                    ));
        }
    }

    @GetMapping("/getById/{characterId}")
    private ResponseEntity<ApiResponse<Optional<UpdateResponseDto>>> getCharacterById (
            @PathVariable @Positive Long characterId)
    {

        if (characterId > MAX_ID) {
            log.warn("Suspicious character id detected for get with ID: {}", characterId);
            throw new SecurityException("Invalid character ID");
        }

        try {
            Optional<UpdateResponseDto> character = charactersService.getCharacterById(characterId);

            if (character.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(
                                false,
                                "Character not found with ID: " + characterId,
                                null
                        ));
            }

            return ResponseEntity.ok()
                    .body(new ApiResponse<>(
                            true,
                            "Character retrieved successfully",
                            character
                    ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            "Error retrieving Data: " + e.getMessage(),
                            null
                    ));
        }
    }
}