package com.project.credflow.repository;

import com.project.credflow.enums.BpoTaskStatus;
import com.project.credflow.model.BpoTask;
import com.project.credflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // Import Query
import org.springframework.data.repository.query.Param; // Import Param
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public interface BpoTaskRepository extends JpaRepository<BpoTask, UUID> {

    long countByStatus(BpoTaskStatus status);


    @Query("SELECT t FROM BpoTask t WHERE t.status = 'NEW' OR (t.assignedTo = :agent AND t.status = 'IN_PROGRESS')")
    List<BpoTask> findTaskQueueForAgent(@Param("agent") User agent);

    long countByAssignedToAndStatusIn(User agent, List<BpoTaskStatus> statuses);

    @Query("SELECT t.status as status, COUNT(t) as count FROM BpoTask t GROUP BY t.status")
    List<Map<String, Object>> getStatusBreakdown();

}