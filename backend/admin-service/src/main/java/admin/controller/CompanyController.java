package admin.controller;

import admin.dto.*;
import admin.service.CompaniesService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Slf4j
@Validated
@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
public class CompanyController {

    private final CompaniesService companiesService;
    private static final String SAFE_STRING_PATTERN = "^[a-zA-Z0-9\\s\\-_.]*$|^$";
    private static final long MAX_ID = 999_999_999L;

    @PostMapping("/{companyId}")
    public ResponseEntity<ApiResponse<Void>> deleteCompany(
            @PathVariable @Positive Long companyId) {

        if (companyId > MAX_ID) {
            log.warn("Suspicious company id detected for deleting with ID: {}", companyId);
            throw new SecurityException("Invalid company ID");
        }

        try {
            companiesService.deleteCompany(companyId);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Company deleted successfully",
                            null
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            "Error deleting Company: " + e.getMessage(),
                            null
                    ));
        }
    }

    @PostMapping("/save")
    public ResponseEntity<ApiResponse<Void>> saveCompany(
            @Valid @RequestBody SaveDto saveCompanyDto) {
        try {
            companiesService.saveCompany(saveCompanyDto);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Company saved successfully",
                            null
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            "Error saving Company: " + e.getMessage(),
                            null
                    ));
        }
    }

    @PostMapping("/update/{companyId}")
    public ResponseEntity<ApiResponse<Void>> updateCompany(
            @PathVariable @Positive Long companyId,
            @Valid @RequestBody SaveDto saveCompanyDto) {

        if (companyId > MAX_ID) {
            log.warn("Suspicious company id detected for updating with ID: {}", companyId);
            throw new SecurityException("Invalid company ID");
        }

        try {
            companiesService.updateCompany(saveCompanyDto, companyId);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Company update successfully",
                            null
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            "Error updating Company: " + e.getMessage(),
                            null
                    ));
        }
    }

    @PostMapping("/get")
    public ResponseEntity<ApiResponse<Page<SearchDataDto>>> searchCompany (
            @Valid @RequestBody SearchRequestDto searchRequestDto)
    {

        if (searchRequestDto.name() != null && !searchRequestDto.name().matches(SAFE_STRING_PATTERN)) {
            log.warn("Security validation failed for search request");
            throw new SecurityException("Invalid Name");
        }

        try {
            Page<SearchDataDto> searchResponse = companiesService.searchCompanies(searchRequestDto);
            if (searchResponse.isEmpty()) {
                return ResponseEntity.ok(
                        new ApiResponse<>(
                                false,
                                "not found",
                                null
                        ));
            }

            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Data retrieved successfully",
                            searchResponse
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            "Error retrieving Company: " + e.getMessage(),
                            null
                    ));
        }
    }

    @GetMapping("/getById/{companyId}")
    private ResponseEntity<ApiResponse<Optional<UpdateResponseDto>>> getCompanyById (
            @PathVariable @Positive Long companyId)
    {

        if (companyId > MAX_ID) {
            log.warn("Suspicious company id detected for get with ID: {}", companyId);
            throw new SecurityException("Invalid company ID");
        }

        try {
            Optional<UpdateResponseDto> companies = companiesService.getCompanyById(companyId);

            if (companies.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(
                                false,
                                "Company not found with ID: " + companyId,
                                null
                        ));
            }

            return ResponseEntity.ok()
                    .body(new ApiResponse<>(
                            true,
                            "Company retrieved successfully",
                            companies
                    ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            false,
                            "Error retrieving Data: " + e.getMessage(),
                            null
                    ));
        }
    }
}
