package com.project.credflow.service.impl;

import com.project.credflow.model.Customer;
import com.project.credflow.model.Invoice;
import com.project.credflow.model.NotificationTemplate;
import com.project.credflow.model.User;
import com.project.credflow.service.inter.EmailService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public void sendDunningEmail(Invoice invoice, NotificationTemplate template) {
        Customer customer = invoice.getAccount().getCustomer();

        // ** 2. CHECK CUSTOMER AND GET THE USER **
        if (customer == null || customer.getUser() == null || customer.getUser().getEmail() == null) {
            log.warn("Cannot send email: Customer, associated User, or User's email is null for invoice {}", invoice.getInvoiceId());
            return;
        }

        User user = customer.getUser(); // Get the User from the Customer

        try {
            // ** 3. PASS THE USER (NOT CUSTOMER) TO processTemplateBody **
            String body = processTemplateBody(template.getBody(), invoice, user);

            // 2. Create the email message
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);

            // ** 4. SET "TO" USING THE USER'S EMAIL **
            message.setTo(user.getEmail());

            message.setSubject(template.getSubject()); // Use subject from template
            message.setText(body);

            // 3. Send the email
            mailSender.send(message);

            log.info("Successfully sent dunning email to {} for invoice {}", user.getEmail(), invoice.getInvoiceNumber());

        } catch (Exception e) {
            log.error("Failed to send dunning email for invoice {}: {}", invoice.getInvoiceId(), e.getMessage(), e);
        }
    }

    /**
     * Replaces placeholders in the template body with actual data.
     * ** 5. UPDATED SIGNATURE TO ACCEPT User **
     */
    private String processTemplateBody(String body, Invoice invoice, User user) {
        // Basic placeholder replacement
        return body
                // ** 6. GET FULL NAME FROM USER **
                .replace("[CustomerName]", user.getFullName())
                .replace("[InvoiceNumber]", invoice.getInvoiceNumber())
                .replace("[AmountDue]", String.format("%.2f", invoice.getAmountDue()))
                .replace("[DueDate]", invoice.getDueDate().toString());
        // Add more placeholders as needed
    }
}