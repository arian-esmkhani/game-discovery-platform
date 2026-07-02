package admin.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "characters" , indexes = {
        @Index(name = "idx_characters_name", columnList = "name"),
        @Index(name = "idx_characters_created_at", columnList = "created_at"),
        @Index(name = "idx_characters_deleted_at", columnList = "deleted_at"),
        @Index(name = "idx_characters_search", columnList = "name, deleted_at")
})
public class Characters {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, columnDefinition = "MEDIUMTEXT")
    private String description;

    @Column(nullable = false, name = "image_url", columnDefinition = "MEDIUMTEXT")
    private String imageUrl;

    @ManyToMany(mappedBy = "characters", fetch = FetchType.LAZY)
    private List<Games> games;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}