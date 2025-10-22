package com.project.credflow.repository;

import com.project.credflow.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {


    List<Payment> findByInvoice_InvoiceId(UUID invoiceId);

    @Query("SELECT SUM(p.amountPaid) FROM Payment p WHERE p.createdAt BETWEEN :start AND :end")
    BigDecimal sumAmountByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT COALESCE(SUM(p.amountPaid), 0) FROM Payment p WHERE p.status = 'SUCCESS' AND p.paymentDate BETWEEN :startDate AND :endDate")
    BigDecimal sumSuccessfulPaymentsBetweenDates(LocalDate startDate, LocalDate endDate);


}