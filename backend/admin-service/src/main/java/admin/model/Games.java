package admin.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "game", indexes = {
        @Index(name = "idx_game_name", columnList = "name"),
        @Index(name = "idx_game_created_at", columnList = "created_at"),
        @Index(name = "idx_game_deleted_at", columnList = "deleted_at"),
        @Index(name = "idx_game_is_nostalgia", columnList = "is_nostalgia"),
        @Index(name = "idx_game_is_trend", columnList = "is_trend"),
        @Index(name = "idx_game_produced_in", columnList = "produced_in"),
        @Index(name = "idx_game_search", columnList = "name, deleted_at"),
        @Index(name = "idx_game_status", columnList = "is_nostalgia, is_trend, is_suggested")
})
public class Games {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, columnDefinition = "MEDIUMTEXT")
    private String description;

    @Column(nullable = false, name = "image_url", columnDefinition = "MEDIUMTEXT")
    private String imageUrl;

    @Column(name = "is_nostalgia")
    private boolean isNostalgia = false;

    @Column(name = "is_trend")
    private boolean isTrend = false;

    @Column(name = "is_suggested")
    private boolean isSuggested = false;

    @Column(name = "produced_in")
    private LocalDate producedIn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "genre_id", nullable = false)
    private Genres genre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Companies company;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "game_character",
            joinColumns = @JoinColumn(name = "game_id"),
            inverseJoinColumns = @JoinColumn(name = "character_id")
    )
    private List<Characters> characters = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}