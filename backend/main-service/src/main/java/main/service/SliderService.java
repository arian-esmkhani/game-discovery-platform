package main.service;

import main.dto.GameInTrendSliderDto;
import main.dto.DataDto;

import java.util.List;

public interface SliderService {
    List<GameInTrendSliderDto> findAllTrendGames();
    List<DataDto> findAllNewGames();
    List<DataDto> findAllSuggestedGames();
    List<DataDto> findAllNostalgiaGames();
    List<DataDto> findAllSurvivalGames();
    List<DataDto> findAllShooterGames();
    List<DataDto> findAllCharacters();
    List<DataDto> findAllCompanies();
}
