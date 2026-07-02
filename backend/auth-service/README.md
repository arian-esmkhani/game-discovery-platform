# Game Discovery Platform - Auth Service

## Overview

This is the **authentication and authorization service** for the Game Discovery Platform. It handles user registration, login, JWT token generation, and acts as the security gateway for the entire microservices ecosystem.

The service is responsible for:
- User registration (both regular users and admins)
- Authentication via username/password
- JWT token generation with role-based claims
- Gateway-level security filtering to block direct external access

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Java 21** | Core language |
| **Spring Boot 3** | Application framework |
| **Spring Security** | Password encoding and security foundation |
| **Spring Data JPA (Hibernate)** | User persistence in relational DB |
| **Spring Data Redis** | Session/token caching support |
| **JJWT (io.jsonwebtoken)** | JWT generation and validation |
| **Lombok** | Boilerplate reduction |
| **Jakarta Validation** | Input validation |
| **BCrypt** | Password hashing |

### Security Flow

1. **User logs in** → Auth Service validates credentials
2. **JWT generated** → Contains user ID and role (`CUSTOMER` or `ADMIN`)
3. **HttpOnly cookie** → Token stored securely, sent with subsequent requests
4. **API Gateway validates** → Gateway checks JWT + X-Gateway-Key header
5. **Downstream services** → Receive `X-User-ID` header from Gateway

### Gateway Security Filter

The `GatewaySecurityFilter` ensures that **no external client can directly call this service**. All requests must:
- Come through the API Gateway
- Include a valid `X-Gateway-Key` header matching the configured secret

## API Endpoints

All endpoints are prefixed with `/api/auth`

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/login` | Authenticate user, returns JWT in HttpOnly cookie | Public |
| POST | `/register` | Register a new regular user (CUSTOMER role) | Public |
| POST | `/admin/register` | Register a new admin user (ADMIN role) | Internal only |

### Login Request/Response

**Request:**
json
{
    "username": "john_doe",
    "password": "securePassword123",
    "rememberMe": true
}

## Project Structure

AuthService/
├── config/
│   ├── GatewaySecurityFilter.java   # Blocks direct external access
│   ├── RedisConfig.java              # Redis template configuration
│   └── SecurityConfig.java           # Spring Security (disabled for this service)
├── controller/
│   └── AuthController.java           # REST endpoints
├── service/
│   ├── AuthService.java              # Service interface
│   ├── AuthServiceImpl.java          # Business logic
│   └── CustomRole.java               # Role enum (CUSTOMER, ADMIN)
├── repository/
│   └── UserRepository.java           # JPA repository
├── model/
│   └── User.java                     # User entity
├── dto/
│   ├── AuthRequest.java              # Login request
│   ├── AuthResponse.java             # Login response
│   ├── SaveUserDto.java              # Registration request
│   └── ApiResponse.java              # Generic response wrapper
└── util/
    └── JwtUtil.java                  # JWT generation utility
