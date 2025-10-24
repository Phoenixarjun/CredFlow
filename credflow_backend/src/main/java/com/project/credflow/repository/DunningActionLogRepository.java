package com.project.credflow.repository;

import com.project.credflow.model.DunningActionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public interface DunningActionLogRepository extends JpaRepository<DunningActionLog, UUID> {

    @Query("SELECT da.actionType as action, COUNT(da) as count FROM DunningActionLog da " +
            "WHERE da.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY da.actionType")
    List<Map<String, Object>> getActionBreakdown(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT dal FROM DunningActionLog dal JOIN Invoice i ON dal.invoiceId = i.invoiceId " +
            "JOIN Account a ON i.account = a " +
            "WHERE a.customer.customerId = :customerId " +
            "ORDER BY dal.createdAt DESC")
    List<DunningActionLog> findByCustomer(UUID customerId);
}