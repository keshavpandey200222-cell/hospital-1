package com.hms.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "transfer_requests")
public class TransferRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "from_hospital_id", nullable = false)
    private Hospital fromHospital;

    @ManyToOne
    @JoinColumn(name = "to_hospital_id", nullable = false)
    private Hospital toHospital;

    @ManyToOne
    @JoinColumn(name = "medicine_id", nullable = false)
    private MedicineInventory medicine;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private String status; // PENDING, APPROVED, REJECTED, COMPLETED

    @Column
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Hospital getFromHospital() { return fromHospital; }
    public void setFromHospital(Hospital fromHospital) { this.fromHospital = fromHospital; }

    public Hospital getToHospital() { return toHospital; }
    public void setToHospital(Hospital toHospital) { this.toHospital = toHospital; }

    public MedicineInventory getMedicine() { return medicine; }
    public void setMedicine(MedicineInventory medicine) { this.medicine = medicine; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
