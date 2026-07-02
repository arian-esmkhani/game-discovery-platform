package main.dto;

import java.io.Serializable;

public record DataDto(
        long id,
        String name,
        String imageUrl
) implements Serializable {}
