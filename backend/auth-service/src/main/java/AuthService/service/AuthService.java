package AuthService.service;

import AuthService.model.User;

import java.util.Optional;

//Service created for doing the login and register need
public interface AuthService {
    Optional<User> validateUser(String username, String password);
    void saveUser(String username, String password, String email);
    void saveAdminUser(String username, String password, String email);

    //Generate token that will being chek in API gateway
    String generateToken(String role, Long id, boolean rememberMe);
}
