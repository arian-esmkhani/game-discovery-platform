package admin.service;

import admin.dto.GameResponseDto;
import admin.dto.SaveGameDto;
import admin.dto.SearchDataDto;
import admin.dto.SearchRequestDto;
import org.springframework.data.domain.Page;

import java.util.Optional;

public interface GameService {
    void deleteGame(long gameId);
    void saveGame(SaveGameDto saveGameDto);
    void updateGame(SaveGameDto saveGameDto, long gameId);
    Page<SearchDataDto> searchGame(SearchRequestDto requestDto);
    Optional<GameResponseDto> getGameById(long gameId);

}