package com.hms.infrastructure.scheduler;

import com.hms.domain.MedicationLog;
import com.hms.infrastructure.persistence.MedicationLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class MedicationScheduler {

    private static final Logger logger = LoggerFactory.getLogger(MedicationScheduler.class);

    @Autowired
    private MedicationLogRepository medicationLogRepository;

    /**
     * Runs every minute to check for due medications.
     */
    @Scheduled(cron = "0 * * * * *")
    public void checkForReminders() {
        LocalDateTime now = LocalDateTime.now();
        logger.info("Checking for medication reminders at {}", now);

        List<MedicationLog> dueLogs = medicationLogRepository.findByScheduledTimeBeforeAndStatus(now, "PENDING");

        for (MedicationLog log : dueLogs) {
            triggerAlert(log);
        }
    }

    private void triggerAlert(MedicationLog log) {
        // In a real application, this would trigger a WebSocket message, Push Notification, or Email.
        // For this demo, we log the alert and mark it as 'NOTIFIED' if we had such a state, 
        // or just rely on the UI fetching 'PENDING' logs.
        String message = String.format("ALERT: Time to take %s (%s) for patient %s %s",
                log.getMedication().getMedicineName(),
                log.getMedication().getDosage(),
                log.getMedication().getPatient().getFirstName(),
                log.getMedication().getPatient().getLastName());
        
        logger.warn(message);
        
        // We could also send this to a WebSocket topic like /topic/notifications/{patientId}
    }
}
