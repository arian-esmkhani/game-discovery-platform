package admin.controller;

import admin.dto.*;
import admin.service.GenresService;
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
@RequestMapping("/api/genre")
@RequiredArgsConstructor
public class GenresController {

    private final GenresService genresService;
    private static final String SAFE_STRING_PATTERN = "^[a-zA-Z0-9\\s\\-_.]*$|^$";
    private static final long MAX_ID = 999_999_999L;

    @PostMapping("/{genreId}")
    public ResponseEntity<ApiResponse<Void>> deleteGenre(
            @PathVariable @Positive Long genreId) {

        if (genreId > MAX_ID) {
            log.warn("Suspicious genre id detected for deleting with ID: {}", genreId);
            throw new SecurityException("Invalid genre ID");
        }

        try {
            genresService.deleteGenre(genreId);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Genre deleted successfully",
                            null
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            "Error deleting Genre: " + e.getMessage(),
                            null
                    ));
        }
    }

    @PostMapping("/save")
    public ResponseEntity<ApiResponse<Void>> saveGenre(
            @Valid @RequestBody SaveDto saveGenreDto) {
        try {
            genresService.saveGenre(saveGenreDto);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Genre saved successfully",
                            null
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            "Error saving Genre: " + e.getMessage(),
                            null
                    ));
        }
    }

    @PostMapping("/update/{genreId}")
    public ResponseEntity<ApiResponse<Void>> updateGenre(
            @PathVariable @Positive Long genreId,
            @Valid @RequestBody SaveDto saveGenreDto) {

        if (genreId > MAX_ID) {
            log.warn("Suspicious genre id detected for updating with ID: {}", genreId);
            throw new SecurityException("Invalid genre ID");
        }

        try {
            genresService.updateGenre(saveGenreDto, genreId);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Genre update successfully",
                            null
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            "Error updating Genre: " + e.getMessage(),
                            null
                    ));
        }
    }

    @PostMapping("/get")
    public ResponseEntity<ApiResponse<Page<SearchDataDto>>> searchGenres (
            @Valid @RequestBody SearchRequestDto searchRequestDto)
    {

        if (searchRequestDto.name() != null && !searchRequestDto.name().matches(SAFE_STRING_PATTERN)) {
            log.warn("Security validation failed for search request");
            throw new SecurityException("Invalid Name");
        }

        try {
            Page<SearchDataDto> searchResponse = genresService.searchGenres(searchRequestDto);
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
                            "Error retrieving Genre: " + e.getMessage(),
                            null
                    ));
        }
    }

    @GetMapping("/getById/{genreId}")
    private ResponseEntity<ApiResponse<Optional<UpdateResponseDto>>> getGenreById (
            @PathVariable @Positive Long genreId)
    {

        if (genreId > MAX_ID) {
            log.warn("Suspicious genre id detected for get with ID: {}", genreId);
            throw new SecurityException("Invalid genre ID");
        }

        try {
            Optional<UpdateResponseDto> genre = genresService.getGenreById(genreId);

            if (genre.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(
                                false,
                                "Genre not found with ID: " + genre,
                                null
                        ));
            }

            return ResponseEntity.ok()
                    .body(new ApiResponse<>(
                            true,
                            "Genre retrieved successfully",
                            genre
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
