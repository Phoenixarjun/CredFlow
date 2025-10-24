package com.project.credflow.repository;

import com.project.credflow.model.DunningEngineRun;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DunningEngineRunRepository extends JpaRepository<DunningEngineRun, UUID> {


    Optional<DunningEngineRun> findTopByOrderByStartTimeDesc();
}