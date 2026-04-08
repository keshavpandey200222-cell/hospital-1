package com.hms.application;

import com.hms.domain.MedicineInventory;
import com.hms.domain.TransferRequest;
import com.hms.infrastructure.persistence.InventoryRepository;
import com.hms.infrastructure.persistence.TransferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TransferService {

    @Autowired
    private TransferRepository transferRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    public List<TransferRequest> getIncomingRequests(Long hospitalId) {
        return transferRepository.findByToHospitalId(hospitalId);
    }

    public List<TransferRequest> getOutgoingRequests(Long hospitalId) {
        return transferRepository.findByFromHospitalId(hospitalId);
    }

    @Transactional
    public TransferRequest createRequest(TransferRequest request) {
        request.setStatus("PENDING");
        return transferRepository.save(request);
    }

    @Transactional
    public void approveTransfer(Long requestId) {
        TransferRequest request = transferRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        MedicineInventory med = request.getMedicine();
        if (med.getQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient quantity for transfer");
        }

        // Deduct from source
        med.setQuantity(med.getQuantity() - request.getQuantity());
        if (med.getQuantity() == 0) {
            med.setStatus("TRANSFERRED");
        }
        inventoryRepository.save(med);

        // Update status
        request.setStatus("APPROVED");
        transferRepository.save(request);
        
        // In a real app, we would create a new Inventory record for the TO_HOSPITAL here or wait for completion.
    }
}
