package com.hms.api.controller;

import com.hms.application.InventoryService;
import com.hms.domain.MedicineInventory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://localhost:3000")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<MedicineInventory>> getHospitalInventory(@PathVariable Long hospitalId) {
        return ResponseEntity.ok(inventoryService.getHospitalInventory(hospitalId));
    }

    @PostMapping("/add")
    public ResponseEntity<MedicineInventory> addMedicine(@RequestBody MedicineInventory medicine) {
        return ResponseEntity.ok(inventoryService.addMedicine(medicine));
    }

    @GetMapping("/global/expiring")
    public ResponseEntity<List<MedicineInventory>> getGlobalExpiringPool() {
        return ResponseEntity.ok(inventoryService.getGlobalExpiringPool());
    }
}
