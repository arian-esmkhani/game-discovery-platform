package main.dto;

import jakarta.validation.constraints.Positive;

public record FavoriteRequestDto(
        @Positive(message = "Game ID must be positive")
        Long gameId
) {}
