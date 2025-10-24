package com.project.credflow.service.impl;

import com.project.credflow.model.Customer;
import com.project.credflow.model.Invoice;
import com.project.credflow.model.NotificationTemplate;
import com.project.credflow.model.User;
import com.project.credflow.service.inter.EmailService;
import com.project.credflow.service.inter.NotificationLogService;
import com.project.credflow.enums.NotificationChannel;
import com.project.credflow.enums.NotificationStatus;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;
    private final NotificationLogService notificationLogService;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public void sendDunningEmail(Invoice invoice, NotificationTemplate template) {
        Customer customer = invoice.getAccount().getCustomer();

        if (customer == null || customer.getUser() == null || customer.getUser().getEmail() == null) {
            log.warn("Cannot send email: Customer, associated User, or User's email is null for invoice {}", invoice.getInvoiceId());
            if (customer != null) {
                notificationLogService.logNotification(customer, NotificationChannel.EMAIL, template.getTemplateName(), NotificationStatus.FAILED, "Recipient email address missing or user not found");
            }
            return;
        }

        User user = customer.getUser();
        String recipientEmail = user.getEmail();

        try {
            String subject = processTemplateBody(template.getSubject(), invoice, user);
            String body = processTemplateBody(template.getBody(), invoice, user);

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(recipientEmail);
            helper.setSubject(subject);
            helper.setText(body, true);

            mailSender.send(mimeMessage);

            log.info("Successfully sent dunning email to {} for invoice {}", recipientEmail, invoice.getInvoiceNumber());

            notificationLogService.logNotification(customer, NotificationChannel.EMAIL, template.getTemplateName(), NotificationStatus.SENT, null);

        } catch (MessagingException e) {
            log.error("Failed to send dunning email for invoice {}: {}", invoice.getInvoiceId(), e.getMessage(), e);
            notificationLogService.logNotification(customer, NotificationChannel.EMAIL, template.getTemplateName(), NotificationStatus.FAILED, e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error sending dunning email for invoice {}: {}", invoice.getInvoiceId(), e.getMessage(), e);
            notificationLogService.logNotification(customer, NotificationChannel.EMAIL, template.getTemplateName(), NotificationStatus.FAILED, "Unexpected error: " + e.getMessage());
        }
    }


    private String processTemplateBody(String body, Invoice invoice, User user) {
        if (body == null) return "";

        body = body.replace("[CustomerName]", user.getFullName());
        body = body.replace("[InvoiceNumber]", invoice.getInvoiceNumber());
        body = body.replace("[AmountDue]", String.format("%.2f", invoice.getAmountDue()));

        if (invoice.getDueDate() != null) {
            body = body.replace("[DueDate]", invoice.getDueDate().toString());
        }

        long daysOverdue = 0;
        if (invoice.getDueDate() != null && invoice.getDueDate().isBefore(java.time.LocalDate.now())) {
            daysOverdue = ChronoUnit.DAYS.between(invoice.getDueDate(), java.time.LocalDate.now());
        }
        body = body.replace("[DaysOverdue]", String.valueOf(daysOverdue));

        body = body.replace("[PortalLink]", "http://localhost:5173/customer/payments"); // Update link if needed

        if (invoice.getAccount() != null) {
            body = body.replace("[AccountNumber]", invoice.getAccount().getAccountNumber());
            body = body.replace("[TotalAmountDue]", String.format("%.2f", invoice.getAccount().getCurrentBalance()));
        }

        body = body.replace("[AmountPaid]", "N/A");

        return body;
    }
}