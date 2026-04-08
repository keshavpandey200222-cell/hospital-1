package com.hms.api.controller;

import com.hms.application.EmergencyResponseService;
import com.hms.domain.Patient;
import com.hms.domain.SosAlert;
import com.hms.infrastructure.persistence.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/emergency")
@CrossOrigin(origins = "http://localhost:3000")
public class EmergencyController {

    @Autowired
    private EmergencyResponseService emergencyService;

    @Autowired
    private PatientRepository patientRepository;

    @PostMapping("/sos")
    public ResponseEntity<SosAlert> triggerSOS(@RequestBody Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        double lat = Double.parseDouble(payload.get("latitude").toString());
        double lon = Double.parseDouble(payload.get("longitude").toString());
        String type = (String) payload.getOrDefault("type", "GENERAL");

        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Patient not found for user: " + userId));

        return ResponseEntity.ok(emergencyService.triggerSOS(patient, lat, lon, type));
    }

    @GetMapping("/hospital/{hospitalId}/active")
    public ResponseEntity<List<SosAlert>> getHospitalAlerts(@PathVariable Long hospitalId) {
        return ResponseEntity.ok(emergencyService.getActiveAlertsForHospital(hospitalId));
    }
}
