package AuthService.controller;

import AuthService.dto.*;
import AuthService.model.User;
import AuthService.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody AuthRequest request,
            HttpServletResponse response) {

        //Validate user password
        Optional<User> user = authService.validateUser(request.username(),
                request.password());

        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(
                            "Invalid credentials",
                            null));
        }

        //Generate JWT token
        String token = authService.generateToken(
                user.get().getRole(), user.get().getId(), request.rememberMe());

        Cookie cookie = new Cookie("jwt_token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setAttribute("SameSite", "Lax");
        cookie.setPath("/");
        int maxAgeSeconds = request.rememberMe() ?
                (int) Duration.ofDays(30).getSeconds() :
                (int) Duration.ofHours(2).getSeconds();
        cookie.setMaxAge(maxAgeSeconds);
        response.addCookie(cookie);

        //Response with user userName for welcome
        return ResponseEntity.ok(new AuthResponse(
                "Login successful", user.get().getUsername()));
    }

    @PostMapping("/admin/register")
    public ResponseEntity<ApiResponse<Void>> adminRegister(
            @Valid @RequestBody SaveUserDto saveUserDto) {
        try {
            authService.saveAdminUser(
                    saveUserDto.username(),
                    saveUserDto.password(),
                    saveUserDto.email()
            );
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "successfully",
                            null
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error(e.getMessage())
            );
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(
            @Valid @RequestBody SaveUserDto saveUserDto) {
        try {
            authService.saveUser(
                    saveUserDto.username(),
                    saveUserDto.password(),
                    saveUserDto.email()
            );
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "successfully",
                            null
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error(e.getMessage())
            );
        }
    }
}