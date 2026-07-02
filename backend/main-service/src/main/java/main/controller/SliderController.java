package main.controller;

import lombok.RequiredArgsConstructor;
import main.dto.ApiResponse;
import main.dto.GameInTrendSliderDto;
import main.dto.DataDto;
import main.service.SliderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/slider")
@RequiredArgsConstructor
public class SliderController {

    private final SliderService sliderService;

    @GetMapping("/trend_games")
    public ResponseEntity<ApiResponse<List<GameInTrendSliderDto>>> findAllTrendGames() {

        try {
            List<GameInTrendSliderDto> games = sliderService.findAllTrendGames();
            if (games.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                        new ApiResponse<>(
                                true,
                                "No game found for the Trend game slider",
                                Collections.emptyList()
                        ));
            }

            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Data retrieved successfully",
                            games
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            "Error retrieving data: " + e.getMessage(),
                            null
                    ));
        }
    }

    @GetMapping("/new-games")
    public ResponseEntity<ApiResponse<List<DataDto>>> findAllNewGames() {

        try {
            List<DataDto> games = sliderService.findAllNewGames();
            if (games.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                        new ApiResponse<>(
                                true,
                                "No data found",
                                Collections.emptyList()
                        ));
            }

            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Data retrieved successfully",
                            games
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            "Error retrieving data: " + e.getMessage(),
                            null
                    ));
        }
    }

    @GetMapping("/suggested-games")
    public ResponseEntity<ApiResponse<List<DataDto>>> findAllSuggestedGames() {

        try {
            List<DataDto> games = sliderService.findAllSuggestedGames();
            if (games.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                        new ApiResponse<>(
                                true,
                                "No data found",
                                Collections.emptyList()
                        ));
            }

            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Data retrieved successfully",
                            games
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            "Error retrieving data: " + e.getMessage(),
                            null
                    ));
        }
    }

    @GetMapping("/survival-games")
    public ResponseEntity<ApiResponse<List<DataDto>>> findAllSurvivalGames() {

        try {
            List<DataDto> games = sliderService.findAllSurvivalGames();
            if (games.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                        new ApiResponse<>(
                                true,
                                "No data found",
                                Collections.emptyList()
                        ));
            }

            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Data retrieved successfully",
                            games
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            "Error retrieving data: " + e.getMessage(),
                            null
                    ));
        }
    }

    @GetMapping("/nostalgia-games")
    public ResponseEntity<ApiResponse<List<DataDto>>> findAllNostalgiaGames() {

        try {
            List<DataDto> games = sliderService.findAllNostalgiaGames();
            if (games.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                        new ApiResponse<>(
                                true,
                                "No data found",
                                Collections.emptyList()
                        ));
            }

            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Data retrieved successfully",
                            games
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            "Error retrieving data: " + e.getMessage(),
                            null
                    ));
        }
    }

    @GetMapping("/shooter-games")
    public ResponseEntity<ApiResponse<List<DataDto>>> findAllShooterGames() {

        try {
            List<DataDto> games = sliderService.findAllShooterGames();
            if (games.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                        new ApiResponse<>(
                                true,
                                "No data found",
                                Collections.emptyList()
                        ));
            }

            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Data retrieved successfully",
                            games
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            "Error retrieving data: " + e.getMessage(),
                            null
                    ));
        }
    }

    @GetMapping("/characters-sliders")
    public ResponseEntity<ApiResponse<List<DataDto>>> findAllCharacters() {

        try {
            List<DataDto> games = sliderService.findAllCharacters();
            if (games.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                        new ApiResponse<>(
                                true,
                                "No data found",
                                Collections.emptyList()
                        ));
            }

            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Data retrieved successfully",
                            games
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            "Error retrieving data: " + e.getMessage(),
                            null
                    ));
        }
    }

    @GetMapping("/companies-slider")
    public ResponseEntity<ApiResponse<List<DataDto>>> findAllCompanies() {

        try {
            List<DataDto> games = sliderService.findAllCompanies();
            if (games.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                        new ApiResponse<>(
                                true,
                                "No data found",
                                Collections.emptyList()
                        ));
            }

            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Data retrieved successfully",
                            games
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            "Error retrieving data: " + e.getMessage(),
                            null
                    ));
        }
    }
}