package main.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import main.dto.CommentDto;
import main.model.Comment;
import main.repository.CommentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService{

    private final CommentRepository commentRepository;
    private static final int PAGE_SIZE = 7;

    @Override
    @Transactional
    public void addComment(long userId, CommentDto comment){
        Comment gameComment = Comment.builder()
                .gameId(comment.gameId())
                .userId(userId)
                .comment(comment.comment())
                .build();

        commentRepository.save(gameComment);
    }

    @Override
    @Transactional
    public void removeComment(long userId, long gameId) {
        commentRepository.deleteByUserIdAndGameId(userId, gameId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> findGameCommentByGameId(long gameId) {
        Pageable top10 = PageRequest.of(0, PAGE_SIZE);

        List<Comment> gameComments = commentRepository.findCommentsByGameId(
                gameId, top10);

        return gameComments
                .stream()
                .map(Comment::getComment)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Comment> findAllComments(int pageNumber) {
        Pageable pageable = PageRequest.of(
                pageNumber,
                PAGE_SIZE,
                Sort.by("createdAt").descending()
        );

        return commentRepository.findAllComments(pageable);
    }

    @Override
    @Transactional
    public void approvedComment(String commentId){
        Optional<Comment> gameComment = commentRepository.findById(commentId);
        if (gameComment.isEmpty()) {
            throw new EntityNotFoundException("not found for ID: " + commentId);
        }

        Comment comment = gameComment.get();
        comment.setApproved(true);
        comment.setUpdatedAt(LocalDateTime.now());

        commentRepository.save(comment);
    }
}
