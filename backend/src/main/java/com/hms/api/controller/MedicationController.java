package com.hms.api.controller;

import com.hms.application.MedicationService;
import com.hms.domain.Medication;
import com.hms.domain.MedicationLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medications")
@CrossOrigin(origins = "http://localhost:3000")
public class MedicationController {

    @Autowired
    private MedicationService medicationService;

    @PostMapping("/prescribe")
    public ResponseEntity<Medication> prescribeMedication(@RequestBody Medication medication) {
        return ResponseEntity.ok(medicationService.prescribeMedication(medication));
    }

    @GetMapping("/patient/{patientId}/schedule")
    public ResponseEntity<List<MedicationLog>> getTodaysSchedule(@PathVariable Long patientId) {
        return ResponseEntity.ok(medicationService.getTodaysSchedule(patientId));
    }

    @PatchMapping("/logs/{logId}/take")
    public ResponseEntity<Void> markAsTaken(@PathVariable Long logId) {
        medicationService.markAsTaken(logId);
        return ResponseEntity.noContent().build();
    }
}
