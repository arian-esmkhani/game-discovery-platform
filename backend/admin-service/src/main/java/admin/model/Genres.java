package admin.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "genres", indexes = {
        @Index(name = "idx_genres_name", columnList = "name"),
        @Index(name = "idx_genres_created_at", columnList = "created_at"),
        @Index(name = "idx_genres_deleted_at", columnList = "deleted_at"),
        @Index(name = "idx_genres_search", columnList = "name, deleted_at")
})
public class Genres {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, columnDefinition = "MEDIUMTEXT")
    private String description;

    @OneToMany(mappedBy = "genre", cascade = CascadeType.ALL)
    private List<Games> games;

    @Column(nullable = false, name = "image_url", columnDefinition = "MEDIUMTEXT")
    private String imageUrl;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}