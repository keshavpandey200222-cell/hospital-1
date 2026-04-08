package com.hms.application;

import com.hms.domain.Ambulance;
import com.hms.domain.Hospital;
import com.hms.domain.Patient;
import com.hms.domain.SosAlert;
import com.hms.infrastructure.persistence.AmbulanceRepository;
import com.hms.infrastructure.persistence.HospitalRepository;
import com.hms.infrastructure.persistence.SosAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class EmergencyResponseService {

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private AmbulanceRepository ambulanceRepository;

    @Autowired
    private SosAlertRepository sosAlertRepository;

    public SosAlert triggerSOS(Patient patient, double lat, double lon, String type) {
        // 1. Find the nearest emergency-ready hospital
        List<Hospital> hospitals = hospitalRepository.findAll();
        Hospital nearestHospital = hospitals.stream()
                .filter(h -> h.getEmergencyAvailable() != null && h.getEmergencyAvailable())
                .min(Comparator.comparingDouble(h -> calculateDistance(lat, lon, h.getLatitude(), h.getLongitude())))
                .orElse(hospitals.isEmpty() ? null : hospitals.get(0));

        // 2. Find the nearest available ambulance
        List<Ambulance> availableAmbulances = ambulanceRepository.findByStatus("AVAILABLE");
        Optional<Ambulance> nearestAmbulance = availableAmbulances.stream()
                .min(Comparator.comparingDouble(a -> calculateDistance(lat, lon, a.getCurrentLatitude(), a.getCurrentLongitude())));

        // 3. Create and save the SOS Alert record
        SosAlert alert = new SosAlert();
        alert.setPatient(patient);
        alert.setLatitude(lat);
        alert.setLongitude(lon);
        alert.setHospital(nearestHospital);
        alert.setEmergencyType(type);
        
        if (nearestAmbulance.isPresent()) {
            Ambulance amb = nearestAmbulance.get();
            alert.setAmbulance(amb);
            alert.setStatus("DISPATCHED");
            
            // Mark ambulance as busy
            amb.setStatus("BUSY");
            ambulanceRepository.save(amb);
        } else {
            alert.setStatus("PENDING");
        }

        return sosAlertRepository.save(alert);
    }

    private double calculateDistance(double lat1, double lon1, Double lat2, Double lon2) {
        if (lat2 == null || lon2 == null) return 1000.0;
        
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return 6371 * c; // Earth radius in km
    }

    public List<SosAlert> getActiveAlertsForHospital(Long hospitalId) {
        return sosAlertRepository.findByHospitalIdAndStatusNot(hospitalId, "COMPLETED");
    }
}
