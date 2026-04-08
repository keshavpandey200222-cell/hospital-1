package com.hms.application;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SymptomAnalyzerService {

    private static final Map<String, String> SYMPTOM_TO_SPECIALTY = new HashMap<>();

    static {
        // Rule-based mapping
        SYMPTOM_TO_SPECIALTY.put("chest pain", "Cardiologist");
        SYMPTOM_TO_SPECIALTY.put("sweating", "Cardiologist");
        SYMPTOM_TO_SPECIALTY.put("dizziness", "Cardiologist");
        
        SYMPTOM_TO_SPECIALTY.put("fever", "General Physician");
        SYMPTOM_TO_SPECIALTY.put("cough", "General Physician");
        SYMPTOM_TO_SPECIALTY.put("sore throat", "General Physician");
        
        SYMPTOM_TO_SPECIALTY.put("headache", "Neurologist");
        SYMPTOM_TO_SPECIALTY.put("seizure", "Neurologist");
        
        SYMPTOM_TO_SPECIALTY.put("skin rash", "Dermatologist");
        SYMPTOM_TO_SPECIALTY.put("itching", "Dermatologist");
        
        SYMPTOM_TO_SPECIALTY.put("fracture", "Orthopedic");
        SYMPTOM_TO_SPECIALTY.put("joint pain", "Orthopedic");
        
        SYMPTOM_TO_SPECIALTY.put("stomach pain", "Gastroenterologist");
        SYMPTOM_TO_SPECIALTY.put("nausea", "Gastroenterologist");
    }

    public String analyzeSpecialty(String symptoms) {
        String lowerSymptoms = symptoms.toLowerCase();
        
        // Find the best match specialty based on keyword occurrences
        Map<String, Integer> specialtyCounts = new HashMap<>();
        
        for (Map.Entry<String, String> entry : SYMPTOM_TO_SPECIALTY.entrySet()) {
            if (lowerSymptoms.contains(entry.getKey())) {
                specialtyCounts.put(entry.getValue(), specialtyCounts.getOrDefault(entry.getValue(), 0) + 1);
            }
        }
        
        return specialtyCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("General Physician");
    }

    public boolean isEmergency(String symptoms) {
        String lowerSymptoms = symptoms.toLowerCase();
        return lowerSymptoms.contains("chest pain") || 
               lowerSymptoms.contains("difficulty breathing") || 
               lowerSymptoms.contains("unconscious");
    }
}
