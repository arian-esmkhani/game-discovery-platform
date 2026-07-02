package admin.repository;

import admin.dto.SearchDataDto;
import admin.dto.UpdateResponseDto;
import admin.model.Genres;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface GenresRepository extends JpaRepository<Genres, Long> {

    @Query("""
            SELECT NEW admin.dto.SearchDataDto(
                g.id, g.name
            )
            FROM Genres g
            WHERE ((:name IS NULL OR TRIM(:name) = '')
            OR LOWER(g.name) LIKE LOWER(CONCAT('%', TRIM(:name), '%')))
            AND g.deletedAt IS NULL
            """)
    Page<SearchDataDto> searchGenres(
            @Param("name") String name,
            Pageable pageable
    );

    @Query("""
            SELECT NEW admin.dto.UpdateResponseDto(
                g.id, g.name, g.description, g.imageUrl
            )
            FROM Genres g
            WHERE g.id = :genresId
            """)
    Optional<UpdateResponseDto> getGenresById(@Param("genresId") long genresId);
}
