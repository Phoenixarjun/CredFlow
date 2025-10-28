package com.project.credflow.repository;

import com.project.credflow.model.Account;
import com.project.credflow.model.Invoice;
import com.project.credflow.enums.InvoiceStatus; // <-- 1. IMPORT THE ENUM
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {

    List<Invoice> findByAccount_AccountId(UUID accountId);

    List<Invoice> findByStatus(InvoiceStatus status);

    long countByStatus(InvoiceStatus status);

    @Query("SELECT COALESCE(SUM(i.amountDue), 0) FROM Invoice i WHERE i.status = :status")
    BigDecimal sumAmountDueByStatus(InvoiceStatus status);

    long countByAccountAndStatus(Account account, InvoiceStatus status);


    @Query(value =
            "SELECT " +
                    "  COALESCE(SUM(CASE WHEN DATEDIFF(CURDATE(), i.due_date) BETWEEN 0 AND 7 THEN i.amount_due ELSE 0 END), 0) AS '0-7 Days', " +
                    "  COALESCE(SUM(CASE WHEN DATEDIFF(CURDATE(), i.due_date) BETWEEN 8 AND 14 THEN i.amount_due ELSE 0 END), 0) AS '8-14 Days', " +
                    "  COALESCE(SUM(CASE WHEN DATEDIFF(CURDATE(), i.due_date) BETWEEN 15 AND 30 THEN i.amount_due ELSE 0 END), 0) AS '15-30 Days', " +
                    "  COALESCE(SUM(CASE WHEN DATEDIFF(CURDATE(), i.due_date) > 30 THEN i.amount_due ELSE 0 END), 0) AS '30+ Days' " +
                    "FROM invoices i " +
                    "WHERE i.status = 'OVERDUE'",
            nativeQuery = true
    )
    Map<String, Object> getOverdueAgingBuckets();

    @Query("SELECT COALESCE(SUM(i.amountDue), 0) FROM Invoice i WHERE DATE(i.createdAt) BETWEEN :startDate AND :endDate")
    BigDecimal sumInvoicesCreatedBetweenDates(LocalDate startDate, LocalDate endDate);

    List<Invoice> findByAccountAccountIdInOrderByDueDateDesc(List<UUID> accountIds);


    @Query("SELECT inv FROM Invoice inv JOIN inv.account acc JOIN acc.plan p " +
            "WHERE inv.status = com.project.credflow.enums.InvoiceStatus.PENDING " +
            "AND p.planType = com.project.credflow.enums.PlanType.PREPAID " +
            "AND inv.dueDate <= :lookaheadDate")
    List<Invoice> findPendingPrepaidInvoicesDueBefore(@Param("lookaheadDate") LocalDate lookaheadDate);
}