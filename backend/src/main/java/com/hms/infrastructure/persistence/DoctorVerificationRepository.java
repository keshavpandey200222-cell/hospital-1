package com.hms.infrastructure.persistence;

import com.hms.domain.DoctorVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorVerificationRepository extends JpaRepository<DoctorVerification, Long> {
    List<DoctorVerification> findByDoctorId(Long doctorId);
    List<DoctorVerification> findByStatus(String status);
}
