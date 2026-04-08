package com.hms.api.controller;

import com.hms.application.SymptomAnalyzerService;
import com.hms.application.SuggestionService;
import com.hms.domain.Doctor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/suggestions")
@CrossOrigin(origins = "http://localhost:3000")
public class SuggestionController {

    @Autowired
    private SymptomAnalyzerService symptomAnalyzerService;

    @Autowired
    private SuggestionService suggestionService;

    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyzeSymptoms(@RequestBody Map<String, String> payload) {
        String symptoms = payload.get("symptoms");
        String specialty = symptomAnalyzerService.analyzeSpecialty(symptoms);
        boolean isEmergency = symptomAnalyzerService.isEmergency(symptoms);
        
        return ResponseEntity.ok(Map.of(
            "specialty", specialty,
            "isEmergency", isEmergency
        ));
    }

    @PostMapping("/recommend")
    public ResponseEntity<List<SuggestionService.RankedDoctor>> getRecommendations(@RequestBody Map<String, Object> payload) {
        String specialty = (String) payload.get("specialty");
        double userLat = (double) payload.get("latitude");
        double userLon = (double) payload.get("longitude");
        
        return ResponseEntity.ok(suggestionService.getRankedSuggestions(specialty, userLat, userLon));
    }
}
