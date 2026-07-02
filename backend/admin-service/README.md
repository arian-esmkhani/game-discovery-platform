# Game Discovery Platform - Admin Service

## Overview

This is the **administrative backend service** for the Game Discovery Platform. It provides comprehensive CRUD operations for managing all core content entities including games, characters, companies, and genres. This service is intended for internal/admin use only and should never be exposed directly to end users.

The service is responsible for:
- Managing games (create, read, update, soft-delete)
- Managing characters (create, read, update, soft-delete)
- Managing companies (create, read, update, soft-delete)
- Managing genres (create, read, update, soft-delete)
- Cache invalidation for static content after any modification

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Java 21** | Core language |
| **Spring Boot 3** | Application framework |
| **Spring Data JPA (Hibernate)** | ORM for relational database access |
| **Spring Cache + Redis** | Caching for static content with TTL management |
| **Spring Validation** | Input validation |
| **Lombok** | Boilerplate reduction |
| **SLF4J + Logback** | Logging |

### Project Structure

admin/
├── config/
│   ├── CacheConfig.java      # Redis cache configuration
│   ├── CorsConfig.java        # CORS for Angular admin panel
│   └── RedisConfig.java       # Redis template configuration
├── controller/
│   ├── GamesController.java
│   ├── CharacterController.java
│   ├── CompanyController.java
│   ├── GenresController.java
│   └── CacheController.java
├── service/
│   ├── GameService.java / GameServiceImpl.java
│   ├── CharactersService.java / CharactersServiceImpl.java
│   ├── CompaniesService.java / CompanyServiceImpl.java
│   ├── GenresService.java / GenresServiceImpl.java
│   └── CacheService.java
├── repository/
│   ├── GamesRepository.java
│   ├── CharactersRepository.java
│   ├── CompaniesRepository.java
│   └── GenresRepository.java
├── model/
│   ├── Games.java
│   ├── Characters.java
│   ├── Companies.java
│   └── Genres.java
├── dto/
│   ├── SaveGameDto.java
│   ├── SaveDto.java          # For character/company/genre save
│   ├── SearchRequestDto.java
│   ├── SearchDataDto.java
│   ├── GameResponseDto.java
│   ├── UpdateResponseDto.java
│   └── ApiResponse.java
└── exception/                # Global exception handlers