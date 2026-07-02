package main.dto;

import java.io.Serializable;

public record GameInTrendSliderDto(
    long id,
    String name,
    String imageUrl,
    String description
) implements Serializable {}
