package com.hms.api.controller;

import com.hms.application.TransferService;
import com.hms.domain.TransferRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transfers")
@CrossOrigin(origins = "http://localhost:3000")
public class SharingController {

    @Autowired
    private TransferService transferService;

    @PostMapping("/request")
    public ResponseEntity<TransferRequest> createRequest(@RequestBody TransferRequest request) {
        return ResponseEntity.ok(transferService.createRequest(request));
    }

    @GetMapping("/hospital/{hospitalId}/incoming")
    public ResponseEntity<List<TransferRequest>> getIncomingRequests(@PathVariable Long hospitalId) {
        return ResponseEntity.ok(transferService.getIncomingRequests(hospitalId));
    }

    @PatchMapping("/{requestId}/approve")
    public ResponseEntity<Void> approveTransfer(@PathVariable Long requestId) {
        transferService.approveTransfer(requestId);
        return ResponseEntity.noContent().build();
    }
}
