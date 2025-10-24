package com.project.credflow.service.inter;

import com.project.credflow.dto.AccountDto; // Assuming you have this
import com.project.credflow.dto.InvoiceDto;
import com.project.credflow.dto.PlanDto; // Assuming you have this
import com.project.credflow.model.User; // Import User model

import java.util.List;

/**
 * Service interface dedicated to fetching customer-specific data
 * required by AI tools, ensuring proper authorization.
 */
public interface CustomerApiService {


    List<InvoiceDto> getCurrentUserInvoices(User currentUser);


    PlanDto getCurrentUserPlan(User currentUser);

    List<AccountDto> getCurrentUserAccounts(User currentUser);

    // Add more methods as needed, e.g., getCurrentUserBalance(User currentUser)
}