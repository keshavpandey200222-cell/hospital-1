package com.hms.application;

import com.hms.domain.Medication;
import com.hms.domain.MedicationLog;
import com.hms.infrastructure.persistence.MedicationLogRepository;
import com.hms.infrastructure.persistence.MedicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicationService {

    @Autowired
    private MedicationRepository medicationRepository;

    @Autowired
    private MedicationLogRepository medicationLogRepository;

    @Transactional
    public Medication prescribeMedication(Medication medication) {
        if (medication == null) throw new IllegalArgumentException("Medication cannot be null");
        Medication saved = medicationRepository.save(medication);
        generateLogsForMedication(saved);
        return saved;
    }

    private void generateLogsForMedication(Medication medication) {
        List<MedicationLog> logs = new ArrayList<>();
        List<LocalTime> times = Arrays.stream(medication.getScheduleTimes().split(","))
                .map(String::trim)
                .map(LocalTime::parse)
                .collect(Collectors.toList());

        LocalDate current = medication.getStartDate();
        while (!current.isAfter(medication.getEndDate())) {
            for (LocalTime time : times) {
                MedicationLog log = new MedicationLog();
                log.setMedication(medication);
                log.setScheduledTime(LocalDateTime.of(current, time));
                log.setStatus("PENDING");
                logs.add(log);
            }
            current = current.plusDays(1);
        }
        medicationLogRepository.saveAll(logs);
    }

    @Transactional
    public void markAsTaken(Long logId) {
        MedicationLog log = medicationLogRepository.findById(logId)
                .orElseThrow(() -> new RuntimeException("Medication log not found"));
        log.setStatus("TAKEN");
        log.setTakenTime(LocalDateTime.now());
        medicationLogRepository.save(log);
    }

    public List<MedicationLog> getTodaysSchedule(Long patientId) {
        if (patientId == null) throw new IllegalArgumentException("Patient ID cannot be null");
        LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.now().with(LocalTime.MAX);
        return medicationLogRepository.findByMedicationPatientIdAndScheduledTimeBetween(patientId, startOfDay, endOfDay);
    }
}
