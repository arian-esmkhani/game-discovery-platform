package main.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import main.dto.DataDto;
import main.dto.GameInTrendSliderDto;
import org.springframework.stereotype.Repository;

import java.util.Collections;
import java.util.List;

@Repository
public class JpaSliderRepository implements SliderRepository{

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<GameInTrendSliderDto> findAllTrendGames() {
        try {
            TypedQuery<GameInTrendSliderDto> query = entityManager.createQuery("""
                    SELECT NEW main.dto.GameInTrendSliderDto(
                        g.id, g.name, g.imageUrl, g.description
                    )
                    FROM Games g
                    WHERE g.deletedAt IS NULL AND g.isTrend = true
                    ORDER BY g.createdAt DESC, g.id ASC
                    LIMIT 8
                    """, GameInTrendSliderDto.class);
            return query.getResultList();
        } catch (NoResultException e) {
            return Collections.emptyList();
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<DataDto> findAllNewGames() {
        try {
            TypedQuery<DataDto> query = entityManager.createQuery("""
                    SELECT NEW main.dto.DataDto(
                        g.id, g.name, g.imageUrl
                    )
                    FROM Games g
                    WHERE g.deletedAt IS NULL
                    ORDER BY g.producedIn DESC, g.createdAt DESC, g.id ASC
                    LIMIT 8
                    """, DataDto.class);
            return query.getResultList();
        } catch (NoResultException e) {
            return Collections.emptyList();
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<DataDto> findAllSuggestedGames() {
        try {
            TypedQuery<DataDto> query = entityManager.createQuery("""
                    SELECT NEW main.dto.DataDto(
                        g.id, g.name, g.imageUrl
                    )
                    FROM Games g
                    WHERE g.deletedAt IS NULL AND g.isSuggested = true
                    ORDER BY g.createdAt DESC, g.id ASC
                    LIMIT 8
                    """, DataDto.class);
            return query.getResultList();
        } catch (NoResultException e) {
            return Collections.emptyList();
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<DataDto> findAllNostalgiaGames() {
        try {
            TypedQuery<DataDto> query = entityManager.createQuery("""
                    SELECT NEW main.dto.DataDto(
                        g.id, g.name, g.imageUrl
                    )
                    FROM Games g
                    WHERE g.deletedAt IS NULL AND g.isNostalgia = true
                    ORDER BY g.createdAt DESC, g.id ASC
                    LIMIT 8
                    """, DataDto.class);
            return query.getResultList();
        } catch (NoResultException e) {
            return Collections.emptyList();
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<DataDto> findAllSurvivalGames() {
        try {
            TypedQuery<DataDto> query = entityManager.createQuery("""
                    SELECT NEW main.dto.DataDto(
                        g.id, g.name, g.imageUrl
                    )
                    FROM Games g
                    WHERE g.deletedAt IS NULL AND g.genre.id = 1
                    ORDER BY g.createdAt DESC, g.id ASC
                    LIMIT 8
                    """, DataDto.class);
            return query.getResultList();
        } catch (NoResultException e) {
            return Collections.emptyList();
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<DataDto> findAllShooterGames() {
        try {
            TypedQuery<DataDto> query = entityManager.createQuery("""
                    SELECT NEW main.dto.DataDto(
                        g.id, g.name, g.imageUrl
                    )
                    FROM Games g
                    WHERE g.deletedAt IS NULL AND g.genre.id = 5
                    ORDER BY g.createdAt DESC, g.id ASC
                    LIMIT 8
                    """, DataDto.class);
            return query.getResultList();
        } catch (NoResultException e) {
            return Collections.emptyList();
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<DataDto> findAllCharacters() {
        try {
            TypedQuery<DataDto> query = entityManager.createQuery("""
                    SELECT NEW main.dto.DataDto(
                        c.id, c.name, c.imageUrl
                    )
                    FROM Characters c
                    WHERE c.deletedAt IS NULL
                    """, DataDto.class);
            query.setMaxResults(12);
            return query.getResultList();
        } catch (NoResultException e) {
            return Collections.emptyList();
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<DataDto> findAllCompanies() {
        try {
            TypedQuery<DataDto> query = entityManager.createQuery("""
                    SELECT NEW main.dto.DataDto(
                        c.id, c.name, c.imageUrl
                    )
                    FROM Companies c
                    WHERE c.deletedAt IS NULL
                    """, DataDto.class);
            query.setMaxResults(12);
            return query.getResultList();
        } catch (NoResultException e) {
            return Collections.emptyList();
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}
