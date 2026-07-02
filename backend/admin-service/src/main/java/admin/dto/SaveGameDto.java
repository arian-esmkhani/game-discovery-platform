package admin.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.List;

public record SaveGameDto(
        @NotNull(message = "Game name cannot be null")
        @NotBlank(message = "Game name cannot be blank")
        @Size(min = 4,max = 80, message = "Game description must be min 4 and max 80 character")
        @Pattern(
                regexp = "^[a-zA-Z0-9\\s\\-_.]*$",
                message = "Can only contain letters, numbers, spaces, and (- _ .)"
        )
        String name,

        @NotNull(message = "Game description cannot be null")
        @NotBlank(message = "Game description cannot be blank")
        @Size(min = 10,max = 2000, message = "Game description must be min 10 and max 2000 character")
        @Pattern(
                regexp = "^[a-zA-Z0-9\\s\\-_.]*$",
                message = "Can only contain letters, numbers, spaces, and (- _ .)"
        )
        String description,

        @NotNull(message = "Image URL cannot be null")
        @NotBlank(message = "Image URL cannot be blank")
        String imageUrl,

        boolean isNostalgia,
        boolean isTrend,
        boolean isSuggested,

        @NotNull(message = "Production date cannot be null")
        @PastOrPresent(message = "Production date must be in the past or present")
        LocalDate ProducedIn,

        @NotNull(message = "Genre ID cannot be null")
        @Positive(message = "Genre ID must be a positive number")
        Long genreId,

        @NotNull(message = "Company ID cannot be null")
        @Positive(message = "Company ID must be a positive number")
        Long companyId,

        @NotNull(message = "Character IDs cannot be null")
        @Size(min = 1, message = "At least one character ID must be provided")
        List<
        @Positive(message = "Character ID must be a positive number") Long> characterIds
) {}