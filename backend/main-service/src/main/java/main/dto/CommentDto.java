package main.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CommentDto(
        long gameId,

        @NotNull(message = "Comment name cannot be null")
        @NotBlank(message = "Comment name cannot be blank")
        @Size(min = 4,max = 190, message = "Comment must be min 4 and max 190 character")
        @Pattern(
                regexp = "^[a-zA-Z0-9\\s\\-_.]*$",
                message = "Can only contain letters, numbers, spaces, and (- _ .)"
        )
        String comment
) {}
