package com.project.credflow.repository;

import com.project.credflow.enums.RoleName;
import com.project.credflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    List<User> findByRole_RoleName(RoleName roleName);

    boolean existsByEmail(String email);
}