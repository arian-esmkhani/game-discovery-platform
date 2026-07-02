package main.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import main.dto.ApiResponse;
import main.dto.GameDataResponseDto;
import main.dto.DataDto;
import main.dto.SearchRequestDto;
import main.service.GameService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Slf4j
@Validated
@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;
    private static final String SAFE_STRING_PATTERN = "^[a-zA-Z0-9\\s\\-_.]*$|^$";
    private static final long MAX_ID = 999_999_999L;

    @GetMapping("/by/{gameId}")
    public ResponseEntity<ApiResponse<Optional<GameDataResponseDto>>> GetGameById(
            @PathVariable @Positive Long gameId
    ) {

        if (gameId > MAX_ID) {
            log.warn("Suspicious game ID detected: {}", gameId);
            throw new SecurityException("Invalid game ID");
        }

        try {
            Optional<GameDataResponseDto> game = gameService.getGameData(gameId);
            if (game.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        new ApiResponse<>(
                                false,
                                "Game not found",
                                null
                        ));
            }

            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Data retrieved successfully",
                            game
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

    @PostMapping("/search")
    public ResponseEntity<ApiResponse<List<DataDto>>> searchGames(
            @Valid @RequestBody SearchRequestDto searchRequestDto)
    {

        if (searchRequestDto.gameName() != null && !searchRequestDto.gameName().matches(SAFE_STRING_PATTERN)) {
            log.warn("Security validation failed for search request");
            throw new SecurityException("Invalid game Name");
        }

        if (searchRequestDto.companyName() != null && !searchRequestDto.companyName().matches(SAFE_STRING_PATTERN)) {
            log.warn("Security validation failed for search request");
            throw new SecurityException("Invalid game ID");
        }

        if (searchRequestDto.genreId() != null) {
            if (searchRequestDto.genreId() < 1 || searchRequestDto.genreId() > 6) {
                log.warn("Security validation failed for search request: Invalid genre ID {}", searchRequestDto.genreId());
                throw new SecurityException("Invalid genre ID");
            }
        }

        try {
            List<DataDto> searchResponse = gameService.searchGame(searchRequestDto);
            if (searchResponse.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        new ApiResponse<>(
                                false,
                                "not found",
                                Collections.emptyList()
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
}
