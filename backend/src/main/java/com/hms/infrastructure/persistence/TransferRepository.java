package com.hms.infrastructure.persistence;

import com.hms.domain.TransferRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransferRepository extends JpaRepository<TransferRequest, Long> {
    List<TransferRequest> findByToHospitalId(Long hospitalId);
    List<TransferRequest> findByFromHospitalId(Long hospitalId);
    List<TransferRequest> findByStatus(String status);
}
