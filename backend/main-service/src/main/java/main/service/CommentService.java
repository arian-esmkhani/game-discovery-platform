package main.service;

import main.dto.CommentDto;
import main.model.Comment;
import org.springframework.data.domain.Page;

import java.util.List;

public interface CommentService {
    void addComment(long userId, CommentDto comment);
    void removeComment(long userId, long gameId);
    List<String> findGameCommentByGameId(long gameId);
    Page<Comment> findAllComments(int pageNumber);
    void approvedComment(String commentId);
}
