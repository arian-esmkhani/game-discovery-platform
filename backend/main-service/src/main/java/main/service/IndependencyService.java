package main.service;

import main.dto.DataDto;

import java.util.Optional;

public interface IndependencyService {
    Optional<DataDto> fineCharacterById(long characterId);
    Optional<DataDto> fineCompanyById(long companyId);
}
