package com.project.credflow.repository;

import com.project.credflow.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<Account, UUID> {


    List<Account> findByCustomer_CustomerId(UUID customerId);

    List<Account> findByAccountNumberContainingIgnoreCase(String accountNumberQuery);
}