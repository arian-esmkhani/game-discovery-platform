package main.service;

import lombok.RequiredArgsConstructor;
import main.dto.DataDto;
import main.dto.FavoriteRequestDto;
import main.model.FavoriteGame;
import main.repository.FavoriteGameRepository;
import main.repository.GameRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteGameServiceImpl implements FavoriteGameService{

    private final GameRepository gameRepository;
    private final FavoriteGameRepository favoriteRepository;
    private static final int PAGE_SIZE = 6;

    @Override
    @Transactional(readOnly = true)
    public boolean isFavorite(long userId, FavoriteRequestDto request) {
        return favoriteRepository.existsByUserIdAndGameId(
                userId, request.gameId());
    }

    @Override
    @Transactional
    public void addFavorite(long userId, FavoriteRequestDto request) {
        if (isFavorite(userId, request)) {
            throw new IllegalStateException("Game already in favorites");
        }

        FavoriteGame favorite = FavoriteGame.builder()
                .userId(userId)
                .gameId(request.gameId())
                .build();

        favoriteRepository.save(favorite);
    }

    @Override
    @Transactional
    public void removeFavorite(long userId, long gameId) {
        if (!favoriteRepository.existsByUserIdAndGameId(userId, gameId)) {
            throw new IllegalStateException("Game not in favorites");
        }

        favoriteRepository.deleteByUserIdAndGameId(userId, gameId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DataDto> findUserFavoriteGame(
            long userId, int pageNumber) {
        Pageable pageable = PageRequest.of(
                pageNumber,
                PAGE_SIZE,
                Sort.by("createdAt").descending()
        );

        Page<FavoriteGame> favoritePage = favoriteRepository
                .findGameIdsByUserId(userId, pageable);;

        List<Long> gameIds = favoritePage.getContent()
                .stream()
                .map(FavoriteGame::getGameId)
                .toList();

        List<DataDto> favoriteGames = gameRepository
                .getGamesById(gameIds);

        return new PageImpl<>(favoriteGames,
                pageable, favoritePage.getTotalElements());
    }
}
