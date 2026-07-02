package admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SaveDto(
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
        String imageUrl
) {}
