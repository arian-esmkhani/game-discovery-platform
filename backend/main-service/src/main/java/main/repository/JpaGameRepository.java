package main.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import main.dto.GameDataDto;
import main.dto.DataDto;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class JpaGameRepository implements GameRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<GameDataDto> getGameById(long gameId){
        try {
            TypedQuery<GameDataDto> query = entityManager.createQuery("""
                    SELECT NEW main.dto.GameDataDto(
                        g.id, g.name, g.description, g.imageUrl, g.producedIn, g.company.name,
                        g.genre.name
                        )
                        FROM Games g
                        WHERE g.id = :id
                    """, GameDataDto.class);

            query.setParameter("id", gameId);
            return query.getResultStream().findFirst();
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<DataDto> getGamesById(List<Long> gameIds){
        try {
            TypedQuery<DataDto> query = entityManager.createQuery("""
                    SELECT NEW main.dto.DataDto(
                        g.id, g.name, g.imageUrl
                        )
                        FROM Games g
                        WHERE g.id IN :ids
                    """, DataDto.class);

            query.setParameter("ids", gameIds);
            return query.getResultList();
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<DataDto> searchGame(String gameName,
                                    String companyName, Long genreId) {
        try {
            StringBuilder jpql = new StringBuilder("""
            SELECT NEW main.dto.DataDto(g.id, g.name, g.imageUrl)
            FROM Games g
            WHERE g.deletedAt IS NULL
            """);

            Map<String, Object> parameters = new HashMap<>();

            if (gameName != null && !gameName.trim().isEmpty()) {
                jpql.append(" AND LOWER(g.name) LIKE LOWER(CONCAT('%', :gameName, '%'))");
                parameters.put("gameName", gameName.trim());
            }

            if (companyName != null && !companyName.trim().isEmpty()) {
                jpql.append(" AND LOWER(g.company.name) LIKE LOWER(CONCAT('%', :companyName, '%'))");
                parameters.put("companyName", companyName.trim());
            }

            if (genreId != null) {
                jpql.append(" AND g.genre.id = :genreId");
                parameters.put("genreId", genreId);
            }

            jpql.append(" ORDER BY g.createdAt DESC, g.id ASC");

            TypedQuery<DataDto> query =
                    entityManager.createQuery(jpql.toString(), DataDto.class);

            parameters.forEach(query::setParameter);

            return query.setMaxResults(12).getResultList();

        } catch (NoResultException e) {
            return Collections.emptyList();
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}
