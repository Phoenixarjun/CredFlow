package com.project.credflow.mapper;

import com.project.credflow.dto.AccountDto;
import com.project.credflow.model.Account;
import org.springframework.stereotype.Component;

@Component
public class AccountMapper {

    public AccountDto toAccountDto(Account account) {
        if (account == null) {
            return null;
        }

        AccountDto dto = new AccountDto();
        dto.setAccountId(account.getAccountId());
        dto.setAccountNumber(account.getAccountNumber());
        dto.setAccountType(account.getAccountType());
        dto.setStatus(account.getStatus());
        dto.setCurrentBalance(account.getCurrentBalance());

        return dto;
    }
}