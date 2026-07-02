package admin.service;

import admin.dto.SaveDto;
import admin.dto.SearchDataDto;
import admin.dto.SearchRequestDto;
import admin.dto.UpdateResponseDto;
import org.springframework.data.domain.Page;

import java.util.Optional;

public interface CharactersService {
    void saveCharacter(SaveDto saveCharacterDto);
    void updateCharacter(SaveDto saveCharacterDto, long characterId);
    void deleteCharacter(long characterId);
    Page<SearchDataDto> searchCharacters(SearchRequestDto requestDto);
    Optional<UpdateResponseDto> getCharacterById(long characterId);
}
