package APIGatway.config;

import lombok.RequiredArgsConstructor;
import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.GatewayFilterSpec;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.cloud.gateway.route.builder.UriSpec;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.net.InetSocketAddress;
import java.util.function.Function;

@RequiredArgsConstructor
@Configuration
public class GatewayConfig {

    private final AuthenticationFilter authenticationFilter;
    private final RedisRateLimiter redisRateLimiterForUsers;
    private final RedisRateLimiter redisRateLimiterForPublicEndpoints;
    private final AdminRoleFilter adminRoleFilter;

    public static final String AUTH_SERVICE = "http://localhost:5001";
    public static final String MAIN_SERVICE = "http://localhost:5002";
    public static final String ADMIN_SERVICE = "http://localhost:5003";

    private Mono<String> publicKeyResolver(ServerWebExchange exchange) {
        return Mono.just("public-ip-" + getClientIp(exchange));
    }

    private Mono<String> userKeyResolver(ServerWebExchange exchange) {
        String userId = exchange.getRequest()
                .getHeaders().getFirst("X-User-ID");
        return Mono.just("user-" + (userId != null ? userId : "anonymous"));
    }

    private String getClientIp(ServerWebExchange exchange) {
        InetSocketAddress remoteAddress = exchange.getRequest().getRemoteAddress();
        return remoteAddress != null ? remoteAddress.
                getAddress().getHostAddress() : "unknown";
    }

    // Helper methods
    private Function<GatewayFilterSpec, UriSpec> openEndpointFilter(
            String circuitBreakerName) {
        return f -> f
                .filter(authenticationFilter)
                .requestRateLimiter(config -> config
                        .setRateLimiter(redisRateLimiterForPublicEndpoints)
                        .setKeyResolver(this::publicKeyResolver)
                )
                .circuitBreaker(config -> config
                        .setName(circuitBreakerName)
                        .setFallbackUri("forward:/fallback/main-service")
                );
    }

    private Function<GatewayFilterSpec, UriSpec> userEndpointFilter(
            String circuitBreakerName) {
        return f -> f
                .filter(authenticationFilter)
                .requestRateLimiter(config -> config
                        .setRateLimiter(redisRateLimiterForUsers)
                        .setKeyResolver(this::userKeyResolver)
                )
                .circuitBreaker(config -> config
                        .setName(circuitBreakerName)
                        .setFallbackUri("forward:/fallback/main-service")
                );
    }

    private Function<GatewayFilterSpec, UriSpec> adminEndpointFilter(
            String circuitBreakerName) {
        return f -> f
                .filter(authenticationFilter)
                .filter(adminRoleFilter)
                .requestRateLimiter(config -> config
                        .setRateLimiter(redisRateLimiterForUsers)
                        .setKeyResolver(this::userKeyResolver)
                )
                .circuitBreaker(config -> config
                        .setName(circuitBreakerName)
                        .setFallbackUri("forward:/fallback/admin-service")
                );
    }

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                //===================== MAIN SERVICE ======================

                .route("comment-add",r ->
                        r.path("/api/comment/add")
                                .and().method("POST")
                                .filters(userEndpointFilter("commentAddCircuitBreaker"))
                                .uri(MAIN_SERVICE))

                .route("comment-remove",r ->
                        r.path("/api/remove/{gameId}")
                                .and().method("POST")
                                .filters(userEndpointFilter("commentRemoveCircuitBreaker"))
                                .uri(MAIN_SERVICE))

                .route("comment-get",r ->
                        r.path("/api/get/{gameId}")
                                .and().method("GET")
                                .filters(userEndpointFilter("commentGetCircuitBreaker"))
                                .uri(MAIN_SERVICE))

                .route("favorite-is",r ->
                        r.path("/api/favorite/is")
                                .and().method("POST")
                                .filters(userEndpointFilter("favoriteIsCircuitBreaker"))
                                .uri(MAIN_SERVICE))

                .route("favorite-add",r ->
                        r.path("/api/favorite/add")
                                .and().method("POST")
                                .filters(userEndpointFilter("favoriteAddCircuitBreaker"))
                                .uri(MAIN_SERVICE))

                .route("favorite-remove",r ->
                        r.path("/api/favorite/remove/{gameId}")
                                .and().method("POST")
                                .filters(userEndpointFilter("favoriteRemoveCircuitBreaker"))
                                .uri(MAIN_SERVICE))

                .route("favorite-Get",r ->
                        r.path("/api/favorite/get/{pageNumber}")
                                .and().method("GET")
                                .filters(userEndpointFilter("favoriteGetCircuitBreaker"))
                                .uri(MAIN_SERVICE))

