package com.hms;

import com.hms.domain.User;
import com.hms.infrastructure.persistence.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(HmsApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(UserRepository userRepository) {
        return args -> {
            if (userRepository.findByEmail("admin@nexushealth.com").isEmpty()) {
                User admin = new User();
                admin.setEmail("admin@nexushealth.com");
                // Password: password123 (BCrypted)
                admin.setPasswordHash("$2a$12$N9.9.QYd8Z0E3q3X4WJmGuc8x.g6fL5.E0.zF00x9sZ3/Qf7lG34y");
                admin.setRole("ADMIN");
                userRepository.save(admin);
                System.out.println("Default admin user created: admin@nexushealth.com");
            }
        };
    }
}
