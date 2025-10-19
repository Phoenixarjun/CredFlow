package com.project.credflow.mapper;

import com.project.credflow.dto.InvoiceDto;
import com.project.credflow.model.Invoice;
import org.springframework.stereotype.Component;

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

        return dto;
    }
}