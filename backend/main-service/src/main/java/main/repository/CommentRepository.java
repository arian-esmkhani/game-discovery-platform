package main.repository;

import main.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {

    void deleteByUserIdAndGameId(long userId, long gameId);

    @Query(value = "{ 'gameId': ?0, 'approved': true }",
            sort = "{ 'createdAt': -1 }",
            fields = "{ '_id': 0, 'comment': 1 }")
    List<Comment> findCommentsByGameId(long gameId, Pageable pageable);

    @Query(value = "{ 'approved': false }",
            sort = "{ 'createdAt': -1 }",
            fields = "{ 'comment': 1 }")
    Page<Comment> findAllComments(Pageable pageable);
}
