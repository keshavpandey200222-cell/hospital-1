package com.hms.application;

import com.hms.domain.Doctor;
import com.hms.domain.Hospital;
import com.hms.infrastructure.persistence.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SuggestionService {

    @Autowired
    private DoctorRepository doctorRepository;

    public static class RankedDoctor {
        public Doctor doctor;
        public double score;
        public double distance;

        public RankedDoctor(Doctor doctor, double score, double distance) {
            this.doctor = doctor;
            this.score = score;
            this.distance = distance;
        }
    }

    public List<RankedDoctor> getRankedSuggestions(String specialty, double userLat, double userLon) {
        List<Doctor> doctors = doctorRepository.findBySpecialtyAndAvailableTrue(specialty);

        List<RankedDoctor> ranked = new ArrayList<>();
        for (Doctor doctor : doctors) {
            Hospital hospital = doctor.getHospital();
            if (hospital == null) continue;

            double distance = calculateDistance(userLat, userLon, hospital.getLatitude(), hospital.getLongitude());
            double score = calculateScore(distance, doctor.getRating(), hospital.getEmergencyAvailable());
            
            ranked.add(new RankedDoctor(doctor, score, distance));
        }

        return ranked.stream()
                .sorted(Comparator.comparingDouble(r -> r.score))
                .collect(Collectors.toList());
    }

    private double calculateDistance(double lat1, double lon1, Double lat2, Double lon2) {
        // Simplified Haversine or simple Euclidean for demo purposes
        // If lat/lon are null, return a large distance
        if (lat2 == null || lon2 == null) return 100.0;
        
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return 6371 * c; // Earth radius in km
    }

    private double calculateScore(double distance, java.math.BigDecimal rating, Boolean emergencySupport) {
        double r = (rating != null) ? rating.doubleValue() : 3.0;
        double e = (emergencySupport != null && emergencySupport) ? 0.0 : 1.0; 

        // Score formula: (0.4 * distance) + (0.3 * (5.0 - rating)) + (0.1 * emergency_penalty)
        // Lower score is better.
        return (0.4 * distance) + (0.3 * (5.0 - r)) + (0.1 * e);
    }
}
