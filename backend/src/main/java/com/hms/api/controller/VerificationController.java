package com.hms.api.controller;

import com.hms.application.VerificationService;
import com.hms.domain.DoctorVerification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/verify")
public class VerificationController {

    private final VerificationService verificationService;

    public VerificationController(VerificationService verificationService) {
        this.verificationService = verificationService;
    }

    @PostMapping("/submit")
    public ResponseEntity<DoctorVerification> submitVerification(@RequestBody Map<String, String> request) {
        Long doctorId = Long.parseLong(request.get("doctorId"));
        String docType = request.get("docType");
        String filePath = request.get("filePath");
        String licenseNumber = request.get("licenseNumber");
        String qualification = request.get("qualification");

        return ResponseEntity.ok(verificationService.submitVerification(doctorId, docType, filePath, licenseNumber, qualification));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<DoctorVerification>> getPendingVerifications() {
        return ResponseEntity.ok(verificationService.getPendingVerifications());
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<DoctorVerification> approveVerification(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String adminNotes = request.getOrDefault("notes", "Verified by Admin");
        return ResponseEntity.ok(verificationService.updateVerificationStatus(id, "APPROVED", adminNotes));
    }

    @PostMapping("/reject/{id}")
    public ResponseEntity<DoctorVerification> rejectVerification(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String adminNotes = request.getOrDefault("notes", "Rejected by Admin");
        return ResponseEntity.ok(verificationService.updateVerificationStatus(id, "REJECTED", adminNotes));
    }
}
