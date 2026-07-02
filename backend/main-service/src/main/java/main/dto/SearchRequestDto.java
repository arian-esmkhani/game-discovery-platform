package main.dto;

import jakarta.validation.constraints.Size;

public record SearchRequestDto(

        @Size(max = 100, message = "Game name must be max 100 characters")
        String gameName,

        @Size(max = 100, message = "Company name must be max 100 characters")
        String companyName,

        Long genreId
) {}
