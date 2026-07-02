package main.repository;

import main.dto.DataDto;
import main.dto.GameInTrendSliderDto;

import java.util.List;

public interface SliderRepository {
    List<GameInTrendSliderDto> findAllTrendGames();
    List<DataDto> findAllNewGames();
    List<DataDto> findAllSuggestedGames();
    List<DataDto> findAllNostalgiaGames();
    List<DataDto> findAllSurvivalGames();
    List<DataDto> findAllShooterGames();
    List<DataDto> findAllCharacters();
    List<DataDto> findAllCompanies();
}
