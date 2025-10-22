package com.project.credflow.repository;

import com.project.credflow.model.CallLog;
import com.project.credflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CallLogRepository extends JpaRepository<CallLog, UUID> {

    List<CallLog> findByTask_TaskIdOrderByCreatedAtDesc(UUID taskId);

    List<CallLog> findByAgent_UserIdOrderByCreatedAtDesc(UUID agentId);

    long countByAgent(User agent);
}