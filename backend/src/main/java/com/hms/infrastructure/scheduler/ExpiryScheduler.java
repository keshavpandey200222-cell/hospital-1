package com.hms.infrastructure.scheduler;

import com.hms.application.InventoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ExpiryScheduler {

    private static final Logger logger = LoggerFactory.getLogger(ExpiryScheduler.class);

    @Autowired
    private InventoryService inventoryService;

    /**
     * Daily check for expiring medicines at 1 AM.
     */
    @Scheduled(cron = "0 0 1 * * *")
    public void scheduleExpiryCheck() {
        logger.info("Starting daily medicine expiry detection at {}", LocalDateTime.now());
        
        inventoryService.detectExpiringMedicines();
        
        logger.info("Daily medicine expiry detection completed.");
    }

    /**
     * Optional: Running every hour for the demo to show immediate status updates.
     */
    @Scheduled(fixedRate = 3600000)
    public void hourlyDemoUpdate() {
        inventoryService.detectExpiringMedicines();
    }
}
