package com.project.credflow.dto;

import com.project.credflow.enums.InvoiceStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class InvoiceDto {
    private UUID invoiceId;
    private String invoiceNumber;
    private BigDecimal amountDue;
    private LocalDate dueDate;
    private InvoiceStatus status;
    private Integer overdueDays;
}