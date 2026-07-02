package main.service;

import lombok.RequiredArgsConstructor;
import main.dto.GameDataDto;
import main.dto.GameDataResponseDto;
import main.dto.DataDto;
import main.dto.SearchRequestDto;
import main.repository.CharacterRepository;
import main.repository.GameRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GameServiceImpl implements GameService {

    private final GameRepository gameRepository;
    private final CharacterRepository characterRepository;

    @Transactional(readOnly = true)
    @Override
    public Optional<GameDataResponseDto> getGameData(long gameId) {
        Optional<GameDataDto> gameOpt = gameRepository.getGameById(gameId);
        if (gameOpt.isEmpty()) {
            return Optional.empty();
        }

        List<DataDto> characters = characterRepository.getCharactersByGameId(gameId);
        GameDataResponseDto dto = new GameDataResponseDto(characters, gameOpt.get());

        return Optional.of(dto);
    }

    @Transactional(readOnly = true)
    @Override
    public List<DataDto> searchGame(SearchRequestDto searchRequestDto) {

        return gameRepository.searchGame(searchRequestDto.gameName(),
                searchRequestDto.companyName(), searchRequestDto.genreId());
    }
}