                .route("game-by-id",r ->
                        r.path("/api/game/by/{gameId}")
                                .and().method("GET")
                                .filters(openEndpointFilter("gameByIdCircuitBreaker"))
                                .uri(MAIN_SERVICE))

                .route("game-search",r ->
                        r.path("/api/game/search")
                                .and().method("POST")
                                .filters(openEndpointFilter("gameSearchCircuitBreaker"))
                                .uri(MAIN_SERVICE))

                .route("character-by-id",r ->
                        r.path("/api/independency/by/{characterId}")
                                .and().method("GET")
                                .filters(openEndpointFilter("characterByIdCircuitBreaker"))
                                .uri(MAIN_SERVICE))

                .route("company-by-id",r ->
                        r.path("/api/independency/by/{companyId}")
                                .and().method("GET")
                                .filters(openEndpointFilter("companyByIdCircuitBreaker"))
                                .uri(MAIN_SERVICE))

                .route("slider-trend-games",r ->
                        r.path("/api/slider/trend_games")
                                .and().method("GET")
                                .filters(openEndpointFilter("trend-gamesCircuitBreaker"))
                                .uri(MAIN_SERVICE))

                .route("slider-new-games",r ->
                        r.path("/api/slider/new_games")
                                .and().method("GET")
                                .filters(openEndpointFilter("new-gamesCircuitBreaker"))
                                .uri(MAIN_SERVICE))

                .route("slider-suggested-games",r ->
                        r.path("/api/slider/suggested_games")
                                .and().method("GET")
                                .filters(openEndpointFilter("suggested-gamesCircuitBreaker"))
                                .uri(MAIN_SERVICE))

                .route("slider-survival-games",r ->
                        r.path("/api/slider/survival_games")
                                .and().method("GET")
                                .filters(openEndpointFilter("survival-gamesCircuitBreaker"))
                                .uri(MAIN_SERVICE))

                .route("slider-nostalgia-games",r ->
                        r.path("/api/slider/nostalgia_games")
                                .and().method("GET")
                                .filters(openEndpointFilter("nostalgia-gamesCircuitBreaker"))
                                .uri(MAIN_SERVICE))

                .route("slider-shooter-games",r ->
                        r.path("/api/slider/shooter_games")
                                .and().method("GET")
                                .filters(openEndpointFilter("shooter-gamesCircuitBreaker"))
                                .uri(MAIN_SERVICE))

                .route("characters-sliders",r ->
                        r.path("/api/slider/characters-sliders")
                                .and().method("GET")
                                .filters(openEndpointFilter("characters-slidersCircuitBreaker"))
                                .uri(MAIN_SERVICE))

                .route("companies-slider",r ->
                        r.path("/api/slider/companies-slider")
                                .and().method("GET")
                                .filters(openEndpointFilter("companies-sliderCircuitBreaker"))
                                .uri(MAIN_SERVICE))

                // ==================== AUTH SERVICE ====================

                .route("auth-login", r ->
                        r.path("/api/auth/login")
                                .and().method("POST")
                                .filters(openEndpointFilter("auth-loginCircuitBreaker"))
                                .uri(AUTH_SERVICE))

                .route("auth-register", r ->
                        r.path("/api/auth/register")
                                .and().method("POST")
                                .filters(openEndpointFilter("auth-loginCircuitBreaker"))
                                .uri(AUTH_SERVICE))

                // ==================== ADMIN SERVICE ====================

                .route("cache-clear-all",r ->
                        r.path("/api/cache/clear-all")
                                .and().method("POST")
                                .filters(adminEndpointFilter("/clear-allCircuitBreaker"))
                                .uri(ADMIN_SERVICE))

                .route("cache-clear",r ->
                        r.path("/api/cache/clear/{cacheName}")
                                .and().method("POST")
                                .filters(adminEndpointFilter("/clear-cacheCircuitBreaker"))
                                .uri(ADMIN_SERVICE))

                .route("character-remove-by-id",r ->
                        r.path("/api/character/{characterId}")
                                .and().method("POST")
                                .filters(adminEndpointFilter("/character-remove-by-idCircuitBreaker"))
                                .uri(ADMIN_SERVICE))

                .route("character-save",r ->
                        r.path("/api/character/save")
                                .and().method("POST")
                                .filters(adminEndpointFilter("/character-saveCircuitBreaker"))
                                .uri(ADMIN_SERVICE))

