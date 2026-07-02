package main.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import main.dto.ApiResponse;
import main.dto.DataDto;
import main.dto.FavoriteRequestDto;
import main.service.FavoriteGameService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Validated
@RestController
@RequestMapping("/api/favorite")
@RequiredArgsConstructor
public class FavoriteGameController {

    private final FavoriteGameService favoriteGameService;
    private static final long MAX_ID = 999_999_999L;

    @PostMapping("/is")
    public boolean isFavorite(
            @RequestHeader("X-User-ID") Long userId,
            @Valid @RequestBody FavoriteRequestDto favoriteRequestDto)
    {

        if (userId == null) {
            throw new IllegalArgumentException("User ID is missing");
        }

        return favoriteGameService.isFavorite(userId, favoriteRequestDto);
    }

    @PostMapping("/add")
    public void addFavorite(
            @RequestHeader("X-User-ID") Long userId,
            @Valid @RequestBody FavoriteRequestDto favoriteRequestDto)
    {
        if (userId == null) {
            throw new IllegalArgumentException("User ID is missing");
        }

        favoriteGameService.addFavorite(userId, favoriteRequestDto);
    }

    @PostMapping("/remove/{gameId}")
    public void removeFavorite(
            @RequestHeader("X-User-ID") Long userId,
            @PathVariable @Positive Long gameId
            )
    {
        if (userId == null) {
            throw new IllegalArgumentException("User ID is missing");
        }

        if (gameId > MAX_ID) {
            log.warn("Suspicious game ID detected: {}", gameId);
            throw new SecurityException("Invalid game ID");
        }

        favoriteGameService.removeFavorite(userId, gameId);
    }

    @GetMapping("get/{pageNumber}")
    public ResponseEntity<ApiResponse<Page<DataDto>>> findUserFavoriteGame(
            @RequestHeader("X-User-ID") Long userId,
            @PathVariable Integer pageNumber)
    {
        try {
            Page<DataDto> favoriteGames = favoriteGameService.findUserFavoriteGame(userId,
                    pageNumber);

            if (favoriteGames.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                        new ApiResponse<>(
                                true,
                                "You do not have any favorite game",
                                null
                        )
                );
            }

            return ResponseEntity.ok().body(
                    new ApiResponse<>(
                            true,
                            "Data retrieved successfully",
                            favoriteGames
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ApiResponse<>(
                            false,
                            "Error retrieving data: " + e.getMessage(),
                            null
                    )
            );
        }
    }
}
