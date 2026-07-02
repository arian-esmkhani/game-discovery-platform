package admin.service;

import admin.dto.SaveDto;
import admin.dto.SearchDataDto;
import admin.dto.SearchRequestDto;
import admin.dto.UpdateResponseDto;
import org.springframework.data.domain.Page;

import java.util.Optional;

public interface CompaniesService {
    void deleteCompany(long companyId);
    void saveCompany(SaveDto saveCompanyDto);
    void updateCompany(SaveDto saveCompanyDto, long companyId);
    Page<SearchDataDto> searchCompanies(SearchRequestDto requestDto);
    Optional<UpdateResponseDto> getCompanyById(long companyId);
}
