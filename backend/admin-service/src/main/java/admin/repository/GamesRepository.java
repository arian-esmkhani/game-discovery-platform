package admin.repository;

import admin.dto.SearchDataDto;
import admin.model.Games;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GamesRepository extends JpaRepository<Games, Long> {

    @Query("""
            SELECT NEW admin.dto.SearchDataDto(
                g.id, g.name
            )
            FROM Games g
            WHERE ((:name IS NULL OR TRIM(:name) = '')
            OR LOWER(g.name) LIKE LOWER(CONCAT('%', TRIM(:name), '%')))
            AND g.deletedAt IS NULL
            """)
    Page<SearchDataDto> searchGame(
            @Param("name") String name,
            Pageable pageable
    );

    @Query("""
    SELECT g
    FROM Games g
    LEFT JOIN FETCH g.genre
    LEFT JOIN FETCH g.company
    LEFT JOIN FETCH g.characters
    WHERE g.id = :gameID
    """)
    Optional<Games> findGameWithRelations(@Param("gameID") long gameID);
}
