package admin.service;

import admin.dto.*;
import admin.model.Characters;
import admin.repository.CharactersRepository;
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
public class CharactersServiceImpl implements CharactersService{
    private final CharactersRepository charactersRepository;
    private static final int PAGE_SIZE = 3;

    @Override
    @Transactional
    @CacheEvict(value = "static", allEntries = true)
    public void saveCharacter(SaveDto saveCharacterDto) {
        Characters characters = new Characters();

        characters.setName(saveCharacterDto.name());
        characters.setDescription(saveCharacterDto.description());
        characters.setImageUrl(saveCharacterDto.imageUrl());
        charactersRepository.save(characters);
    }

    @Override
    @Transactional
    @CacheEvict(value = "static", allEntries = true)
    public void updateCharacter(SaveDto saveCharacterDto, long characterId) {
        Optional<Characters> optionalCharacters = charactersRepository.findById(characterId);
        if (optionalCharacters.isEmpty()) {
            throw new EntityNotFoundException("Character not found for ID: " + characterId);
        }

        Characters characters = optionalCharacters.get();
        characters.setName(saveCharacterDto.name());
        characters.setDescription(saveCharacterDto.description());
        characters.setImageUrl(saveCharacterDto.imageUrl());
        characters.setUpdatedAt(LocalDateTime.now());
        charactersRepository.save(characters);
    }

    @Override
    @Transactional
    @CacheEvict(value = "static", allEntries = true)
    public void deleteCharacter(long characterId) {
        Optional<Characters> optionalCharacters = charactersRepository.findById(characterId);
        if (optionalCharacters.isEmpty()) {
            throw new EntityNotFoundException("Character not found for ID: " + characterId);
        }

        Characters characters = optionalCharacters.get();
        characters.setDeletedAt(LocalDateTime.now());
        charactersRepository.save(characters);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SearchDataDto> searchCharacters(SearchRequestDto requestDto) {
        Pageable pageable = PageRequest.of(
                requestDto.page(), PAGE_SIZE,
                Sort.by("createdAt").descending());

        return charactersRepository.searchCharacters(requestDto.name(), pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UpdateResponseDto> getCharacterById(long characterId) {
        return charactersRepository.getCharacterById(characterId);
    }
}