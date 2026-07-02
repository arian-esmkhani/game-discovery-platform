package APIGatway.config;

import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class RateLimiterConfig {

    @Bean
    @Primary
    public RedisRateLimiter redisRateLimiterForUsers() {
        return new RedisRateLimiter(15, 40);
    }

    @Bean
    public RedisRateLimiter redisRateLimiterForPublicEndpoints() {
        return new RedisRateLimiter(50, 100);
    }

    @Bean
    public RedisRateLimiter redisRateLimiterForSensitiveEndpoints() {
        return new RedisRateLimiter(3, 10);
    }
}