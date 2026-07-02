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
@Document(collection = "favorite")
public class FavoriteGame {
    @Id
    private String id;

    @Indexed(name = "user_game_idx", unique = true)
    private long userId;

    @Indexed
    private long gameId;

    @Indexed(name = "created_at_idx")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
