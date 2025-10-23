package com.project.credflow.repository;

import com.project.credflow.model.CallLog;
import com.project.credflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public interface CallLogRepository extends JpaRepository<CallLog, UUID> {

    List<CallLog> findByTask_TaskIdOrderByCreatedAtDesc(UUID taskId);

    List<CallLog> findByAgent_UserIdOrderByCreatedAtDesc(UUID agentId);

    long countByAgent(User agent);

    @Query("SELECT c.callOutcome as outcome, COUNT(c) as count " +
            "FROM CallLog c " +
            "WHERE c.agent = :agent " +
            "  AND c.createdAt >= :startDate " +
            "GROUP BY c.callOutcome")
    List<Map<String, Object>> getCallOutcomeBreakdown(@Param("agent") User agent, @Param("startDate") LocalDateTime startDate);
}