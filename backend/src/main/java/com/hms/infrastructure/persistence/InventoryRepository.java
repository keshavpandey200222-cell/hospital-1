package com.hms.infrastructure.persistence;

import com.hms.domain.MedicineInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<MedicineInventory, Long> {
    List<MedicineInventory> findByHospitalId(Long hospitalId);
    List<MedicineInventory> findByExpiryDateBeforeAndStatus(LocalDate date, String status);
    List<MedicineInventory> findByStatus(String status);
}
