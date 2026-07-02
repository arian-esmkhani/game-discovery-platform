package main.model;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "comment")
public class Comment {
    @Id
    private String id;

    @Indexed(name = "user_game-comment_idx")
    private long userId;

    @Indexed
    private long gameId;

    private String comment;

    @Builder.Default
    private boolean approved = false;

    @Builder.Default
    @Indexed
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;
}
