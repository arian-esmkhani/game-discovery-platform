package main.service;

import lombok.RequiredArgsConstructor;
import main.dto.GameInTrendSliderDto;
import main.dto.DataDto;
import main.repository.SliderRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SliderServiceImpl implements SliderService{

    private final SliderRepository sliderRepository;

    @Transactional(readOnly = true)
    @Override
    @Cacheable(value = "static", key = "'findAllTrendGames'")
    public List<GameInTrendSliderDto> findAllTrendGames() {
        return sliderRepository.findAllTrendGames();
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "static", key = "'findAllNewGames'")
    @Override
    public List<DataDto> findAllNewGames() {
        return sliderRepository.findAllNewGames();
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "static", key = "'findAllSuggestedGames'")
    @Override
    public List<DataDto> findAllSuggestedGames() {
        return sliderRepository.findAllSuggestedGames();
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "static", key = "'findAllNostalgiaGames'")
    @Override
    public List<DataDto> findAllNostalgiaGames() {
        return sliderRepository.findAllNostalgiaGames();
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "static", key = "'findAllSurvivalGames'")
    @Override
    public List<DataDto> findAllSurvivalGames() {
        return sliderRepository.findAllSurvivalGames();
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "static", key = "'findAllShooterGames'")
    @Override
    public List<DataDto> findAllShooterGames() {
        return sliderRepository.findAllShooterGames();
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "static", key = "'findAllCharacters'")
    @Override
    public List<DataDto> findAllCharacters() {
        return sliderRepository.findAllCharacters();
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "static", key = "'findAllCompanies'")
    @Override
    public List<DataDto> findAllCompanies() {
        return sliderRepository.findAllCompanies();
    }
}

