package admin.service;

import admin.dto.SaveDto;
import admin.dto.SearchDataDto;
import admin.dto.SearchRequestDto;
import admin.dto.UpdateResponseDto;
import org.springframework.data.domain.Page;

import java.util.Optional;

public interface GenresService {
    void saveGenre(SaveDto saveGenresDto);
    void updateGenre(SaveDto saveGenresDto, long genresId);
    void deleteGenre(long genresId);
    Page<SearchDataDto> searchGenres(SearchRequestDto requestDto);
    Optional<UpdateResponseDto> getGenreById(long genreId);

}