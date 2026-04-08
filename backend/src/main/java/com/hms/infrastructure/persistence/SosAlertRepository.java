package com.hms.infrastructure.persistence;

import com.hms.domain.SosAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SosAlertRepository extends JpaRepository<SosAlert, Long> {
    List<SosAlert> findByPatientIdOrderByCreatedAtDesc(Long patientId);
    List<SosAlert> findByHospitalIdAndStatusNot(Long hospitalId, String status);
}
