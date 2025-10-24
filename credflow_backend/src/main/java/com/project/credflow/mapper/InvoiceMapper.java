package com.project.credflow.mapper;

import com.project.credflow.dto.InvoiceDto;
import com.project.credflow.enums.InvoiceStatus;
import com.project.credflow.model.Invoice;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Component
public class InvoiceMapper {

    public InvoiceDto toInvoiceDto(Invoice invoice) {
        if (invoice == null) {
            return null;
        }

        InvoiceDto dto = new InvoiceDto();
        dto.setInvoiceId(invoice.getInvoiceId());
        dto.setInvoiceNumber(invoice.getInvoiceNumber());
        dto.setAmountDue(invoice.getAmountDue());
        dto.setDueDate(invoice.getDueDate());
        dto.setStatus(invoice.getStatus());

        Integer days = null;
        if (invoice.getStatus() == InvoiceStatus.OVERDUE && invoice.getDueDate() != null) {
            long daysBetween = ChronoUnit.DAYS.between(invoice.getDueDate(), LocalDate.now());
            days = (int) Math.max(0, daysBetween);
        }
        dto.setOverdueDays(days);

        return dto;
    }
}