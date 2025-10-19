package com.project.credflow.dto;

import com.project.credflow.enums.PaymentMethod;
import com.project.credflow.enums.PaymentStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class PaymentDto {
    private UUID paymentId;
    private BigDecimal amountPaid;
    private LocalDate paymentDate;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}