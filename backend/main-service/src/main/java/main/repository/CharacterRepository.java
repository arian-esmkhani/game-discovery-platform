package main.repository;

import main.dto.DataDto;

import java.util.List;
import java.util.Optional;

public interface CharacterRepository {
    //We use this for showing the Game characters
    List<DataDto> getCharactersByGameId(long gameId);
    //For showing the Character data
    Optional<DataDto> fineCharacterById(long characterId);
}
