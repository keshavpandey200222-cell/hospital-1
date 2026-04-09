package com.hms.api.controller;

import com.hms.api.dto.LoginRequest;
import com.hms.api.dto.LoginResponse;
import com.hms.domain.User;
import com.hms.infrastructure.persistence.UserRepository;
import com.hms.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(originPatterns = {"http://localhost:*", "https://hms-frontend-45nu.onrender.com"})
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
                String jwt = jwtUtils.generateTokenFromEmail(user.getEmail(), user.getRole());
                return ResponseEntity.ok(new LoginResponse(jwt, user.getEmail(), user.getRole()));
            }
        }
        
        return ResponseEntity.status(401).body("Error: Unauthorized. Invalid email or password.");
    }
}
