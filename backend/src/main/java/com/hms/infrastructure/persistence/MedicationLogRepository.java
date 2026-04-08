package com.hms.infrastructure.persistence;

import com.hms.domain.MedicationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MedicationLogRepository extends JpaRepository<MedicationLog, Long> {
    List<MedicationLog> findByMedicationIdAndStatus(Long medicationId, String status);
    List<MedicationLog> findByScheduledTimeBeforeAndStatus(LocalDateTime time, String status);
    List<MedicationLog> findByMedicationPatientIdAndScheduledTimeBetween(Long patientId, LocalDateTime start, LocalDateTime end);
}
