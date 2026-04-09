package com.hms.api.controller;

import com.hms.api.dto.FeedbackRequest;
import com.hms.application.FeedbackService;
import com.hms.domain.Feedback;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(originPatterns = {"http://localhost:*", "https://hms-frontend-45nu.onrender.com"})
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<Feedback> submitFeedback(@RequestBody FeedbackRequest request) {
        Feedback saved = feedbackService.saveFeedback(
                request.getPatientId(),
                request.getDoctorId(),
                request.getRating(),
                request.getComment()
        );
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Feedback>> getDoctorFeedback(@PathVariable Long doctorId) {
        List<Feedback> feedback = feedbackService.getDoctorFeedback(doctorId);
        return ResponseEntity.ok(feedback);
    }
}
