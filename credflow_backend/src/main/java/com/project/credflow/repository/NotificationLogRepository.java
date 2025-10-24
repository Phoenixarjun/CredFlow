package com.project.credflow.repository;

import com.project.credflow.model.Customer;
import com.project.credflow.model.NotificationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLog, UUID> {

    List<NotificationLog> findByCustomerOrderBySentAtDesc(Customer customer);
}