package com.hms.application;

import com.hms.domain.MedicineInventory;
import com.hms.infrastructure.persistence.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    public List<MedicineInventory> getHospitalInventory(Long hospitalId) {
        return inventoryRepository.findByHospitalId(hospitalId);
    }

    public List<MedicineInventory> getGlobalExpiringPool() {
        return inventoryRepository.findByStatus("EXPIRING");
    }

    @Transactional
    public MedicineInventory addMedicine(MedicineInventory medicine) {
        // Initial status check
        updateMedicineStatus(medicine);
        return inventoryRepository.save(medicine);
    }

    @Transactional
    public void detectExpiringMedicines() {
        LocalDate thresholdDate = LocalDate.now().plusDays(14); // 14 days threshold
        List<MedicineInventory> expiringSoon = inventoryRepository.findByExpiryDateBeforeAndStatus(thresholdDate, "AVAILABLE");
        
        for (MedicineInventory med : expiringSoon) {
            med.setStatus("EXPIRING");
        }
        inventoryRepository.saveAll(expiringSoon);
    }

    private void updateMedicineStatus(MedicineInventory medicine) {
        LocalDate thresholdDate = LocalDate.now().plusDays(14);
        if (medicine.getExpiryDate().isBefore(thresholdDate)) {
            medicine.setStatus("EXPIRING");
        } else {
            medicine.setStatus("AVAILABLE");
        }
    }
}
