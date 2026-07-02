package admin.service;

import admin.dto.*;
import admin.model.Genres;
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
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GenresServiceImpl implements GenresService{
    private final GenresRepository genresRepository;
    private static final int PAGE_SIZE = 3;

    @Transactional
    @Override
    @CacheEvict(value = "static", allEntries = true)
    public void saveGenre(SaveDto saveGenresDto) {
        Genres genres = new Genres();

        genres.setName(saveGenresDto.name());
        genres.setDescription(saveGenresDto.description());
        genres.setImageUrl(saveGenresDto.imageUrl());
        genresRepository.save(genres);
    }

    @Transactional
    @Override
    @CacheEvict(value = "static", allEntries = true)
    public void updateGenre(SaveDto saveGenresDto, long genresId) {
        Optional<Genres> optionalGenres = genresRepository.findById(genresId);
        if (optionalGenres.isEmpty()) {
            throw new EntityNotFoundException("Genre not found for ID: " + genresId);
        }

        Genres genres = optionalGenres.get();
        genres.setName(saveGenresDto.name());
        genres.setDescription(saveGenresDto.description());
        genres.setImageUrl(saveGenresDto.imageUrl());
        genres.setUpdatedAt(LocalDateTime.now());
        genresRepository.save(genres);
    }

    @Transactional
    @Override
    @CacheEvict(value = "static", allEntries = true)
    public void deleteGenre(long genresId) {
        Optional<Genres> optionalGenres = genresRepository.findById(genresId);
        if (optionalGenres.isEmpty()) {
            throw new EntityNotFoundException("Genre not found for ID: " + genresId);
        }

        Genres genres = optionalGenres.get();
        genres.setDeletedAt(LocalDateTime.now());
        genresRepository.save(genres);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SearchDataDto> searchGenres(SearchRequestDto requestDto) {
        Pageable pageable = PageRequest.of(
                requestDto.page(),
                PAGE_SIZE,
                Sort.by("createdAt").descending());

        return  genresRepository.searchGenres(requestDto.name(), pageable);
    }

    @Override
    public Optional<UpdateResponseDto> getGenreById(long genreId) {
        return genresRepository.getGenresById(genreId);
    }
}
