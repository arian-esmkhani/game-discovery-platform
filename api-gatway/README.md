# Game Discovery Platform - API Gateway

## Overview

This is the **API Gateway** for the Game Discovery Platform, serving as the single entry point for all client requests. It handles authentication, authorization, rate limiting, circuit breaking, and request routing to downstream microservices.

The gateway is responsible for:
- JWT token validation for secured endpoints
- Role-based access control (admin vs. regular user)
- Rate limiting per user and per IP address
- Circuit breaker pattern for fault tolerance
- Request forwarding to Auth, Content, and Admin services
- Adding internal security headers (`X-Gateway-Key`, `X-User-ID`, `X-User-Role`)

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Java 21** | Core language |
| **Spring Cloud Gateway** | Reactive API Gateway |
| **Spring Cloud Circuit Breaker (Resilience4j)** | Fault tolerance |
| **Spring Boot Data Redis** | Rate limiting storage |
| **Spring Security (WebFlux)** | Security foundation (disabled for routing) |
| **JJWT (io.jsonwebtoken)** | JWT validation |
| **Lombok** | Boilerplate reduction |
| **Project Reactor** | Reactive programming |

## Project Structure

APIGatway/
├── config/
│   ├── GatewayConfig.java           # Route definitions (50+ routes)
│   ├── AuthenticationFilter.java    # JWT validation & header injection
│   ├── AdminRoleFilter.java         # Admin role verification
│   ├── RouterValidator.java         # Open vs secured endpoint classification
│   ├── RateLimiterConfig.java       # Redis rate limiter beans
│   └── SecurityConfig.java          # Spring WebFlux security (permit all)
├── controller/
│   └── FallbackController.java      # Circuit breaker fallback responses
├── util/
│   └── JwtUtil.java                 # JWT parsing and validation logic
└── ... (other classes)