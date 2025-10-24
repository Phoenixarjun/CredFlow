package com.project.credflow.service.impl;

import com.project.credflow.enums.NotificationChannel;
import com.project.credflow.enums.NotificationStatus;
import com.project.credflow.model.Customer;
import com.project.credflow.model.NotificationLog;
import com.project.credflow.repository.NotificationLogRepository;
import com.project.credflow.service.inter.NotificationLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationLogServiceImpl implements NotificationLogService {

    private final NotificationLogRepository notificationLogRepository;

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logNotification(Customer customer, NotificationChannel channel, String templateName, NotificationStatus status, String failureReason) {
        try {
            NotificationLog logEntry = new NotificationLog(
                    customer,
                    channel,
                    templateName,
                    status,
                    (failureReason != null && failureReason.length() > 1000) ? failureReason.substring(0, 1000) : failureReason
            );
            notificationLogRepository.save(logEntry);
            log.debug("Notification log saved for customer {}, status {}", customer.getCustomerId(), status);
        } catch (Exception e) {
            log.error("CRITICAL: Failed to save notification log for customer {}: {}", customer.getCustomerId(), e.getMessage());
        }
    }
}