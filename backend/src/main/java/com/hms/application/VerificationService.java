package com.hms.application;

import com.hms.domain.Doctor;
import com.hms.domain.DoctorVerification;
import com.hms.infrastructure.persistence.DoctorRepository;
import com.hms.infrastructure.persistence.DoctorVerificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VerificationService {

    private final DoctorVerificationRepository verificationRepository;
    private final DoctorRepository doctorRepository;

    public VerificationService(DoctorVerificationRepository verificationRepository, DoctorRepository doctorRepository) {
        this.verificationRepository = verificationRepository;
        this.doctorRepository = doctorRepository;
    }

    @Transactional
    public DoctorVerification submitVerification(Long doctorId, String docType, String filePath, String licenseNumber, String qualification) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Update doctor profile with license and qualification
        doctor.setLicenseNumber(licenseNumber);
        doctor.setQualification(qualification);
        doctorRepository.save(doctor);

        DoctorVerification verification = new DoctorVerification();
        verification.setDoctor(doctor);
        verification.setDocType(docType);
        verification.setFilePath(filePath);
        verification.setStatus("PENDING");
        
        return verificationRepository.save(verification);
    }

    public List<DoctorVerification> getPendingVerifications() {
        return verificationRepository.findByStatus("PENDING");
    }

    @Transactional
    public DoctorVerification updateVerificationStatus(Long verificationId, String status, String adminNotes) {
        DoctorVerification verification = verificationRepository.findById(verificationId)
                .orElseThrow(() -> new RuntimeException("Verification request not found"));

        verification.setStatus(status);
        verification.setAdminNotes(adminNotes);

        if ("APPROVED".equalsIgnoreCase(status)) {
            Doctor doctor = verification.getDoctor();
            doctor.setIsVerified(true);
            doctorRepository.save(doctor);
        }

        return verificationRepository.save(verification);
    }

    public List<DoctorVerification> getDoctorVerifications(Long doctorId) {
        return verificationRepository.findByDoctorId(doctorId);
    }
}
