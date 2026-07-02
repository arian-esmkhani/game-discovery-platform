package AuthService.service;

import AuthService.model.User;
import AuthService.Repository.UserRepository;
import AuthService.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional(readOnly = true)
    public Optional<User> validateUser(String username, String password) {

        return userRepository.findByUsername(username)
                .filter(user -> passwordEncoder.matches(password,
                        user.getPassword()));
    }

    @Transactional
    public void saveUser(String username, String password, String email) {
        String trimmedUsername = username.trim();
        String trimmedEmail = email.trim().toLowerCase(); // normalize email

        if (userRepository.existsByUsername(trimmedUsername)) {
            throw new IllegalArgumentException("Username already exists");
        }

        if (userRepository.existsByEmail(trimmedEmail)) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setUsername(trimmedUsername);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(trimmedEmail);
        user.setRole(CustomRole.CUSTOMER.getValue());

        userRepository.save(user);
    }

    @Transactional
    public void saveAdminUser(String username, String password, String email) {
        String trimmedUsername = username.trim();
        String trimmedEmail = email.trim().toLowerCase(); // normalize email

        if (userRepository.existsByUsername(trimmedUsername)) {
            throw new IllegalArgumentException("Username already exists");
        }

        if (userRepository.existsByEmail(trimmedEmail)) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setUsername(trimmedUsername);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(trimmedEmail);
        user.setRole(CustomRole.ADMIN.getValue());

        userRepository.save(user);
    }

    public String generateToken(String role, Long id, boolean rememberMe) {

        long expirationMs = rememberMe ?
                Duration.ofDays(30).toMillis() :
                Duration.ofHours(2).toMillis();
        return jwtUtil.generateToken(role, id, expirationMs);
    }
}
