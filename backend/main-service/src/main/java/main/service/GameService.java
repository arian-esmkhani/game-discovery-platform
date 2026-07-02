package main.service;

import main.dto.GameDataResponseDto;
import main.dto.DataDto;
import main.dto.SearchRequestDto;

import java.util.List;
import java.util.Optional;

public interface GameService {
    Optional<GameDataResponseDto> getGameData(long gameId);
    List<DataDto> searchGame(SearchRequestDto searchRequestDto);
}
