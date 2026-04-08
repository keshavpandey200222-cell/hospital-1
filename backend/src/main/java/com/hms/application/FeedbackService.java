package com.hms.application;

import com.hms.domain.Doctor;
import com.hms.domain.Feedback;
import com.hms.domain.Patient;
import com.hms.infrastructure.persistence.DoctorRepository;
import com.hms.infrastructure.persistence.FeedbackRepository;
import com.hms.infrastructure.persistence.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Transactional
    public Feedback saveFeedback(Long patientId, Long doctorId, Integer rating, String comment) {
        if (patientId == null || doctorId == null) {
            throw new IllegalArgumentException("Patient ID and Doctor ID must not be null");
        }
        
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Feedback feedback = new Feedback();
        feedback.setPatient(patient);
        feedback.setDoctor(doctor);
        feedback.setRating(rating);
        feedback.setComment(comment);

        Feedback saved = feedbackRepository.save(feedback);
        updateDoctorRating(doctor);
        
        return saved;
    }

    public List<Feedback> getDoctorFeedback(Long doctorId) {
        return feedbackRepository.findByDoctorId(doctorId);
    }

    private void updateDoctorRating(Doctor doctor) {
        List<Feedback> feedbacks = feedbackRepository.findByDoctorId(doctor.getId());
        if (feedbacks.isEmpty()) {
            doctor.setRating(BigDecimal.valueOf(5.0));
            doctor.setReviewCount(0);
        } else {
            double sum = feedbacks.stream().mapToInt(Feedback::getRating).sum();
            double average = sum / feedbacks.size();
            doctor.setRating(BigDecimal.valueOf(average).setScale(2, RoundingMode.HALF_UP));
            doctor.setReviewCount(feedbacks.size());
        }
        doctorRepository.save(doctor);
    }
}
