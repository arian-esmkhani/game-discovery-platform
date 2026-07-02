package admin.dto;

public record UpdateResponseDto(
        long id,
        String name,
        String description,
        String imageUrl
) {}
