package com.project.credflow.repository;

import com.project.credflow.model.DunningActionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public interface DunningActionLogRepository extends JpaRepository<DunningActionLog, UUID> {

    @Query("SELECT da.actionType as action, COUNT(da) as count FROM DunningActionLog da " +
            "WHERE da.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY da.actionType")
    List<Map<String, Object>> getActionBreakdown(LocalDateTime startDate, LocalDateTime endDate);
}