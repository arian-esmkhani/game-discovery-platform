package APIGatway.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;

//Utility class for handling JWT tokens with comprehensive validation
@Slf4j
@Component
public class JwtUtil {


    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.issuer}")
    private String expectedIssuer;

    @Value("${jwt.audience}")
    private String expectedAudience;

    private Key key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }


    //Extracts all claims object from a JWT token after validation
    public Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    //Extracts the user ID from a JWT token
    public String getUserIdFromToken(String token) {
        return getAllClaimsFromToken(token).getSubject();
    }

    public String getRoleIdFromToken(String token) {
        return getAllClaimsFromToken(token).get("role", String.class);
    }

    //Validates token structure (header.payload.signature)
    private boolean isTokenStructureValid(String token) {
        if (token == null || token.trim().isEmpty()) {
            return false;
        }

        String[] parts = token.split("\\.");
        return parts.length == 3;
    }

    //Validates token issuer
    private boolean isIssuerValid(Claims claims) {
        return expectedIssuer.equals(claims.getIssuer());
    }

    //Validates token audience
    private boolean isAudienceValid(Claims claims) {
        return claims.getAudience().contains(expectedAudience);
    }

    //Checks if token is expired
    private boolean isTokenExpired(Claims claims) {
        return claims.getExpiration().before(new Date());
    }

    //Comprehensive token validation
    public boolean isInvalid(String token) {
        // Step 1: Basic validation
        if (!isTokenStructureValid(token)) {
            log.warn("Token structure is invalid");
            return true;
        }

        // Step 2: JWT parsing and validation
        try {
            Claims claims = getAllClaimsFromToken(token);

            // Step 3: Business logic validation
            if (isTokenExpired(claims)) {
                log.warn("Token is expired");
                return true;
            }

            if (!isIssuerValid(claims)) {
                log.warn("Token issuer is invalid. Expected: {}, Actual: {}",
                        expectedIssuer, claims.getIssuer());
                return true;
            }

            if (!isAudienceValid(claims)) {
                log.warn("Token audience is invalid. Expected: {}, Actual: {}",
                        expectedAudience, claims.getAudience());
                return true;
            }

            log.debug("Token validation successful for user: {}", claims.getSubject());
            return false;

        } catch (SignatureException e) {
            log.warn("Token signature invalid: {}", e.getMessage());
            return true;
        } catch (MalformedJwtException e) {
            log.warn("Token malformed: {}", e.getMessage());
            return true;
        } catch (UnsupportedJwtException e) {
            log.warn("Token unsupported: {}", e.getMessage());
            return true;
        } catch (Exception e) {
            log.error("Unexpected error during token validation: {}", e.getMessage());
            return true;
        }
    }
}