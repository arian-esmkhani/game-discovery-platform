package main.repository;

import main.dto.DataDto;

import java.util.Optional;

public interface CompanyRepository {
    Optional<DataDto> fineCompanyById(long companyId);
}
