package com.hms.infrastructure.persistence;

import com.hms.domain.Medication;
import com.hms.domain.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationRepository extends JpaRepository<Medication, Long> {
    List<Medication> findByPatientAndIsActiveTrue(Patient patient);
    List<Medication> findByIsActiveTrue();
}
