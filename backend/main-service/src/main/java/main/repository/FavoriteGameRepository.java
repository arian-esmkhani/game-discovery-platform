package main.repository;

import main.model.FavoriteGame;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FavoriteGameRepository extends MongoRepository<FavoriteGame, String> {

    boolean existsByUserIdAndGameId(long userId, long gameId);

    void deleteByUserIdAndGameId(long userId, long gameId);

    @Query(value = "{ 'userId': ?0 }", fields = "{ '_id': 0, 'gameId': 1 }")
    Page<FavoriteGame> findGameIdsByUserId(long userId, Pageable pageable);
}
