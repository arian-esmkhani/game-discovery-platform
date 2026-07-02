package main.dto;

import java.util.List;

public record GameDataResponseDto(
        List<DataDto> inSliderDto,
        GameDataDto gameDataDto
) {}
