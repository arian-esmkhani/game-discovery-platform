package admin.repository;

import admin.dto.SearchDataDto;
import admin.dto.UpdateResponseDto;
import admin.model.Characters;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CharactersRepository extends JpaRepository<Characters, Long> {

    @Query("""
            SELECT NEW admin.dto.SearchDataDto(
                c.id, c.name
            )
            FROM Characters c
            WHERE ((:name IS NULL OR TRIM(:name) = '')
            OR LOWER(c.name) LIKE LOWER(CONCAT('%', TRIM(:name), '%')))
            AND c.deletedAt IS NULL
            """)
    Page<SearchDataDto> searchCharacters(
            @Param("name") String name,
            Pageable pageable
    );

    @Query("""
            SELECT NEW admin.dto.UpdateResponseDto(
                c.id, c.name, c.description, c.imageUrl
            )
            FROM Characters c
            WHERE c.id = :characterId
            """)
    Optional<UpdateResponseDto> getCharacterById(@Param("characterId") long characterId);
}