                .route("character-update",r ->
                        r.path("/api/character/update/{characterId}")
                                .and().method("POST")
                                .filters(adminEndpointFilter("/character-updateCircuitBreaker"))
                                .uri(ADMIN_SERVICE))

                .route("character-get",r ->
                        r.path("/api/character/get")
                                .and().method("POST")
                                .filters(adminEndpointFilter("/character-getCircuitBreaker"))
                                .uri(ADMIN_SERVICE))

                .route("character-get-by-id",r ->
                        r.path("/api/character/getById/{characterId}")
                                .and().method("GET")
                                .filters(adminEndpointFilter("/character-get-by-idCircuitBreaker"))
                                .uri(ADMIN_SERVICE))

                .route("company-remove-by-id",r ->
                        r.path("/api/company/{companyId}")
                                .and().method("POST")
                                .filters(adminEndpointFilter("/company-remove-by-idCircuitBreaker"))
                                .uri(ADMIN_SERVICE))

                .route("company-save",r ->
                        r.path("/api/company/save")
                                .and().method("POST")
                                .filters(adminEndpointFilter("/company-saveCircuitBreaker"))
                                .uri(ADMIN_SERVICE))

                .route("company-update",r ->
                        r.path("/api/company/update/{companyId}")
                                .and().method("POST")
                                .filters(adminEndpointFilter("/company-updateCircuitBreaker"))
                                .uri(ADMIN_SERVICE))

                .route("company-get",r ->
                        r.path("/api/company/get")
                                .and().method("POST")
                                .filters(adminEndpointFilter("/company-getCircuitBreaker"))
                                .uri(ADMIN_SERVICE))

                .route("company-get-by-id",r ->
                        r.path("/api/company/getById/{companyId}")
                                .and().method("GET")
                                .filters(adminEndpointFilter("/company-get-by-idCircuitBreaker"))
                                .uri(ADMIN_SERVICE))

                .route("company-remove-by-id",r ->
                        r.path("/api/company/{companyId}")
                                .and().method("POST")
                                .filters(adminEndpointFilter("/company-remove-by-idCircuitBreaker"))
                                .uri(ADMIN_SERVICE))

                .route("genre-save",r ->
                        r.path("/api/genre/save")
                                .and().method("POST")
                                .filters(adminEndpointFilter("/genre-saveCircuitBreaker"))
                                .uri(ADMIN_SERVICE))

                .route("genre-update",r ->
                        r.path("/api/genre/update/{genreId}")
                                .and().method("POST")
                                .filters(adminEndpointFilter("/genre-updateCircuitBreaker"))
                                .uri(ADMIN_SERVICE))

                .route("genre-get",r ->
                        r.path("/api/genre/get")
                                .and().method("POST")
                                .filters(adminEndpointFilter("/genre-getCircuitBreaker"))
                                .uri(ADMIN_SERVICE))

                .route("genre-get-by-id",r ->
                        r.path("/api/genre/getById/{genreId}")
                                .and().method("GET")
                                .filters(adminEndpointFilter("/genre-get-by-idCircuitBreaker"))
                                .uri(ADMIN_SERVICE))

                .route("game-delete",r ->
                        r.path("/api/game/{gameId}")
                                .and().method("POST")
                                .filters(adminEndpointFilter("/gameDeleteCircuitBreaker"))
                                .uri(ADMIN_SERVICE))

                .route("game-save",r ->
                        r.path("/api/game/save")
                                .and().method("POST")
                                .filters(adminEndpointFilter("/gameSaveCircuitBreaker"))
                                .uri(ADMIN_SERVICE))

                .route("game-update",r ->
                        r.path("/api/game/update/{gameId}")
                                .and().method("POST")
                                .filters(adminEndpointFilter("/gameUpdateCircuitBreaker"))
                                .uri(ADMIN_SERVICE))

                .route("game-get",r ->
                        r.path("/api/game/get")
                                .and().method("GET")
                                .filters(adminEndpointFilter("/gameGetCircuitBreaker"))
                                .uri(ADMIN_SERVICE))

                .route("game-get-by-id",r ->
                        r.path("/api/game/getById/{gameId}")
                                .and().method("GET")
                                .filters(adminEndpointFilter("/gameGetByIdCircuitBreaker"))
                                .uri(ADMIN_SERVICE))

                .route("comment-approved",r ->
                        r.path("/api/approved/{commentId}")
                                .and().method("POST")
                                .filters(adminEndpointFilter("commentApprovedCircuitBreaker"))
                                .uri(ADMIN_SERVICE))

                .build();
    }
}