package com.project.credflow.service.inter;

import com.project.credflow.enums.NotificationChannel;
import com.project.credflow.enums.NotificationStatus;
import com.project.credflow.model.Customer;

public interface NotificationLogService {


    void logNotification(Customer customer, NotificationChannel channel, String templateName, NotificationStatus status, String failureReason);
}