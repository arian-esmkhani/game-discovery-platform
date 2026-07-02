package main.dto;

import java.time.LocalDate;

public record GameDataDto(
        long id,
        String name,
        String description,
        String imageUrl,
        LocalDate producedIn,
        String companyName,
        String genreName
) {}
