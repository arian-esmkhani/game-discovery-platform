package APIGatway.config;

import APIGatway.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AuthenticationFilter implements GatewayFilter {

    private final RouterValidator validator;
    private final JwtUtil jwtUtil;

    @Value("${gateway.secret.key}")
    private String gatewaySecretKey;

    @Value("${jwt.cookie.name}")
    private String jwtCookieName;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        ServerHttpRequest.Builder mutatedRequest = request.mutate()
                .header("X-Gateway-Key", gatewaySecretKey);

        if (validator.isSecured.test(request)) {
            if (this.isAuthMissing(request)) {
                return this.redirectToLogin(exchange);
            }

            final String token = this.getTokenFromCookie(request);

            if (token == null) {
                return this.onError(exchange, "JWT token not found in cookies");
            }

            if (jwtUtil.isInvalid(token)) {
                return this.onError(exchange, "JWT token is invalid");
            }

            String userId = jwtUtil.getUserIdFromToken(token);
            mutatedRequest.header("X-User-ID", userId);

            String role = jwtUtil.getRoleIdFromToken(token);
            mutatedRequest.header("X-User-ROLE", role);
        }

        ServerHttpRequest modifiedRequest = mutatedRequest.build();
        return chain.filter(exchange.mutate().request(modifiedRequest).build());
    }

    private Mono<Void> redirectToLogin(ServerWebExchange exchange) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);

        String currentPath = exchange.getRequest().getURI().getPath();
        String queryString = exchange.getRequest().getURI().getQuery();

        String fullPath = currentPath;
        if (queryString != null && !queryString.isEmpty()) {
            String encodedPath = URLEncoder.encode(currentPath, StandardCharsets.UTF_8);
            fullPath = encodedPath + "?" + queryString;
        } else {
            fullPath = URLEncoder.encode(currentPath, StandardCharsets.UTF_8);
        }

        response.getHeaders().set("X-Auth-Required", "true");
        response.getHeaders().set("X-Redirect-Path",
                URLEncoder.encode(fullPath, StandardCharsets.UTF_8));

        return response.setComplete();
    }

    private Mono<Void> onError(ServerWebExchange exchange, String msg) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);

        DataBuffer buffer = response.bufferFactory().wrap(msg.getBytes(StandardCharsets.UTF_8));
        response.getHeaders().add("Content-Type", "text/plain;charset=UTF-8");

        return response.writeWith(Mono.just(buffer));
    }

    private String getTokenFromCookie(ServerHttpRequest request) {
        return Optional.ofNullable(request.getCookies())
                .map(cookies -> cookies.getFirst(jwtCookieName))
                .map(HttpCookie::getValue)
                .orElse(null);
    }

    private boolean isAuthMissing(ServerHttpRequest request) {
        return !request.getCookies().containsKey(jwtCookieName);
    }
}