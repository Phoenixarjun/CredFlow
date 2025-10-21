package com.project.credflow.repository;

import com.project.credflow.model.Invoice;
import com.project.credflow.enums.InvoiceStatus; // <-- 1. IMPORT THE ENUM
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {

    List<Invoice> findByAccount_AccountId(UUID accountId);

    List<Invoice> findByStatus(InvoiceStatus status);

    long countByStatus(InvoiceStatus status);

    @Query("SELECT SUM(i.amountDue) FROM Invoice i WHERE i.status = :status")
    BigDecimal sumAmountDueByStatus(InvoiceStatus status);
}