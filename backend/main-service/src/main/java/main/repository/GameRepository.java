package main.repository;

import main.dto.GameDataDto;
import main.dto.DataDto;

import java.util.List;
import java.util.Optional;

public interface GameRepository {
    Optional<GameDataDto> getGameById(long gameId);
    List<DataDto> searchGame(String gameName, String companyName, Long genreId);
    List<DataDto> getGamesById(List<Long> gameId);
}
