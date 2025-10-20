package com.project.credflow.repository;

import com.project.credflow.model.DunningExecutionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DunningExecutionLogRepository extends JpaRepository<DunningExecutionLog, UUID> {


    boolean existsByDunningRule_RuleIdAndInvoice_InvoiceId(UUID ruleId, UUID invoiceId);

    Optional<DunningExecutionLog> findFirstByOrderByExecutedAtDesc();

    long countByExecutedAtBetween(LocalDateTime start, LocalDateTime end);
}