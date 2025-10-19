package com.project.credflow.repository;

import com.project.credflow.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, UUID> {


    Optional<Customer> findByUser_UserId(UUID userId);
}