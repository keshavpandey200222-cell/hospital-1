package com.hms.application;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.HashMap;
import java.util.Map;

@Service
public class ChatService {

    private final String ML_SERVICE_URL = "http://localhost:8000/ai/chat";
    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> processMessage(String message) {
        try {
            // Prepare request for Python ML Service
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("symptoms", message);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

            // Call Python ML Service
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(ML_SERVICE_URL, entity, Map.class);

            if (response == null) {
                return fallbackResponse();
            }

            return response;

        } catch (Exception e) {
            return fallbackResponse();
        }
    }

    private Map<String, Object> fallbackResponse() {
        Map<String, Object> fallback = new HashMap<>();
        fallback.put("reply", "I'm having trouble connecting to my clinical brain right now. How can I help you manually?");
        fallback.put("intent", "ERROR");
        fallback.put("action", "NONE");
        return fallback;
    }
}
