# Game Discovery Platform - Core Content Service

## Overview

This service is a core component of a **Game Discovery Platform**, built using a microservices architecture. It manages all game-related content, including game metadata, characters, companies, user comments, and favorite games.

The service is responsible for:
- Serving game, character, and company information for the main website sliders and search.
- Managing user-generated comments on games with an approval workflow.
- Handling user favorite games lists.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Java 21** | Core language |
| **Spring Boot 3** | Application framework |
| **Spring Data JPA (Hibernate)** | Access to relational DB (MySQL) for games, characters, companies |
| **Spring Data MongoDB** | Access to MongoDB for comments and user favorites |
| **Spring Cache + Redis** | Caching for static slider data (TTL: 5 hours) |
| **Lombok** | Boilerplate reduction |
| **Jakarta Validation** | Input validation |

## Architecture Highlights

### Database Strategy (Polyglot Persistence)

| Database | Purpose |
|----------|---------|
| **Relational DB** | Stores normalized game, character, company, and genre data with relationships |
| **MongoDB** | Stores high-write, low-relationship data: comments and favorite games |

### Caching Strategy

- **Redis** is used as the cache backend.
- **Static slider data** (trending games, new games, suggested games, etc.) is cached with a TTL of 5 hours (configured as `static` cache in `CacheConfig`).
- **User-specific data** (comments, favorites) is not cached to ensure real-time accuracy.

### Key Design Patterns

| Pattern | Implementation |
|---------|----------------|
| Repository Pattern | `JpaGameRepository`, `JpaCharacterRepository`, `MongoRepository` implementations |
| DTO Pattern | `DataDto`, `GameDataResponseDto`, `GameInTrendSliderDto`, `CommentDto` |
| Service Layer | All business logic in `@Service` classes |
| Caching Abstraction | `@Cacheable` on slider service methods |

## API Endpoints

### Game Endpoints (`/api/game`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/by/{gameId}` | Get full game details by ID (with characters) |
| POST | `/search` | Search games by name, company, or genre |

### Slider Endpoints (`/api/slider`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/trend_games` | Get trending games (with descriptions) |
| GET | `/new-games` | Get newest games |
| GET | `/suggested-games` | Get suggested games |
| GET | `/nostalgia-games` | Get nostalgia-tagged games |
| GET | `/survival-games` | Get survival genre games |
| GET | `/shooter-games` | Get shooter genre games |
| GET | `/characters-sliders` | Get character list |
| GET | `/companies-slider` | Get company list |

### Comment Endpoints (`/api/comment`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/add` | Add a comment to a game (requires `X-User-ID` header) |
| POST | `/remove/{gameId}` | Remove user's comment from a game |
| GET | `/get/{gameId}` | Get approved comments for a game (max 7) |
| POST | `/approved/{commentId}` | Approve a pending comment (admin action) |

### Favorite Endpoints (`/api/favorite`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/is` | Check if a game is favorited by user |
| POST | `/add` | Add a game to user's favorites |
| POST | `/remove/{gameId}` | Remove a game from favorites |
| GET | `/get/{pageNumber}` | Get paginated favorite games for user |

### Independency Endpoints (`/api/independency`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/by/{characterId}` | Get character by ID |
| GET | `/by/{companyId}` | Get company by ID |

## Security & Validation

- **Input Validation**: All endpoints use `@Valid` and `@Positive` annotations.
- **ID Range Checks**: System rejects suspicious large IDs (`> 999,999,999`).
- **SQL Injection Prevention**: JPQL with parameterized queries.
- **X-User-ID Header**: Required for user-specific operations (authenticated via API Gateway).

## Configuration

### Cache Configuration (`CacheConfig.java`)

| Cache Name | TTL | Purpose |
|------------|-----|---------|
| Default | 2 hours | General caching |
| `user` | 20 minutes | User-specific data |
| `static` | 5 hours | Slider data that changes rarely |

### Redis Configuration (`RedisConfig.java`)

- Key Serializer: `StringRedisSerializer`
- Value Serializer: `GenericJackson2JsonRedisSerializer`
- Supports both standard and hash operations.

## Project Structure
main/
├── config/ # Redis & Cache configuration
├── controller/ # REST endpoints (Game, Slider, Comment, Favorite, Independency)
├── service/ # Business logic layer
├── repository/ # Data access (JPA + MongoDB)
├── model/ # JPA & MongoDB entities
├── dto/ # Data transfer objects
└── exception/ # Global exception handlers (implied)

