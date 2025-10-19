package com.project.credflow.mapper;

import com.project.credflow.dto.CustomerDto;
import com.project.credflow.model.Customer;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {

    public CustomerDto toCustomerDto(Customer customer) {
        if (customer == null) {
            return null;
        }

        CustomerDto dto = new CustomerDto();
        dto.setCustomerId(customer.getCustomerId());
        dto.setCompanyName(customer.getCompanyName());
        dto.setAddress(customer.getAddress());
        dto.setContactPerson(customer.getContactPerson());

        if (customer.getUser() != null) {
            dto.setEmail(customer.getUser().getEmail());
            dto.setPhoneNumber(customer.getUser().getPhoneNumber());
        }

        return dto;
    }
}