package admin.repository;

import admin.dto.SearchDataDto;
import admin.dto.UpdateResponseDto;
import admin.model.Companies;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CompaniesRepository extends JpaRepository<Companies, Long> {

    @Query("""
            SELECT NEW admin.dto.SearchDataDto(
                c.id, c.name
            )
            FROM Companies c
            WHERE ((:name IS NULL OR TRIM(:name) = '')
            OR LOWER(c.name) LIKE LOWER(CONCAT('%', TRIM(:name), '%')))
            AND c.deletedAt IS NULL
            """)
    Page<SearchDataDto> searchCompanies(
            @Param("name") String name,
            Pageable pageable
    );

    @Query("""
            SELECT NEW admin.dto.UpdateResponseDto(
                c.id, c.name, c.description, c.imageUrl
            )
            FROM Companies c
            WHERE c.id = :companyId
            """)
    Optional<UpdateResponseDto> getCompanyById(@Param("companyId") long companyId);
}
