package APIGatway.config;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

//Validator to determine which routes are secured.
@Component
public class RouterValidator {

    public static final List<String> openApiEndpoints = List.of(
            "/api/auth/register",
            "/api/auth/login",
            "/api/game/by/{gameId}",
            "/api/game/search",
            "/api/independency/by/{characterId}",
            "/api/independency/by/{companyId}",
            "/api/slider/trend_games",
            "/api/slider/new-games",
            "/api/slider/suggested-games",
            "/api/slider/survival-games",
            "/api/slider/nostalgia-games",
            "/api/slider/shooter-games",
            "/api/slider/characters-sliders",
            "/api/slider/companies-slider"
    );

    public Predicate<ServerHttpRequest> isSecured =
            request -> openApiEndpoints
                    .stream()
                    .noneMatch(uri -> {
                        String requestPath = request.getURI().getPath();

                        return requestPath.equals(uri) ||
                                requestPath.startsWith(uri + "/");
                    });
}