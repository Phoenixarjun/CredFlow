package com.project.credflow.repository;

import com.project.credflow.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {

    List<Invoice> findByStatus(String status);

    List<Invoice> findByAccount_AccountId(UUID accountId);

    long countByStatus(String status);


    @Query("SELECT SUM(i.amountDue) FROM Invoice i WHERE i.status = :status")
    BigDecimal sumAmountDueByStatus(String status);
}