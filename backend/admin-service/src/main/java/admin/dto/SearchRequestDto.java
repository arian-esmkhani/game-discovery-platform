package admin.dto;

import jakarta.validation.constraints.Size;

public record SearchRequestDto(
        @Size(max = 60, message = "Name must be less than 60 characters")
        String name,
        int page
) {}
