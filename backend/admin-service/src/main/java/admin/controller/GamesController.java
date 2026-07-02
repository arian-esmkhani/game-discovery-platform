package admin.controller;

import admin.dto.*;
import admin.service.GameService;
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
@RequestMapping("/api/game")
@RequiredArgsConstructor
public class GamesController {

    private final GameService gameService;
    private static final String SAFE_STRING_PATTERN = "^[a-zA-Z0-9\\s\\-_.]*$|^$";
    private static final long MAX_ID = 999_999_999L;

    @PostMapping("/{gameId}")
    public ResponseEntity<ApiResponse<Void>> deleteGame(
            @PathVariable @Positive Long gameId) {

        if (gameId > MAX_ID) {
            log.warn("Suspicious game id detected for deleting with ID: {}", gameId);
            throw new SecurityException("Invalid game ID");
        }

        try {
            gameService.deleteGame(gameId);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Game deleted successfully",
                            null
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            "Error deleting Game: " + e.getMessage(),
                            null
                    ));
        }
    }

    @PostMapping("/save")
    public ResponseEntity<ApiResponse<Void>> saveGame (
            @Valid @RequestBody SaveGameDto saveGameDto) {
        try {
            gameService.saveGame(saveGameDto);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Game saved successfully",
                            null
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            "Error saving Game: " + e.getMessage(),
                            null
                    ));
        }
    }

    @PostMapping("/update/{gameId}")
    public ResponseEntity<ApiResponse<Void>> updateGame(
            @PathVariable @Positive Long gameId,
            @Valid @RequestBody SaveGameDto saveGameDto) {

        if (gameId > MAX_ID) {
            log.warn("Suspicious game id detected for updating with ID: {}", gameId);
            throw new SecurityException("Invalid game ID");
        }

        try {
            gameService.updateGame(saveGameDto, gameId);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Game update successfully",
                            null
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            "Error updating Game: " + e.getMessage(),
                            null
                    ));
        }
    }

    @PostMapping("/get")
    public ResponseEntity<ApiResponse<Page<SearchDataDto>>> searchGames(
            @Valid @RequestBody SearchRequestDto searchRequestDto)
    {

        if (searchRequestDto.name() != null && !searchRequestDto.name().matches(SAFE_STRING_PATTERN)) {
            log.warn("Security validation failed for search request");
            throw new SecurityException("Invalid Name");
        }

        try {
            Page<SearchDataDto> searchResponse = gameService.searchGame(searchRequestDto);
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
                            "Error retrieving Data: " + e.getMessage(),
                            null
                    ));
        }
    }

    @GetMapping("/getById/{gameId}")
    private ResponseEntity<ApiResponse<Optional<GameResponseDto>>> getGameById (
            @PathVariable @Positive Long gameId)
    {
        if (gameId > MAX_ID) {
            log.warn("Suspicious game id detected for get by ID: {}", gameId);
            throw new SecurityException("Invalid game ID");
        }

        try {
            Optional<GameResponseDto> game = gameService.getGameById(gameId);

            if (game.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(
                                false,
                                "Game not found with ID: " + gameId,
                                null
                        ));
            }

            return ResponseEntity.ok()
                    .body(new ApiResponse<>(
                            true,
                            "Game retrieved successfully",
                            game
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