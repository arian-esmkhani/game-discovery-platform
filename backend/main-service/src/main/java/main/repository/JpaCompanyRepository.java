package main.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import main.dto.DataDto;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class JpaCompanyRepository implements CompanyRepository{

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<DataDto> fineCompanyById(long companyId) {
        try {
            TypedQuery<DataDto> query = entityManager.createQuery("""
                    SELECT NEW main.dto.DataDto(
                        c.id, c.name, c.imageUrl
                    )
                    FROM Companies c
                    WHERE c.id = :id
                    """, DataDto.class);
            query.setParameter("id", companyId);
            return Optional.ofNullable(query.getSingleResult());
        } catch (NoResultException e) {
            throw new NoResultException();
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}
