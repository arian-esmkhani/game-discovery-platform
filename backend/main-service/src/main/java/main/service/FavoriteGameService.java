package main.service;

import main.dto.DataDto;
import main.dto.FavoriteRequestDto;
import org.springframework.data.domain.Page;

public interface FavoriteGameService {
    boolean isFavorite(long userId, FavoriteRequestDto request);
    void addFavorite(long userId, FavoriteRequestDto request);
    void removeFavorite(long userId, long gameId);
    Page<DataDto> findUserFavoriteGame(long userId, int pageNumber);
}
