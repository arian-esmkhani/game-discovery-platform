package admin.service;

import admin.dto.*;
import admin.model.Companies;
import admin.repository.CompaniesRepository;
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
public class CompanyServiceImpl implements CompaniesService{

    private final CompaniesRepository companiesRepository;
    private static final int PAGE_SIZE = 3;

    @Transactional
    @Override
    @CacheEvict(value = "static", allEntries = true)
    public void deleteCompany(long companyId) {
        Optional<Companies> optionalCompany = companiesRepository.findById(companyId);
        if (optionalCompany.isEmpty()) {
            throw new EntityNotFoundException("Company not found for ID: " + companyId);
        }

        Companies companies = optionalCompany.get();
        companies.setDeletedAt(LocalDateTime.now());
        companiesRepository.save(companies);
    }

    @Transactional
    @Override
    @CacheEvict(value = "static", allEntries = true)
    public void saveCompany(SaveDto saveCompanyDto) {
        Companies companies = new Companies();

        companies.setName(saveCompanyDto.name());
        companies.setDescription(saveCompanyDto.description());
        companies.setImageUrl(saveCompanyDto.imageUrl());
        companiesRepository.save(companies);
    }

    @Transactional
    @Override
    @CacheEvict(value = "static", allEntries = true)
    public void updateCompany(SaveDto saveCompanyDto, long companyId) {
        Optional<Companies> optionalCompany = companiesRepository.findById(companyId);
        if (optionalCompany.isEmpty()) {
            throw new EntityNotFoundException("Company not found for ID: " + companyId);
        }

        Companies companies = optionalCompany.get();
        companies.setName(saveCompanyDto.name());
        companies.setDescription(saveCompanyDto.description());
        companies.setImageUrl(saveCompanyDto.imageUrl());
        companies.setUpdatedAt(LocalDateTime.now());
        companiesRepository.save(companies);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SearchDataDto> searchCompanies(SearchRequestDto requestDto) {
        Pageable pageable = PageRequest.of(
                requestDto.page(),
                PAGE_SIZE,
                Sort.by("createdAt").descending());

        return companiesRepository.searchCompanies(requestDto.name(), pageable);
    }

    @Override
    public Optional<UpdateResponseDto> getCompanyById(long companyId) {
        return companiesRepository.getCompanyById(companyId);
    }
}
