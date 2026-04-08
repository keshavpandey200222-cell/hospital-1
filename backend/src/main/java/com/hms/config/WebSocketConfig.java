package com.hms.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(@org.springframework.lang.NonNull StompEndpointRegistry registry) {
        // Register the "/ws" endpoint, enabling the SockJS fallback options so that 
        // alternate transports can be used if WebSocket is not available.
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // Allow all origins for the demo
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(@org.springframework.lang.NonNull MessageBrokerRegistry config) {
        // Topic prefix for messages going from Server -> Client
        config.enableSimpleBroker("/topic", "/queue");
        
        // Prefix for messages going from Client -> Server
        config.setApplicationDestinationPrefixes("/app");
        
        // Prefix for individual users (e.g., for private chat)
        config.setUserDestinationPrefix("/user");
    }
}
