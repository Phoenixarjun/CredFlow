package com.project.credflow.service.inter;

import com.project.credflow.dto.AiAdminSummaryDto;
import java.util.UUID;

public interface AdminAiService {

    AiAdminSummaryDto generateCustomerSummary(UUID customerId);
}