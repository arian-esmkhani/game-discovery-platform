package admin.service;

import admin.dto.*;
import admin.model.Characters;
import admin.model.Companies;
import admin.model.Games;
import admin.model.Genres;
import admin.repository.CharactersRepository;
import admin.repository.CompaniesRepository;
import admin.repository.GamesRepository;
import admin.repository.GenresRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GameServiceImpl implements GameService{

    private final GamesRepository gamesRepository;
    private final GenresRepository genresRepository;
    private final CompaniesRepository companiesRepository;
    private final CharactersRepository charactersRepository;
    private static final int PAGE_SIZE = 3;

    @Transactional
    @Override
    @CacheEvict(value = "static", allEntries = true)
    public void deleteGame(long gameId) {
        Optional<Games> optionalGames = gamesRepository.findById(gameId);

        if (optionalGames.isEmpty()) {
            throw new EntityNotFoundException("Game not found for ID: " + gameId);
        }

        Games games = optionalGames.get();
        games.setDeletedAt(LocalDateTime.now());
        gamesRepository.save(games);
    }

    @Transactional
    @Override
    @CacheEvict(value = "static", allEntries = true)
    public void saveGame(SaveGameDto saveGameDto) {

        Optional<Genres> optionalGenres = genresRepository.findById(saveGameDto.genreId());
        if (optionalGenres.isEmpty()) {
            throw new EntityNotFoundException("Genre not found for ID: " + saveGameDto.genreId());
        }

        Optional<Companies> optionalCompanies = companiesRepository.findById(saveGameDto.companyId());
        if (optionalCompanies.isEmpty()) {
            throw new EntityNotFoundException("Companies not found for ID: " + saveGameDto.companyId());
        }

        List<Characters> charactersList = charactersRepository.findAllById(saveGameDto.characterIds());
        if (charactersList.isEmpty()) {
            throw new EntityNotFoundException("Character not found for ID: " + saveGameDto.characterIds());
        }

        if (charactersList.size() != saveGameDto.characterIds().size()) {
            List<Long> foundCharacterIds = charactersList.stream()
                    .map(Characters::getId)
                    .toList();

            List<Long> missingCharacterIds = saveGameDto.characterIds().stream()
                    .filter(id -> !foundCharacterIds.contains(id))
                    .toList();

            throw new EntityNotFoundException("Characters not found for IDs: " + missingCharacterIds);
        }

        Games games = new Games();
        Genres genres = optionalGenres.get();
        Companies companies = optionalCompanies.get();

        games.setName(saveGameDto.name());
        games.setDescription(saveGameDto.description());
        games.setImageUrl(saveGameDto.imageUrl());
        games.setNostalgia(saveGameDto.isNostalgia());
        games.setTrend(saveGameDto.isTrend());
        games.setSuggested(saveGameDto.isSuggested());
        games.setProducedIn(saveGameDto.ProducedIn());
        games.setGenre(genres);
        games.setCompany(companies);
        games.setCharacters(charactersList);

        gamesRepository.save(games);
    }

    @Transactional
    @Override
    @CacheEvict(value = "static", allEntries = true)
    public void updateGame(SaveGameDto saveGameDto, long gameId) {

        Optional<Games> optionalGames = gamesRepository.findById(gameId);
        if (optionalGames.isEmpty()) {
            throw new EntityNotFoundException("Game not found for ID: " + gameId);
        }

        Optional<Genres> optionalGenres = genresRepository.findById(saveGameDto.genreId());
        if (optionalGenres.isEmpty()) {
            throw new EntityNotFoundException("Genre not found for ID: " + saveGameDto.genreId());
        }

        Optional<Companies> optionalCompanies = companiesRepository.findById(saveGameDto.companyId());
        if (optionalCompanies.isEmpty()) {
            throw new EntityNotFoundException("Companies not found for ID: " + saveGameDto.companyId());
        }

        List<Characters> charactersList = charactersRepository.findAllById(saveGameDto.characterIds());
        if (charactersList.isEmpty()) {
            throw new EntityNotFoundException("Character not found for ID: " + saveGameDto.characterIds());
        }

        if (charactersList.size() != saveGameDto.characterIds().size()) {
            List<Long> foundCharacterIds = charactersList.stream()
                    .map(Characters::getId)
                    .toList();

            List<Long> missingCharacterIds = saveGameDto.characterIds().stream()
                    .filter(id -> !foundCharacterIds.contains(id))
                    .toList();

            throw new EntityNotFoundException("Characters not found for IDs: " + missingCharacterIds);
        }

        Games games = optionalGames.get();
        Genres genres = optionalGenres.get();
        Companies companies = optionalCompanies.get();

        games.setName(saveGameDto.name());
        games.setDescription(saveGameDto.description());
        games.setImageUrl(saveGameDto.imageUrl());
        games.setNostalgia(saveGameDto.isNostalgia());
        games.setTrend(saveGameDto.isTrend());
        games.setSuggested(saveGameDto.isSuggested());
        games.setProducedIn(saveGameDto.ProducedIn());
        games.setGenre(genres);
        games.setCompany(companies);
        games.setUpdatedAt(LocalDateTime.now());
        games.setCharacters(charactersList);

        gamesRepository.save(games);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SearchDataDto> searchGame(SearchRequestDto requestDto) {
        Pageable pageable = PageRequest.of(
                requestDto.page(),
                PAGE_SIZE,
                Sort.by("createdAt").descending());

        return gamesRepository.searchGame(requestDto.name(), pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<GameResponseDto> getGameById(long gameId) {
        return gamesRepository.findGameWithRelations(gameId)
                .map(g -> new GameResponseDto(
                        g.getId(),
                        g.getName(),
                        g.getDescription(),
                        g.getImageUrl(),
                        g.isNostalgia(),
                        g.isTrend(),
                        g.isSuggested(),
                        g.getProducedIn(),
                        new SearchDataDto(g.getGenre().getId(), g.getGenre().getName()),
                        new SearchDataDto(g.getCompany().getId(), g.getCompany().getName()),
                        g.getCharacters().stream()
                                .map(c -> new SearchDataDto(c.getId(), c.getName()))
                                .toList()
                ));
    }
}