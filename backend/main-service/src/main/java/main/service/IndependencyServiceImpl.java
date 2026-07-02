package main.service;

import lombok.RequiredArgsConstructor;
import main.dto.DataDto;
import main.repository.CharacterRepository;
import main.repository.CompanyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class IndependencyServiceImpl implements IndependencyService{
    private final CompanyRepository companyRepository;
    private final CharacterRepository characterRepository;

    @Override
    @Transactional(readOnly = true)
    public Optional<DataDto> fineCharacterById(long characterId) {
        return characterRepository.fineCharacterById(characterId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DataDto> fineCompanyById(long companyId) {
        return companyRepository.fineCompanyById(companyId);
    }
}
