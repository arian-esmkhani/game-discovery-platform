package main.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import main.dto.ApiResponse;
import main.dto.CommentDto;
import main.model.Comment;
import main.service.CommentService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@Slf4j
@Validated
@RestController
@RequestMapping("/api/comment")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private static final long MAX_ID = 999_999_999L;
    private static final String SAFE_STRING_PATTERN = "^[a-zA-Z0-9\\s\\-_.]*$|^$";


    @PostMapping("/add")
    public void addComment(
            @RequestHeader("X-User-ID") Long userId,
            @Valid @RequestBody CommentDto comment) {

        if (userId == null) {
            throw new IllegalArgumentException("User ID is missing");
        }

        commentService.addComment(userId, comment);
    }

    @PostMapping("/remove/{gameId}")
    public void removeComment(
            @RequestHeader("X-User-ID") Long userId,
            @PathVariable @Positive Long gameId) {

        if (userId == null) {
            throw new IllegalArgumentException("User ID is missing");
        }

        if (gameId > MAX_ID) {
            log.warn("Suspicious game ID detected: {}", gameId);
            throw new SecurityException("Invalid game ID");
        }

        commentService.removeComment(userId, gameId);
    }

    @GetMapping("get/{gameId}")
    public ResponseEntity<ApiResponse<List<String>>> findGameCommentByGameId(
            @PathVariable @Positive Long gameId)
    {
        try {
            List<String> comments  = commentService.findGameCommentByGameId(gameId);

            if (comments.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                        new ApiResponse<>(
                                true,
                                "do not existed any comment",
                                Collections.emptyList()
                        )
                );
            }

            return ResponseEntity.ok().body(
                    new ApiResponse<>(
                            true,
                            "Data retrieved successfully",
                            comments
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ApiResponse<>(
                            false,
                            "Error retrieving data: " + e.getMessage(),
                            null
                    )
            );
        }
    }

    @PostMapping("/approved/{commentId}")
    public void approvedComment(@PathVariable @Max(MAX_ID) String commentId) {

        if (commentId != null && !commentId.matches(SAFE_STRING_PATTERN)) {
            log.warn("Security validation failed for search request");
            throw new SecurityException("Invalid game Name");
        }

        commentService.approvedComment(commentId);
    }

    public ResponseEntity<ApiResponse<Page<Comment>>> findAllComments(
            @PathVariable @Positive int pageNumber)
    {
       try {
           Page<Comment> comment = commentService.findAllComments(pageNumber);
           if (comment.isEmpty()) {
               return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                       new ApiResponse<>(
                               true,
                               "do not existed any comment",
                               null
                       )
               );
           }

           return ResponseEntity.ok().body(
                   new ApiResponse<>(
                           true,
                           "Data retrieved successfully",
                           comment
                   )
           );
       } catch (Exception e) {
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                   new ApiResponse<>(
                           false,
                           "Error retrieving data: " + e.getMessage(),
                           null
                   )
           );
       }
    }
}
