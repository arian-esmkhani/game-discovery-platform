package main.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import main.dto.DataDto;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class JpaCharacterRepository implements CharacterRepository{

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<DataDto> getCharactersByGameId(long gameId) {
        try {
            TypedQuery<DataDto> query = entityManager.createQuery("""
            SELECT NEW main.dto.DataDto(
                c.id, c.name, c.imageUrl
            )
            FROM Games g
            JOIN g.characters c
            WHERE g.id = :id
            """, DataDto.class);
            query.setParameter("id", gameId);
            return query.getResultList();
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Optional<DataDto> fineCharacterById(long characterId) {
        try {
            TypedQuery<DataDto> query = entityManager.createQuery("""
                    SELECT NEW main.dto.DataDto(
                        c.id, c.name, c.imageUrl
                    )
                    FROM Characters c
                    WHERE c.id = :id
                    """, DataDto.class);
            query.setParameter("id", characterId);
            return Optional.ofNullable(query.getSingleResult());
        } catch (NoResultException e) {
            throw new NoResultException();
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}
