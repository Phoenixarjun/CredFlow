package com.project.credflow.controller;

import com.project.credflow.enums.InvoiceStatus;
import com.project.credflow.enums.BpoTaskStatus;
import com.project.credflow.repository.BpoTaskRepository;
import com.project.credflow.repository.DunningExecutionLogRepository;
import com.project.credflow.repository.InvoiceRepository;
import com.project.credflow.repository.PaymentRepository;
import com.project.credflow.service.inter.DunningEngineService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // <-- 2. MAKE SURE THIS IS IMPORTED
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
//@PreAuthorize("hasRole('ADMIN')") // <-- 3. UNCOMMENT THIS FOR SECURITY
public class AdminDashboardController {

    private final DunningEngineService dunningEngineService;
    private final InvoiceRepository invoiceRepository;
    private final DunningExecutionLogRepository logRepository;
    private final PaymentRepository paymentRepository;
    private final BpoTaskRepository bpoTaskRepository;

    // ... (manuallyRunDunningEngine method is fine) ...
    @PostMapping("/run-engine")
    public ResponseEntity<Map<String, String>> manuallyRunDunningEngine() {
        try {
            dunningEngineService.runDunningProcess();
            return ResponseEntity.ok(Map.of("message", "Dunning process executed successfully."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Error executing dunning process: " + e.getMessage()));
        }
    }


    /**
     * Endpoint to get LIVE stats (not affected by date).
     */
    @GetMapping("/stats-live")
    public ResponseEntity<Map<String, Object>> getLiveStats() {
        Map<String, Object> stats = new HashMap<>();

        // 1. Total Overdue Count
        long totalOverdueCount = invoiceRepository.countByStatus(InvoiceStatus.OVERDUE);
        stats.put("totalOverdueCount", totalOverdueCount);

        // 2. Total Overdue Amount ($)
        BigDecimal totalOverdueAmount = invoiceRepository.sumAmountDueByStatus(InvoiceStatus.OVERDUE);
        stats.put("totalOverdueAmount", totalOverdueAmount != null ? totalOverdueAmount : BigDecimal.ZERO);

        // 3. Pending BPO Tasks (Placeholder)
        // ** 4. UPDATE THIS LINE to use the real count **
        long pendingTasks = bpoTaskRepository.countByStatus(BpoTaskStatus.NEW);
        stats.put("pendingTasks", pendingTasks);

        // 4. Last Run Time
        Optional<LocalDateTime> lastRunTime = logRepository.findFirstByOrderByExecutedAtDesc()
                .map(log -> log.getExecutedAt());
        stats.put("lastRunTime", lastRunTime.orElse(null));

        return ResponseEntity.ok(stats);
    }

    // ... (getKpisByDate method is fine) ...
    @GetMapping("/kpis-by-date")
    public ResponseEntity<Map<String, Object>> getKpisByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        Map<String, Object> kpis = new HashMap<>();
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay();

        // 1. Total Collected ($)
        BigDecimal totalCollected = paymentRepository.sumAmountByCreatedAtBetween(startDateTime, endDateTime);
        kpis.put("totalCollected", totalCollected != null ? totalCollected : BigDecimal.ZERO);

        // 2. Dunning Actions Executed
        long actionsExecuted = logRepository.countByExecutedAtBetween(startDateTime, endDateTime);
        kpis.put("actionsExecuted", actionsExecuted);

        return ResponseEntity.ok(kpis);
    }
}