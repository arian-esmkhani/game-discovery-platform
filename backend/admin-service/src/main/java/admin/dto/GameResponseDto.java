package admin.dto;

import java.time.LocalDate;
import java.util.List;

public record GameResponseDto(
        long id,
        String name,
        String description,
        String imageUrl,
        boolean isNostalgia,
        boolean isTrend,
        boolean isSuggested,
        LocalDate producedIn,
        SearchDataDto genre,
        SearchDataDto company,
        List<SearchDataDto> characters
) {}
