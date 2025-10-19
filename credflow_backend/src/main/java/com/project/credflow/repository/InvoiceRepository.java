package com.project.credflow.repository;

import com.project.credflow.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {


    List<Invoice> findByAccount_AccountId(UUID accountId);
}